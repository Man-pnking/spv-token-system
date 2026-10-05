import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import { CONFIG } from "../config";

export function useTradeHistory(maxEvents = 500) {
  const publicClient = usePublicClient();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!publicClient) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const latestBlock = await publicClient.getBlockNumber();
        const fromBlock = latestBlock > 10000n ? latestBlock - 10000n : 0n;

        const [buyLogs, sellLogs] = await Promise.all([
          publicClient.getLogs({
            address: CONFIG.curve,
            event: {
              type: "event",
              name: "Buy",
              inputs: [
                { name: "buyer", type: "address", indexed: true },
                { name: "usdtIn", type: "uint256" },
                { name: "tokensOut", type: "uint256" },
                { name: "creatorFeeBps", type: "uint256" },
                { name: "creatorFee", type: "uint256" },
              ],
            },
            fromBlock,
            toBlock: "latest",
          }),
          publicClient.getLogs({
            address: CONFIG.curve,
            event: {
              type: "event",
              name: "Sell",
              inputs: [
                { name: "seller", type: "address", indexed: true },
                { name: "tokensIn", type: "uint256" },
                { name: "usdtOut", type: "uint256" },
                { name: "feeTokens", type: "uint256" },
                { name: "burned", type: "uint256" },
                { name: "creatorFeeBps", type: "uint256" },
                { name: "creatorFee", type: "uint256" },
              ],
            },
            fromBlock,
            toBlock: "latest",
          }),
        ]);

        const combined = [
          ...buyLogs.map((log) => ({
            type: "buy",
            blockNumber: log.blockNumber,
            txHash: log.transactionHash,
            usdt: Number(formatUnits(log.args.usdtIn, 6)),
            tokens: Number(formatUnits(log.args.tokensOut, 18)),
          })),
          ...sellLogs.map((log) => ({
            type: "sell",
            blockNumber: log.blockNumber,
            txHash: log.transactionHash,
            usdt: Number(formatUnits(log.args.usdtOut, 6)),
            tokens: Number(formatUnits(log.args.tokensIn, 18)),
          })),
        ].sort((a, b) => Number(a.blockNumber - b.blockNumber));

        const trimmed = combined.slice(-maxEvents);

        const series = trimmed.map((t, i) => ({
          index: i,
          block: Number(t.blockNumber),
          price: t.tokens > 0 ? t.usdt / t.tokens : 0,
          type: t.type,
          usdt: t.usdt,
          tokens: t.tokens,
        }));

        if (!cancelled) {
          setData(series);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load trade history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [publicClient, maxEvents]);

  return { data, loading, error };
}