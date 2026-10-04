const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const network = hre.network.name;
  const file = `deployments-${network}.json`;
  if (!fs.existsSync(file)) throw new Error(`No deployment file: ${file}`);
  const d = JSON.parse(fs.readFileSync(file));

  const [signer] = await hre.ethers.getSigners();
  const usdt = await hre.ethers.getContractAt("MockUSDT", d.usdt);

  const amount = hre.ethers.parseUnits("10000", 6);
  console.log("Minting", hre.ethers.formatUnits(amount, 6), "USDT to", signer.address);
  const tx = await usdt.mint(signer.address, amount);
  await tx.wait();

  const bal = await usdt.balanceOf(signer.address);
  console.log("New USDT balance:", hre.ethers.formatUnits(bal, 6));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
