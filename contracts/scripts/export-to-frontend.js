const fs = require("fs");
const path = require("path");

const NETWORK = process.env.NETWORK || "amoy";
const FRONTEND_DIR = process.env.FRONTEND_DIR || "../web";

async function main() {
  const deploymentFile = path.join(__dirname, "..", `deployments-${NETWORK}.json`);
  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`No deployment file: ${deploymentFile}. Run deploy.js first.`);
  }
  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf-8"));

  const spvArtifact = require(`../artifacts/contracts/SPVToken.sol/SPVToken.json`);
  const curveArtifact = require(`../artifacts/contracts/SPVBondingCurve.sol/SPVBondingCurve.json`);
  const routerArtifact = require(`../artifacts/contracts/SPVRouter.sol/SPVRouter.json`);

  const abiDir = path.join(FRONTEND_DIR, "src", "abis");
  if (!fs.existsSync(abiDir)) fs.mkdirSync(abiDir, { recursive: true });

  fs.writeFileSync(path.join(abiDir, "SPVToken.json"), JSON.stringify(spvArtifact.abi, null, 2));
  fs.writeFileSync(path.join(abiDir, "SPVBondingCurve.json"), JSON.stringify(curveArtifact.abi, null, 2));
  fs.writeFileSync(path.join(abiDir, "SPVRouter.json"), JSON.stringify(routerArtifact.abi, null, 2));

  fs.writeFileSync(
    path.join(FRONTEND_DIR, "src", "deployments.json"),
    JSON.stringify({
      [NETWORK]: {
        chainId: deployment.chainId,
        usdt: deployment.usdt,
        spvToken: deployment.spvToken,
        bondingCurve: deployment.bondingCurve,
        router: deployment.router,
      },
    }, null, 2)
  );

  fs.writeFileSync(
    path.join(FRONTEND_DIR, ".env.generated"),
    [
      `VITE_CHAIN=${NETWORK}`,
      `VITE_USDT_ADDRESS=${deployment.usdt}`,
      `VITE_SPV_TOKEN=${deployment.spvToken}`,
      `VITE_CURVE_ADDRESS=${deployment.bondingCurve}`,
      `VITE_ROUTER_ADDRESS=${deployment.router}`,
    ].join("\n") + "\n"
  );

  console.log("Exported to frontend:");
  console.log("  ABIs         ->", abiDir);
  console.log("  Deployments  -> web/src/deployments.json");
  console.log("  Env          -> web/.env.generated");
}

main().catch((e) => { console.error(e); process.exit(1); });