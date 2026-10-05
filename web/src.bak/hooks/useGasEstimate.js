import { useEstimateGas, useGasPrice } from "wagmi";
import { parseUnits } from "viem";
import { CONFIG, ABIS } from "../config";
import { useAccount } from "wagmi";

/**
 * Estimates gas cost for a buy or sell transaction.
 * Returns { gasCostPol, loading } where gasCostPol is a string like "0.0042".
 */
export function useGasEstimate(mode, parsedAmount, minOut) {
  const { address } = useAccount();

  const { data: gasEstimate } = useEstimateGas({
    to: CONFIG.router,
    abi: ABIS.router,
    functionName: mode === "buy" ? "buy" : "sell",
    args: mode === "buy"
      ? (parsedAmount > 0n ? [parsedAmount, minOut] : undefined)
      : (parsedAmount > 0n ? [parsedAmount, minOut] : undefined),
    account: address,
    query: { enabled: !!address && parsedAmount > 0n },
  });

  const { data: gasPrice } = useGasPrice({
    query: { refetchInterval: 15_000 },
  });

  if (!gasEstimate || !gasPrice) {
    return { gasCostPol: "0.0000", gasUnits: 0n, gasPriceWei: 0n, loading: true };
  }

  // gasEstimate is gas units (bigint), gasPrice is wei per gas (bigint)
  const costWei = gasEstimate * gasPrice;
  const costPol = Number(costWei) / 1e18;

  return {
    gasCostPol: costPol.toFixed(6),
    gasUnits: gasEstimate,
    gasPriceWei: gasPrice,
    loading: false,
  };
}