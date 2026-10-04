const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  const file = `deployments-${network}.json`;
  if (!fs.existsSync(file)) throw new Error(`No deployment file: ${file}. Run deploy.js first.`);
  const d = JSON.parse(fs.readFileSync(file));

  const spv = await hre.ethers.getContractAt("SPVToken", d.spvToken);
  const curve = await hre.ethers.getContractAt("SPVBondingCurve", d.bondingCurve);
  const router = await hre.ethers.getContractAt("SPVRouter", d.router);
  const usdt = await hre.ethers.getContractAt(
    "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20", d.usdt
  );

  console.log("=".repeat(60));
  console.log("SPV Status @", network);
  console.log("=".repeat(60));

  const migrated = await curve.migrated();
  const info = await curve.migrationCheck();
  const price = await curve.getCurrentPrice();
  const progress = await curve.getProgress();
  const supply = await spv.totalSupply();
  const creatorFeeBps = await curve.getCreatorFeeBps();
  const burnBps = await curve.getBurnBps();

  console.log("Migrated:       ", migrated);
  console.log("Price:          ", hre.ethers.formatUnits(price, 6), "USDT");
  console.log("Creator fee:    ", Number(creatorFeeBps) / 100, "%");
  console.log("Burn rate:      ", Number(burnBps) / 100, "%");
  console.log("Total Supply:   ", hre.ethers.formatUnits(supply, 18), "SPV");
  console.log("Total Minted:   ", hre.ethers.formatUnits(info[5], 18), "SPV");
  console.log("Unique Buyers:  ", info[6].toString());
  console.log("Supply Floor:   ", hre.ethers.formatUnits(await curve.supplyFloor(), 18));
  console.log("");
  console.log("Migration Triggers:");
  console.log("  Price OK:     ", info[1]);
  console.log("  Supply OK:    ", info[2]);
  console.log("  Holders OK:   ", info[3]);
  console.log("  Triggers Met: ", info[0].toString(), "/ 2 required");
  console.log("  Progress:     ", (Number(progress) / 1e16).toFixed(2), "%");
  console.log("  Time Left:    ", info[7].toString(), "sec");

  if (migrated) {
    console.log("\nMIGRATED - DEX Pair:", await curve.dexPair());
    return;
  }

  const BUY = hre.ethers.parseUnits("10", 6);
  const bal = await usdt.balanceOf(signer.address);
  console.log("\nYour USDT:", hre.ethers.formatUnits(bal, 6));

  if (bal < BUY) {
    console.log("Not enough USDT for test buy.");
    return;
  }

  console.log(`\nBuying ${hre.ethers.formatUnits(BUY, 6)} USDT via router...`);
  await (await usdt.approve(d.router, BUY)).wait();
  const preview = await router.previewBuy(BUY);
  const minOut = (preview * 99n) / 100n;
  const tx = await router.buy(BUY, minOut);
  await tx.wait();
  console.log("TX:", tx.hash);
  console.log("SPV balance:", hre.ethers.formatUnits(await spv.balanceOf(signer.address), 18));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });