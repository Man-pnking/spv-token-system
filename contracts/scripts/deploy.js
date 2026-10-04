const hre = require("hardhat");
const fs = require("fs");

const CREATOR_ADDRESS = process.env.CREATOR_ADDRESS || "";
const INITIAL_PRICE_USDT = 10_000n;
const PRICE_MULTIPLE = 5n;
const SUPPLY_TARGET = 5_000_000n * 10n ** 18n;
const HOLDER_TARGET = 500n;

const USDT_ADDRESSES = {
  polygon: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  amoy: "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582",
  hardhat: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  localhost: "0x0000000000000000000000000000000000000000",
  ganache: "0x0000000000000000000000000000000000000000",
};

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  const creator = CREATOR_ADDRESS || deployer.address;

  console.log("=".repeat(60));
  console.log("SPV System Deployment");
  console.log("=".repeat(60));
  console.log("Network:  ", network);
  console.log("Deployer: ", deployer.address);
  console.log("Creator:  ", creator);
  const bal = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Balance:  ", hre.ethers.formatEther(bal), network === "polygon" ? "POL" : "ETH");
  console.log("");

  let usdtAddr = USDT_ADDRESSES[network];
  if (usdtAddr === "0x0000000000000000000000000000000000000000") {
    console.log("1. Deploying MockUSDT (local)...");
    const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
    const usdt = await MockUSDT.deploy();
    await usdt.waitForDeployment();
    usdtAddr = await usdt.getAddress();
    console.log("   MockUSDT:", usdtAddr);
  } else {
    console.log("1. Using USDT at:", usdtAddr);
  }

  console.log("\n2. Deploying SPVToken...");
  const SPV = await hre.ethers.getContractFactory("SPVToken");
  const spv = await SPV.deploy();
  await spv.waitForDeployment();
  const spvAddr = await spv.getAddress();
  console.log("   SPVToken:", spvAddr);

  console.log("\n3. Deploying SPVBondingCurve...");
  const Curve = await hre.ethers.getContractFactory("SPVBondingCurve");
  const curve = await Curve.deploy(
    usdtAddr, spvAddr, creator,
    INITIAL_PRICE_USDT, PRICE_MULTIPLE, SUPPLY_TARGET, HOLDER_TARGET
  );
  await curve.waitForDeployment();
  const curveAddr = await curve.getAddress();
  console.log("   SPVBondingCurve:", curveAddr);

  console.log("\n4. Linking curve to token...");
  await (await spv.setBondingCurve(curveAddr)).wait();
  console.log("   Linked");

  console.log("\n5. Deploying SPVRouter...");
  const Router = await hre.ethers.getContractFactory("SPVRouter");
  const router = await Router.deploy(usdtAddr, spvAddr, curveAddr);
  await router.waitForDeployment();
  const routerAddr = await router.getAddress();
  console.log("   SPVRouter:", routerAddr);

  console.log("\n6. Configuration:");
  const price = await curve.getCurrentPrice();
  const creatorFee = await curve.getCreatorFeeBps();
  console.log("   Initial price:    ", hre.ethers.formatUnits(price, 18), "USDT");
  console.log("   Creator fee:      ", Number(creatorFee) / 100, "%");
  console.log("   Price trigger:    ", hre.ethers.formatUnits(price * PRICE_MULTIPLE, 18), "USDT");
  console.log("   Supply trigger:   ", hre.ethers.formatUnits(SUPPLY_TARGET, 18), "SPV");
  console.log("   Holder trigger:   ", HOLDER_TARGET.toString());
  console.log("   Triggers required:", "2 of 3");
  console.log("   Fallback:         ", "90 days");

  const data = {
    network,
    chainId: network === "polygon" ? 137 : network === "amoy" ? 80002 : network === "hardhat" ? 31337 : 1337,
    usdt: usdtAddr,
    spvToken: spvAddr,
    bondingCurve: curveAddr,
    router: routerAddr,
    creator,
    initialPriceUSDT: INITIAL_PRICE_USDT.toString(),
    priceMultiple: PRICE_MULTIPLE.toString(),
    supplyTarget: SUPPLY_TARGET.toString(),
    holderTarget: HOLDER_TARGET.toString(),
    compiler: "0.8.37",
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(`deployments-${network}.json`, JSON.stringify(data, null, 2));

  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT COMPLETE");
  console.log("=".repeat(60));
  console.log("USDT:          ", usdtAddr);
  console.log("SPVToken:      ", spvAddr);
  console.log("BondingCurve:  ", curveAddr);
  console.log("SPVRouter:     ", routerAddr);
  console.log("\nVerify commands:");
  console.log(`npx hardhat verify --network ${network} ${spvAddr}`);
  console.log(`npx hardhat verify --network ${network} ${curveAddr} ${usdtAddr} ${spvAddr} ${creator} ${INITIAL_PRICE_USDT} ${PRICE_MULTIPLE} ${SUPPLY_TARGET} ${HOLDER_TARGET}`);
  console.log(`npx hardhat verify --network ${network} ${routerAddr} ${usdtAddr} ${spvAddr} ${curveAddr}`);
}

module.exports = main;
if (require.main === module) {
  main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}