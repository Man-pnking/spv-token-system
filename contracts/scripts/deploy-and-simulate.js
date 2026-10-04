const hre = require("hardhat");

async function main() {
  console.log("Starting deploy-and-simulate on network:", hre.network.name);
  console.log("");

  console.log("========== DEPLOY ==========");
  const deploy = require("./deploy.js");
  await deploy();

  await new Promise((r) => setTimeout(r, 1000));

  console.log("");
  console.log("========== SIMULATE ==========");
  const simulate = require("./simulate.js");
  await simulate();
}

main().catch((e) => { console.error(e); process.exit(1); });