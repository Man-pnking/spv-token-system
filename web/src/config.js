import SPVTokenABI from "./abis/SPVToken.json";
import SPVBondingCurveABI from "./abis/SPVBondingCurve.json";
import SPVRouterABI from "./abis/SPVRouter.json";
import deployments from "./deployments.json";

const network = import.meta.env.VITE_CHAIN || "amoy";
const deployed = deployments[network] || {};

export const CONFIG = {
  chainId: deployed.chainId || 80002,
  spvToken: deployed.spvToken || "0x0000000000000000000000000000000000000000",
  curve: deployed.bondingCurve || "0x0000000000000000000000000000000000000000",
  router: deployed.router || "0x0000000000000000000000000000000000000000",
  usdt: deployed.usdt || "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  explorer: network === "polygon" ? "https://polygonscan.com" : "https://amoy.polygonscan.com",
};

export const ABIS = {
  spvToken: SPVTokenABI,
  curve: SPVBondingCurveABI,
  router: SPVRouterABI,
  usdt: [
    { name: "balanceOf", type: "function", stateMutability: "view", inputs: [{ name: "a", type: "address" }], outputs: [{ type: "uint256" }] },
    { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ name: "s", type: "address" }, { name: "a", type: "uint256" }], outputs: [{ type: "bool" }] },
    { name: "allowance", type: "function", stateMutability: "view", inputs: [{ name: "o", type: "address" }, { name: "s", type: "address" }], outputs: [{ type: "uint256" }] },
  ],
};