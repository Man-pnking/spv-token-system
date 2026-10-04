// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./SPVToken.sol";
import "./SPVBondingCurve.sol";

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline
    ) external returns (uint[] memory amounts);
    function getAmountsOut(uint amountIn, address[] calldata path)
        external view returns (uint[] memory amounts);
}

contract SPVRouter is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    address public constant DEX_ROUTER = 0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff;
    uint256 public constant FEE_DENOM = 10_000;

    IERC20 public immutable usdt;
    SPVToken public immutable spvToken;
    SPVBondingCurve public immutable curve;

    event RoutedToCurve(address indexed user, string action, uint256 amountIn);
    event RoutedToDex(address indexed user, string action, uint256 amountIn);

    constructor(address _usdt, address _spvToken, address _curve) Ownable(msg.sender) {
        require(_usdt != address(0) && _spvToken != address(0) && _curve != address(0), "bad");
        usdt = IERC20(_usdt);
        spvToken = SPVToken(_spvToken);
        curve = SPVBondingCurve(_curve);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function buy(uint256 usdtAmount, uint256 minTokensOut)
        external nonReentrant whenNotPaused returns (uint256 tokensOut)
    {
        require(usdtAmount > 0, "zero");
        usdt.safeTransferFrom(msg.sender, address(this), usdtAmount);

        if (!curve.migrated()) {
            usdt.forceApprove(address(curve), usdtAmount);
            tokensOut = curve.buy(usdtAmount, minTokensOut);
            spvToken.transfer(msg.sender, tokensOut);
            emit RoutedToCurve(msg.sender, "buy", usdtAmount);
        } else {
            require(curve.dexPair() != address(0), "no DEX pair");
            usdt.forceApprove(DEX_ROUTER, usdtAmount);
            address[] memory path = new address[](2);
            path[0] = address(usdt);
            path[1] = address(spvToken);
            uint[] memory amounts = IUniswapV2Router02(DEX_ROUTER).swapExactTokensForTokens(
                usdtAmount, minTokensOut, path, msg.sender, block.timestamp + 300
            );
            tokensOut = amounts[amounts.length - 1];
            emit RoutedToDex(msg.sender, "buy", usdtAmount);
        }
    }

    function sell(uint256 tokenAmount, uint256 minUsdtOut)
        external nonReentrant whenNotPaused returns (uint256 usdtOut)
    {
        require(tokenAmount > 0, "zero");
        spvToken.transferFrom(msg.sender, address(this), tokenAmount);

        if (!curve.migrated()) {
            spvToken.approve(address(curve), tokenAmount);
            usdtOut = curve.sell(tokenAmount, minUsdtOut);
            usdt.safeTransfer(msg.sender, usdtOut);
            emit RoutedToCurve(msg.sender, "sell", tokenAmount);
        } else {
            spvToken.approve(DEX_ROUTER, tokenAmount);
            address[] memory path = new address[](2);
            path[0] = address(spvToken);
            path[1] = address(usdt);
            uint[] memory amounts = IUniswapV2Router02(DEX_ROUTER).swapExactTokensForTokens(
                tokenAmount, minUsdtOut, path, msg.sender, block.timestamp + 300
            );
            usdtOut = amounts[amounts.length - 1];
            emit RoutedToDex(msg.sender, "sell", tokenAmount);
        }
    }

    function previewBuy(uint256 usdtAmount) external view returns (uint256) {
        if (usdtAmount == 0) return 0;
        if (!curve.migrated()) {
            (uint256 vusdt, uint256 vtok, , ) = curve.getReserves();
            uint256 creatorFeeBps = curve.getCreatorFeeBps();
            uint256 creatorFee = (usdtAmount * creatorFeeBps) / FEE_DENOM;
            uint256 netUsdt = usdtAmount - creatorFee;
            uint256 k = vusdt * vtok;
            uint256 newVtok = k / (vusdt + netUsdt);
            return vtok - newVtok;
        } else {
            address[] memory path = new address[](2);
            path[0] = address(usdt);
            path[1] = address(spvToken);
            uint[] memory amounts = IUniswapV2Router02(DEX_ROUTER).getAmountsOut(usdtAmount, path);
            return amounts[amounts.length - 1];
        }
    }

    function previewSell(address seller, uint256 tokenAmount) external view returns (uint256) {
        if (tokenAmount == 0) return 0;

        if (!curve.migrated()) {
            (uint256 usdtOut, , ) = curve.previewSell(seller, tokenAmount);
            return usdtOut;
        } else {
            address[] memory path = new address[](2);
            path[0] = address(spvToken);
            path[1] = address(usdt);
            uint[] memory amounts = IUniswapV2Router02(DEX_ROUTER).getAmountsOut(tokenAmount, path);
            return amounts[amounts.length - 1];
        }
    }

    function getFeeInfo() external view returns (uint256 creatorFeeBps, uint256 currentPrice, uint256 priceRatio, bool migrated) {
        creatorFeeBps = curve.getCreatorFeeBps();
        currentPrice = curve.getCurrentPrice();
        uint256 initialPrice = curve.initialPrice();
        priceRatio = initialPrice > 0 ? (currentPrice * 1e18) / initialPrice : 0;
        migrated = curve.migrated();
    }

    function rescue(address token, uint256 amount) external onlyOwner {
        require(token != address(spvToken) && token != address(usdt), "protected");
        IERC20(token).safeTransfer(owner(), amount);
    }
}