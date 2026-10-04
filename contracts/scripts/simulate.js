const hre = require("hardhat");
const fs = require("fs");

const BUY_ROUNDS = 500;
const SELL_ROUNDS = 100;
const TIME_WARPS = 5;
const USERS = 10;
const BUY_MIN_USDT = 1n * 10n ** 6n;
const BUY_MAX_USDT = 100n * 10n ** 6n;
const SELL_MIN_PCT = 5n;
const SELL_MAX_PCT = 100n;

const USDT_WHALES = [
  "0xC87c0ecc26Df80Cc6dB071f536D95C72e1CBA724",
];

function rand(min, max) {
  const range = max - min;
  const r = BigInt(Math.floor(Math.random() * Number(range)));
  return min + r;
}

function randAddr(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function fmtUsdt(v) {
  return Number(hre.ethers.formatUnits(v, 6)).toFixed(2);
}

function fmtSpv(v) {
  return Number(hre.ethers.formatUnits(v, 18)).toFixed(2);
}

function fmtPrice(v) {
  const n = Number(hre.ethers.formatUnits(v, 18));
  if (n < 0.000001) return n.toExponential(4);
  return n.toFixed(6);
}

async function main() {
  const network = hre.network.name;
  const file = `deployments-${network}.json`;
  if (!fs.existsSync(file)) throw new Error(`Run deploy.js first: ${file}`);
  const d = JSON.parse(fs.readFileSync(file));

  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];

  const spv = await hre.ethers.getContractAt("SPVToken", d.spvToken);
  const curve = await hre.ethers.getContractAt("SPVBondingCurve", d.bondingCurve);
  const router = await hre.ethers.getContractAt("SPVRouter", d.router);

  let usdt;
  try {
    usdt = await hre.ethers.getContractAt("MockUSDT", d.usdt);
  } catch (e) {
    usdt = await hre.ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      d.usdt
    );
  }

  console.log("=".repeat(60));
  console.log("SPV Bonding Curve Simulation");
  console.log("=".repeat(60));
  console.log("Network:  ", network);
  console.log("Users:    ", USERS);
  console.log("Buys:     ", BUY_ROUNDS);
  console.log("Sells:    ", SELL_ROUNDS);
  console.log("Time Warps:", TIME_WARPS);
  console.log("");

  const isFork = network === "hardhat";

  console.log("Funding users...");
  if (isFork) {
    const fundPerUser = 100_000n * 10n ** 6n;
    const needed = fundPerUser * BigInt(USERS);

    let whale = null;
    let whaleAddr = null;

    for (const addr of USDT_WHALES) {
      try {
        const bal = await usdt.balanceOf(addr);
        console.log(`   Checking whale ${addr}: ${Number(bal) / 1e6} USDT`);
        if (bal >= needed) {
          whaleAddr = addr;
          await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [addr],
          });
          await hre.network.provider.send("hardhat_setBalance", [
            addr,
            "0x21e19e0c9bab2400000",
          ]);
          whale = await hre.ethers.getSigner(addr);
          break;
        } else if (bal >= fundPerUser * 5n && !whaleAddr) {
          whaleAddr = addr;
          await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [addr],
          });
          await hre.network.provider.send("hardhat_setBalance", [
            addr,
            "0x21e19e0c9bab2400000",
          ]);
          whale = await hre.ethers.getSigner(addr);
        }
      } catch (e) {
        console.log(`   Skipping ${addr}: ${e.message}`);
      }
    }

    if (!whale) throw new Error("No whale with enough USDT found.");

    console.log(`   Using whale: ${whaleAddr}`);

    const whaleBal = await usdt.balanceOf(whaleAddr);
    const perUser = fundPerUser < whaleBal / BigInt(USERS)
      ? fundPerUser
      : whaleBal / BigInt(USERS + 1n);

    console.log(`   Funding each user with ${Number(perUser) / 1e6} USDT`);

    for (let i = 0; i < USERS && i < signers.length; i++) {
      const u = signers[i];
      await usdt.connect(whale).transfer(u.address, perUser);
      await usdt.connect(u).approve(d.bondingCurve, hre.ethers.MaxUint256);
      await usdt.connect(u).approve(d.router, hre.ethers.MaxUint256);
      await spv.connect(u).approve(d.bondingCurve, hre.ethers.MaxUint256);
      await spv.connect(u).approve(d.router, hre.ethers.MaxUint256);
    }

    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [whaleAddr],
    });
  } else {
    for (let i = 0; i < USERS && i < signers.length; i++) {
      const u = signers[i];
      await usdt.mint(u.address, 1_000_000n * 10n ** 6n);
      await usdt.connect(u).approve(d.bondingCurve, hre.ethers.MaxUint256);
      await usdt.connect(u).approve(d.router, hre.ethers.MaxUint256);
      await spv.connect(u).approve(d.bondingCurve, hre.ethers.MaxUint256);
      await spv.connect(u).approve(d.router, hre.ethers.MaxUint256);
    }
  }
  console.log("   Funded", Math.min(USERS, signers.length), "users");
  console.log("");

  console.log("Phase 1: Buys");
  let successfulBuys = 0;
  let totalSpent = 0n;
  let totalReceived = 0n;

  for (let i = 1; i <= BUY_ROUNDS; i++) {
    const user = randAddr(signers.slice(0, USERS));
    const amount = rand(BUY_MIN_USDT, BUY_MAX_USDT);
    try {
      const usdtBal = await usdt.balanceOf(user.address);
      if (usdtBal < amount) continue;
      const tokensOut = await router.connect(user).previewBuy(amount);
      if (tokensOut === 0n) continue;
      const minOut = (tokensOut * 99n) / 100n;
      await router.connect(user).buy(amount, minOut);
      successfulBuys++;
      totalSpent += amount;
      totalReceived += tokensOut;
      if (i % 25 === 0) {
        const price = await curve.getCurrentPrice();
        console.log(`   [${i}/${BUY_ROUNDS}] buys | price: ${fmtPrice(price)} USDT`);
      }
    } catch (e) {}
  }
  console.log(`   Successful buys: ${successfulBuys}`);
  console.log(`   Total USDT spent: ${fmtUsdt(totalSpent)}`);
  console.log(`   Total SPV minted: ${fmtSpv(totalReceived)}`);
  console.log("");

  console.log("Phase 2: Time warps and sells");
  let successfulSells = 0;
  let totalSold = 0n;
  let totalOut = 0n;

  for (let w = 0; w < TIME_WARPS; w++) {
    const days = [1, 3, 7, 15, 40][w % 5];
    await hre.network.provider.send("evm_increaseTime", [days * 86400]);
    await hre.network.provider.send("evm_mine");
    console.log(`   Time warp +${days} days`);

    const sellsThisWarp = Math.floor(SELL_ROUNDS / TIME_WARPS);
    for (let s = 0; s < sellsThisWarp; s++) {
      const user = randAddr(signers.slice(0, USERS));
      const bal = await spv.balanceOf(user.address);
      if (bal === 0n) continue;
      const pct = rand(SELL_MIN_PCT, SELL_MAX_PCT);
      const amount = (bal * pct) / 100n;
      if (amount === 0n) continue;
      try {
        const preview = await router.connect(user).previewSell(user.address, amount);
        if (preview === 0n) continue;
        const minOut = (preview * 99n) / 100n;
        await router.connect(user).sell(amount, minOut);
        successfulSells++;
        totalSold += amount;
        totalOut += preview;
      } catch (e) {}
    }

    const price = await curve.getCurrentPrice();
    const supply = await spv.totalSupply();
    console.log(`      after sells | price: ${fmtPrice(price)} | supply: ${fmtSpv(supply)}`);
  }
  console.log(`   Successful sells: ${successfulSells}`);
  console.log(`   Total SPV sold:   ${fmtSpv(totalSold)}`);
  console.log(`   Total USDT out:   ${fmtUsdt(totalOut)}`);
  console.log("");

  console.log("Phase 3: State after buys/sells");
  const check = await curve.migrationCheck();
  const reserves = await curve.getReserves();
  const progress = await curve.getProgress();

  console.log("   Price:           ", hre.ethers.formatUnits(await curve.getCurrentPrice(), 18));
  console.log("   Total supply:    ", fmtSpv(await spv.totalSupply()));
  console.log("   Total minted:    ", fmtSpv(await curve.totalMinted()));
  console.log("   Unique buyers:   ", (await curve.uniqueBuyers()).toString());
  console.log("   Virtual USDT:    ", fmtUsdt(reserves[0]));
  console.log("   Virtual SPV:     ", fmtSpv(reserves[1]));
  console.log("   Real USDT:       ", fmtUsdt(reserves[2]));
  console.log("   Real SPV:        ", fmtSpv(reserves[3]));
  console.log("   Supply floor:    ", fmtSpv(await curve.supplyFloor()));
  console.log("   Burn rate:       ", (Number(await curve.getBurnBps()) / 100).toFixed(2) + "%");
  console.log("   Creator fee:     ", (Number(await curve.getCreatorFeeBps()) / 100).toFixed(2) + "%");
  console.log("   Migration progress:", (Number(progress) / 1e16).toFixed(2) + "%");
  console.log("   Triggers met:    ", check[0].toString(), "/ 2");
  console.log("");

  console.log("Phase 4: Migration");
  const migratedBefore = await curve.migrated();
  if (!migratedBefore) {
    const r = await curve.getReserves();
    if (r[3] === 0n) {
      console.log("   Skipping migration: curve has no SPV in reserve");
    } else {
      console.log("   Forcing migration...");
      try {
        const tx = await curve.connect(deployer).forceMigrate();
        await tx.wait();
        console.log("   Migration tx:", tx.hash);
      } catch (e) {
        console.log("   Migration error:", e.message);
      }
    }
  } else {
    console.log("   Already migrated");
  }

  const migratedAfter = await curve.migrated();
  console.log("   Migrated:        ", migratedAfter);
  if (migratedAfter) {
    console.log("   DEX pair:        ", await curve.dexPair());
    console.log("   LP burned:       ", (await curve.lpBurned()).toString());
    console.log("   Migration reason:", await curve.migrationReason());
  }
  console.log("");

  console.log("=".repeat(60));
  console.log("Simulation complete");
  console.log("=".repeat(60));
  console.log("Buys:              ", successfulBuys);
  console.log("Sells:             ", successfulSells);
  console.log("Total USDT in:     ", fmtUsdt(totalSpent));
  console.log("Total USDT out:    ", fmtUsdt(totalOut));
  console.log("Total SPV minted:  ", fmtSpv(totalReceived));
  console.log("Final supply:      ", fmtSpv(await spv.totalSupply()));
  console.log("Migrated:          ", migratedAfter);
}

module.exports = main;
if (require.main === module) {
  main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}