import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import { CONFIG } from "../config";

function timeAgo(secondsAgo) {
  if (secondsAgo < 60) return `${Math.max(1, Math.floor(secondsAgo))}s ago`;
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
  return `${Math.floor(secondsAgo / 86400)}d ago`;
}

function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function useRecentActivity(limit = 10) {
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

        const now = Math.floor(Date.now() / 1000);

        const combined = [
          ...buyLogs.map((log) => ({
            type: "buy",
            wallet: log.args.buyer,
            blockNumber: log.blockNumber,
            txHash: log.transactionHash,
            usdt: Number(formatUnits(log.args.usdtIn, 6)),
            tokens: Number(formatUnits(log.args.tokensOut, 18)),
          })),
          ...sellLogs.map((log) => ({
            type: "sell",
            wallet: log.args.seller,
            blockNumber: log.blockNumber,
            txHash: log.transactionHash,
            usdt: Number(formatUnits(log.args.usdtOut, 6)),
            tokens: Number(formatUnits(log.args.tokensIn, 18)),
          })),
        ].sort((a, b) => Number(b.blockNumber - a.blockNumber));

        const trimmed = combined.slice(0, limit);

        // Fetch timestamps for the trimmed entries in parallel
        const withTime = await Promise.all(
          trimmed.map(async (entry) => {
            try {
              const block = await publicClient.getBlock({ blockNumber: entry.blockNumber });
              const ts = Number(block.timestamp);
              return { ...entry, timestamp: ts, ago: timeAgo(now - ts) };
            } catch {
              return { ...entry, timestamp: 0, ago: "—" };
            }
          })
        );

        if (!cancelled) {
          setData(withTime);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load activity");
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
  }, [publicClient, limit]);

  return { data, loading, error, shortAddress };
}