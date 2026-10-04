// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./SPVToken.sol";

interface IUniswapV2Router {
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function factory() external view returns (address);
}

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address);
}

contract SPVBondingCurve is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    address public immutable USDT;
    address public constant DEX_ROUTER = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
    address public constant DEAD = 0x000000000000000000000000000000000000dEaD;

    uint256 public constant FEE_DENOM = 10_000;
    uint256 public constant MAX_FEE_BPS = 2_000;
    uint256 public constant MAX_BURN_BPS = 1_200;
    uint256 public constant BASE_BURN_BPS = 50;
    uint256 public constant VOLUME_MULT = 15;

    uint256 public constant CREATOR_FEE_MIN = 50;
    uint256 public constant CREATOR_FEE_BASE = 200;
    uint256 public constant CREATOR_FEE_MAX = 500;

    uint256 public constant PRICE_TIER_2X = 2e18;
    uint256 public constant PRICE_TIER_5X = 5e18;
    uint256 public constant PRICE_TIER_10X = 10e18;

    uint256 public constant VOLUME_TIER_1 = 1_000e6;
    uint256 public constant VOLUME_TIER_2 = 10_000e6;
    uint256 public constant VOLUME_TIER_3 = 100_000e6;

    uint256 public constant TRIGGERS_REQUIRED = 2;
    uint256 public constant MAX_CURVE_DURATION = 90 days;

    SPVToken public spvToken;
    address public creator;

    uint256 public virtualUsdtReserve;
    uint256 public virtualTokenReserve;
    uint256 public realUsdtReserve;
    uint256 public realTokenReserve;

    struct FeeTier { uint256 minHold; uint256 feeBps; }
    FeeTier[] public feeTiers;

    struct UserPosition {
        uint256 totalBought;
        uint256 weightedTime;
        uint256 balance;
    }
    mapping(address => UserPosition) public positions;

    uint256 public dailyVolumeUsdt;
    uint256 public lastVolumeReset;

    uint256 public peakSupply;
    uint256 public supplyFloor;

    uint256 public immutable initialPrice;
    uint256 public immutable launchTime;

    uint256 public priceMultipleTarget;
    uint256 public supplyTarget;
    uint256 public holderTarget;

    uint256 public totalMinted;
    uint256 public uniqueBuyers;
    mapping(address => bool) public hasBought;

    bool public migrated;
    address public dexPair;
    uint256 public migrationTimestamp;
    uint256 public migratedTokenAmount;
    uint256 public migratedUsdtAmount;
    uint256 public lpBurned;
    string public migrationReason;

    event Buy(address indexed buyer, uint256 usdtIn, uint256 tokensOut, uint256 creatorFeeBps, uint256 creatorFee);
    event Sell(address indexed seller, uint256 tokensIn, uint256 usdtOut, uint256 feeTokens, uint256 burned, uint256 creatorFeeBps, uint256 creatorFee);
    event Burn(address indexed from, uint256 amount, uint256 newSupply);
    event VolumeReset(uint256 timestamp);
    event Migrated(address indexed dexPair, uint256 usdtLiquidity, uint256 tokenLiquidity, string reason);
    event LPLocked(address indexed dexPair, uint256 liquidity);
    event CreatorFeeCollected(uint256 amount, uint256 feeBps);
    event MigrationCheckEvaluated(uint256 triggersMet, bool priceOk, bool supplyOk, bool holdersOk);
    event MigrationTargetsUpdated(uint256 priceMultiple, uint256 supplyTarget, uint256 holderTarget);
    event CreatorUpdated(address newCreator);
    event EmergencyWithdraw(address token, uint256 amount);

    constructor(
        address _usdt,
        address _spvToken,
        address _creator,
        uint256 _initialPriceUsdt,
        uint256 _priceMultipleTarget,
        uint256 _supplyTarget,
        uint256 _holderTarget
    ) Ownable(msg.sender) {
        require(_usdt != address(0), "bad usdt");
        require(_spvToken != address(0), "bad token");
        require(_creator != address(0), "bad creator");
        require(_initialPriceUsdt > 0, "bad price");
        require(_priceMultipleTarget >= 2, "multiple too low");
        require(_supplyTarget > 0, "bad supply target");
        require(_holderTarget > 0, "bad holder target");

        USDT = _usdt;
        spvToken = SPVToken(_spvToken);
        creator = _creator;

        virtualTokenReserve = 1_000_000 * 1e18;
        virtualUsdtReserve = (virtualTokenReserve * _initialPriceUsdt) / 1e18;

        // Store initial price in 18-decimal fixed point to match getCurrentPrice()
        initialPrice = _initialPriceUsdt * 1e12;
        launchTime = block.timestamp;

        priceMultipleTarget = _priceMultipleTarget;
        supplyTarget = _supplyTarget;
        holderTarget = _holderTarget;

        peakSupply = 0;
        supplyFloor = 0;
        lastVolumeReset = block.timestamp;

        feeTiers.push(FeeTier(0, 1500));
        feeTiers.push(FeeTier(1 hours, 1000));
        feeTiers.push(FeeTier(24 hours, 500));
        feeTiers.push(FeeTier(7 days, 200));
        feeTiers.push(FeeTier(30 days, 50));
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function getSellFeeBps(uint256 holdTime) public view returns (uint256) {
        uint256 fee = feeTiers[0].feeBps;
        for (uint256 i = 0; i < feeTiers.length; i++) {
            if (holdTime >= feeTiers[i].minHold) fee = feeTiers[i].feeBps;
            else break;
        }
        return fee;
    }

    function getCreatorFeeBps() public view returns (uint256) {
        uint256 base = CREATOR_FEE_BASE;
        uint256 currentPrice = this.getCurrentPrice();
        uint256 priceRatio = initialPrice > 0 ? (currentPrice * 1e18) / initialPrice : 1e18;

        uint256 priceDiscount = 0;
        if (priceRatio >= PRICE_TIER_10X) priceDiscount = 150;
        else if (priceRatio >= PRICE_TIER_5X) priceDiscount = 100;
        else if (priceRatio >= PRICE_TIER_2X) priceDiscount = 50;

        uint256 volumeBoost = 0;
        if (dailyVolumeUsdt >= VOLUME_TIER_3) volumeBoost = 200;
        else if (dailyVolumeUsdt >= VOLUME_TIER_2) volumeBoost = 100;
        else if (dailyVolumeUsdt >= VOLUME_TIER_1) volumeBoost = 50;

        int256 fee = int256(base) - int256(priceDiscount) + int256(volumeBoost);
        if (fee < int256(CREATOR_FEE_MIN)) fee = int256(CREATOR_FEE_MIN);
        if (fee > int256(CREATOR_FEE_MAX)) fee = int256(CREATOR_FEE_MAX);
        return uint256(fee);
    }

    function getBurnBps() public view returns (uint256) {
        uint256 supply = spvToken.totalSupply();
        if (supply <= supplyFloor) return 0;
        uint256 volScaled = (dailyVolumeUsdt * VOLUME_MULT) / 1e9;
        uint256 b = BASE_BURN_BPS + volScaled;
        if (b > MAX_BURN_BPS) b = MAX_BURN_BPS;
        return b;
    }

    function _resetVolumeIfNewDay() internal {
        if (block.timestamp >= lastVolumeReset + 1 days) {
            dailyVolumeUsdt = 0;
            lastVolumeReset = block.timestamp;
            emit VolumeReset(block.timestamp);
        }
    }

    function _updatePositionOnBuy(address user, uint256 amount) internal {
        UserPosition storage p = positions[user];
        p.totalBought += amount;
        p.weightedTime += block.timestamp * amount;
        p.balance += amount;
    }

    function _reducePositionOnSell(address user, uint256 amount) internal {
        UserPosition storage p = positions[user];
        p.balance = p.balance >= amount ? p.balance - amount : 0;
    }

    function _weightedHoldTime(address user) internal view returns (uint256) {
        UserPosition storage p = positions[user];
        if (p.totalBought == 0) return 0;
        uint256 avg = p.weightedTime / p.totalBought;
        return block.timestamp > avg ? block.timestamp - avg : 0;
    }

    function migrationCheck() public view returns (
        uint256 triggersMet,
        bool priceOk,
        bool supplyOk,
        bool holdersOk,
        uint256 currentPrice,
        uint256 currentMinted,
        uint256 currentHolders,
        uint256 timeRemaining
    ) {
        currentPrice = this.getCurrentPrice();
        currentMinted = totalMinted;
        currentHolders = uniqueBuyers;
        priceOk = currentPrice >= (initialPrice * priceMultipleTarget);
        supplyOk = currentMinted >= supplyTarget;
        holdersOk = currentHolders >= holderTarget;
        triggersMet = (priceOk ? 1 : 0) + (supplyOk ? 1 : 0) + (holdersOk ? 1 : 0);
        uint256 deadline = launchTime + MAX_CURVE_DURATION;
        timeRemaining = block.timestamp < deadline ? deadline - block.timestamp : 0;
    }

    function getProgress() external view returns (uint256) {
        ( , , , , uint256 price, uint256 minted, uint256 holders, ) = migrationCheck();
        uint256 priceTarget = initialPrice * priceMultipleTarget;
        uint256 p = priceTarget > 0 ? (price * 1e18) / priceTarget : 0;
        uint256 s = supplyTarget > 0 ? (minted * 1e18) / supplyTarget : 0;
        uint256 h = holderTarget > 0 ? (holders * 1e18) / holderTarget : 0;
        if (p > 1e18) p = 1e18;
        if (s > 1e18) s = 1e18;
        if (h > 1e18) h = 1e18;
        return (p + s + h) / 3;
    }

    function previewSell(address seller, uint256 tokenAmount)
        external
        view
        returns (uint256 usdtOut, uint256 feeTokens, uint256 burnTokens)
    {
        if (tokenAmount == 0) return (0, 0, 0);

        uint256 holdTime = _weightedHoldTime(seller);
        uint256 feeBps = getSellFeeBps(holdTime);
        uint256 burnBps = getBurnBps();

        feeTokens = (tokenAmount * feeBps) / FEE_DENOM;
        burnTokens = (tokenAmount * burnBps) / FEE_DENOM;

        uint256 currentSupply = spvToken.totalSupply();
        if (currentSupply <= burnTokens + supplyFloor) {
            burnTokens = currentSupply > supplyFloor ? currentSupply - supplyFloor : 0;
        }

        uint256 netTokens = tokenAmount - feeTokens - burnTokens;
        if (netTokens == 0) return (0, feeTokens, burnTokens);

        uint256 k = virtualUsdtReserve * virtualTokenReserve;
        uint256 newVtok = virtualTokenReserve + netTokens;
        uint256 newVusdt = k / newVtok;
        uint256 grossUsdt = virtualUsdtReserve - newVusdt;

        uint256 creatorFeeBps = getCreatorFeeBps();
        uint256 creatorFee = (grossUsdt * creatorFeeBps) / FEE_DENOM;

        usdtOut = grossUsdt - creatorFee;
    }

    function _checkAndMigrate() internal {
        (uint256 triggersMet, bool priceOk, bool supplyOk, bool holdersOk, , , , uint256 timeRemaining) = migrationCheck();
        emit MigrationCheckEvaluated(triggersMet, priceOk, supplyOk, holdersOk);
        if (triggersMet >= TRIGGERS_REQUIRED) _migrateToDEX("triggers");
        else if (timeRemaining == 0) _migrateToDEX("timeout");
    }

    function buy(uint256 usdtAmount, uint256 minTokensOut)
        external nonReentrant whenNotPaused returns (uint256 tokensOut)
    {
        require(!migrated, "Migration complete - trade on DEX");
        require(usdtAmount > 0, "zero USDT");

        _resetVolumeIfNewDay();
        IERC20(USDT).safeTransferFrom(msg.sender, address(this), usdtAmount);

        uint256 creatorFeeBps = getCreatorFeeBps();
        uint256 creatorFee = (usdtAmount * creatorFeeBps) / FEE_DENOM;
        uint256 netUsdt = usdtAmount - creatorFee;
        require(netUsdt > 0, "net zero");

        uint256 k = virtualUsdtReserve * virtualTokenReserve;
        uint256 newVusdt = virtualUsdtReserve + netUsdt;
        uint256 newVtok = k / newVusdt;
        tokensOut = virtualTokenReserve - newVtok;

        require(tokensOut > 0, "zero tokens");
        require(tokensOut >= minTokensOut, "slippage");

        virtualUsdtReserve = newVusdt;
        virtualTokenReserve = newVtok;
        realUsdtReserve += netUsdt;
        realTokenReserve += tokensOut;

        spvToken.mint(msg.sender, tokensOut);
        totalMinted += tokensOut;

        if (!hasBought[msg.sender]) {
            hasBought[msg.sender] = true;
            uniqueBuyers += 1;
        }

        uint256 newSupply = spvToken.totalSupply();
        if (newSupply > peakSupply) {
            peakSupply = newSupply;
            supplyFloor = (newSupply * 1_000) / FEE_DENOM;
        }

        _updatePositionOnBuy(msg.sender, tokensOut);
        dailyVolumeUsdt += usdtAmount;

        if (creatorFee > 0) {
            IERC20(USDT).safeTransfer(creator, creatorFee);
            emit CreatorFeeCollected(creatorFee, creatorFeeBps);
        }

        emit Buy(msg.sender, usdtAmount, tokensOut, creatorFeeBps, creatorFee);
        _checkAndMigrate();
        return tokensOut;
    }

    function sell(uint256 tokenAmount, uint256 minUsdtOut)
        external nonReentrant whenNotPaused returns (uint256 usdtOut)
    {
        require(!migrated, "Migration complete - trade on DEX");
        require(tokenAmount > 0, "zero tokens");
        require(spvToken.balanceOf(msg.sender) >= tokenAmount, "balance");

        _resetVolumeIfNewDay();

        uint256 holdTime = _weightedHoldTime(msg.sender);
        uint256 feeBps = getSellFeeBps(holdTime);
        uint256 burnBps = getBurnBps();
        uint256 creatorFeeBps = getCreatorFeeBps();

        spvToken.transferFrom(msg.sender, address(this), tokenAmount);

        uint256 feeTokens = (tokenAmount * feeBps) / FEE_DENOM;
        uint256 burnTokens = (tokenAmount * burnBps) / FEE_DENOM;

        uint256 currentSupply = spvToken.totalSupply();
        if (currentSupply <= burnTokens + supplyFloor) {
            burnTokens = currentSupply > supplyFloor ? currentSupply - supplyFloor : 0;
        }

        uint256 netTokens = tokenAmount - feeTokens - burnTokens;
        require(netTokens > 0, "net zero");

        uint256 k = virtualUsdtReserve * virtualTokenReserve;
        uint256 newVtok = virtualTokenReserve + netTokens;
        uint256 newVusdt = k / newVtok;
        uint256 grossUsdt = virtualUsdtReserve - newVusdt;
        require(grossUsdt > 0, "gross zero");

        uint256 creatorFee = (grossUsdt * creatorFeeBps) / FEE_DENOM;
        usdtOut = grossUsdt - creatorFee;

        require(usdtOut >= minUsdtOut, "slippage");
        require(usdtOut + creatorFee <= realUsdtReserve, "insufficient liquidity");

        virtualUsdtReserve = newVusdt;
        virtualTokenReserve = newVtok;
        realUsdtReserve -= (usdtOut + creatorFee);
        realTokenReserve -= tokenAmount;

        if (feeTokens > 0) {
            spvToken.burn(address(this), feeTokens);
            emit Burn(msg.sender, feeTokens, spvToken.totalSupply());
        }
        if (burnTokens > 0) {
            spvToken.burn(address(this), burnTokens);
            emit Burn(msg.sender, burnTokens, spvToken.totalSupply());
        }

        _reducePositionOnSell(msg.sender, tokenAmount);
        IERC20(USDT).safeTransfer(msg.sender, usdtOut);

        if (creatorFee > 0) {
            IERC20(USDT).safeTransfer(creator, creatorFee);
            emit CreatorFeeCollected(creatorFee, creatorFeeBps);
        }

        dailyVolumeUsdt += grossUsdt;
        emit Sell(msg.sender, tokenAmount, usdtOut, feeTokens, burnTokens, creatorFeeBps, creatorFee);
        return usdtOut;
    }

    function _migrateToDEX(string memory reason) internal {
        require(!migrated, "already migrated");
        migrated = true;
        migrationTimestamp = block.timestamp;
        migrationReason = reason;

        uint256 usdtLiquidity = realUsdtReserve;
        uint256 tokenLiquidity = realTokenReserve;
        require(usdtLiquidity > 0 && tokenLiquidity > 0, "no liquidity");

        IERC20(USDT).forceApprove(DEX_ROUTER, usdtLiquidity);
        spvToken.approve(DEX_ROUTER, tokenLiquidity);

        (uint amountToken, uint amountUSDT, uint liquidity) = IUniswapV2Router(DEX_ROUTER).addLiquidity(
            address(spvToken), USDT, tokenLiquidity, usdtLiquidity, 0, 0, address(this), block.timestamp + 300
        );

        address factory = IUniswapV2Router(DEX_ROUTER).factory();
        dexPair = IUniswapV2Factory(factory).getPair(address(spvToken), USDT);
        require(dexPair != address(0), "pair not created");

        migratedTokenAmount = amountToken;
        migratedUsdtAmount = amountUSDT;

        IERC20(dexPair).safeTransfer(DEAD, liquidity);
        lpBurned = liquidity;
        emit LPLocked(dexPair, liquidity);

        realUsdtReserve = 0;
        realTokenReserve = 0;

        emit Migrated(dexPair, amountUSDT, amountToken, reason);
    }

    function forceMigrate() external onlyOwner {
        require(!migrated, "already migrated");
        require(realUsdtReserve > 0, "no liquidity");
        _migrateToDEX("manual");
    }

    function updateFeeTier(uint256 idx, uint256 minHold, uint256 feeBps) external onlyOwner {
        require(idx < feeTiers.length, "bad idx");
        require(feeBps <= MAX_FEE_BPS, "fee cap");
        if (idx > 0) require(minHold > feeTiers[idx-1].minHold, "asc");
        if (idx < feeTiers.length - 1) require(minHold < feeTiers[idx+1].minHold, "asc");
        feeTiers[idx] = FeeTier(minHold, feeBps);
    }

    function setMigrationTargets(uint256 _priceMultiple, uint256 _supplyTarget, uint256 _holderTarget) external onlyOwner {
        require(!migrated, "migrated");
        require(_priceMultiple >= 2, "multiple too low");
        require(_supplyTarget > 0, "bad supply");
        require(_holderTarget > 0, "bad holders");
        priceMultipleTarget = _priceMultiple;
        supplyTarget = _supplyTarget;
        holderTarget = _holderTarget;
        emit MigrationTargetsUpdated(_priceMultiple, _supplyTarget, _holderTarget);
    }

    function setCreator(address _c) external onlyOwner {
        require(_c != address(0), "bad");
        creator = _c;
        emit CreatorUpdated(_c);
    }

    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(token != USDT, "cannot withdraw USDT");
        require(token != address(spvToken), "cannot withdraw SPV");
        IERC20(token).safeTransfer(owner(), amount);
        emit EmergencyWithdraw(token, amount);
    }

    function getCurrentPrice() external view returns (uint256) {
        if (virtualTokenReserve == 0) return 0;
        return (virtualUsdtReserve * 1e12 * 1e18) / virtualTokenReserve;
    }

    function getReserves() external view returns (uint256, uint256, uint256, uint256) {
        return (virtualUsdtReserve, virtualTokenReserve, realUsdtReserve, realTokenReserve);
    }

    function getUserHoldTime(address user) external view returns (uint256) {
        return _weightedHoldTime(user);
    }

    function getDexRouter() external pure returns (address) {
        return DEX_ROUTER;
    }
}