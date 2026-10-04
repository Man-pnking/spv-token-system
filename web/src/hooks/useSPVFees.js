import { useReadContracts } from "wagmi";
import { formatUnits } from "viem";
import { CONFIG, ABIS } from "../config";

export function useSPVFees() {
  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: [
      { address: CONFIG.curve, abi: ABIS.curve, functionName: "getCurrentPrice" },
      { address: CONFIG.curve, abi: ABIS.curve, functionName: "getCreatorFeeBps" },
      { address: CONFIG.curve, abi: ABIS.curve, functionName: "getBurnBps" },
      { address: CONFIG.curve, abi: ABIS.curve, functionName: "getProgress" },
      { address: CONFIG.curve, abi: ABIS.curve, functionName: "migrationCheck" },
      { address: CONFIG.curve, abi: ABIS.curve, functionName: "totalMinted" },
      { address: CONFIG.curve, abi: ABIS.curve, functionName: "uniqueBuyers" },
      { address: CONFIG.curve, abi: ABIS.curve, functionName: "migrated" },
      { address: CONFIG.curve, abi: ABIS.curve, functionName: "initialPrice" },
      { address: CONFIG.curve, abi: ABIS.curve, functionName: "supplyFloor" },
    ],
    query: { refetchInterval: 12_000 },
  });

  if (isLoading || error || !data) return { loading: true, error };

  const [price, creatorFee, burnBps, progress, check, minted, buyers, migrated, initialPrice, floor] = data;

  const priceNum = Number(formatUnits(price.result ?? 0n, 18));
  const initialNum = Number(formatUnits(initialPrice.result ?? 1n, 18));
  const priceRatio = initialNum > 0 ? priceNum / initialNum : 1;

  return {
    loading: false,
    error: null,
    refetch,
    price: price.result,
    priceDisplay: priceNum.toFixed(6),
    priceRatio,
    creatorFeeBps: Number(creatorFee.result ?? 0n),
    creatorFeePct: Number(creatorFee.result ?? 0n) / 100,
    burnBps: Number(burnBps.result ?? 0n),
    burnPct: Number(burnBps.result ?? 0n) / 100,
    progress: Number(progress.result ?? 0n) / 1e16,
    triggersMet: Number(check.result?.[0] ?? 0n),
    priceOk: check.result?.[1] ?? false,
    supplyOk: check.result?.[2] ?? false,
    holdersOk: check.result?.[3] ?? false,
    totalMinted: minted.result ?? 0n,
    uniqueBuyers: Number(buyers.result ?? 0n),
    migrated: migrated.result ?? false,
    supplyFloor: floor.result ?? 0n,
  };
}