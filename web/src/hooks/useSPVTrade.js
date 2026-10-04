import { useState, useCallback } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { maxUint256, parseUnits } from "viem";
import { CONFIG, ABIS } from "../config";

export function useSPVTrade() {
  const { address } = useAccount();
  const [mode, setMode] = useState("buy");
  const [amount, setAmount] = useState("");

  const { data: usdtBalance } = useReadContract({
    address: CONFIG.usdt, abi: ABIS.usdt, functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10_000 },
  });

  const { data: usdtAllowance } = useReadContract({
    address: CONFIG.usdt, abi: ABIS.usdt, functionName: "allowance",
    args: address ? [address, CONFIG.router] : undefined,
    query: { enabled: !!address, refetchInterval: 10_000 },
  });

  const { data: spvBalance } = useReadContract({
    address: CONFIG.spvToken, abi: ABIS.spvToken, functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 10_000 },
  });

  const { data: spvAllowance } = useReadContract({
    address: CONFIG.spvToken, abi: ABIS.spvToken, functionName: "allowance",
    args: address ? [address, CONFIG.router] : undefined,
    query: { enabled: !!address, refetchInterval: 10_000 },
  });

  const parsedAmount = (() => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return 0n;
    try {
      return mode === "buy" ? parseUnits(amount, 6) : parseUnits(amount, 18);
    } catch { return 0n; }
  })();

  const { data: previewBuy } = useReadContract({
    address: CONFIG.router, abi: ABIS.router, functionName: "previewBuy",
    args: parsedAmount > 0n ? [parsedAmount] : undefined,
    query: { enabled: parsedAmount > 0n && mode === "buy" },
  });

  const { data: previewSell } = useReadContract({
    address: CONFIG.router, abi: ABIS.router, functionName: "previewSell",
    args: parsedAmount > 0n ? [parsedAmount] : undefined,
    query: { enabled: parsedAmount > 0n && mode === "sell" },
  });

  const approveTx = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveTx.data });

  const approve = useCallback(() => {
    if (mode === "buy") {
      approveTx.writeContract({
        address: CONFIG.usdt, abi: ABIS.usdt, functionName: "approve",
        args: [CONFIG.router, maxUint256],
      });
    } else {
      approveTx.writeContract({
        address: CONFIG.spvToken, abi: ABIS.spvToken, functionName: "approve",
        args: [CONFIG.router, maxUint256],
      });
    }
  }, [mode, approveTx]);

  const tradeTx = useWriteContract();
  const tradeReceipt = useWaitForTransactionReceipt({ hash: tradeTx.data });

  const execute = useCallback(() => {
    if (parsedAmount <= 0n) return;
    if (mode === "buy") {
      const minOut = previewBuy ? (previewBuy * 99n) / 100n : 0n;
      tradeTx.writeContract({
        address: CONFIG.router, abi: ABIS.router, functionName: "buy",
        args: [parsedAmount, minOut],
      });
    } else {
      const minOut = previewSell ? (previewSell * 99n) / 100n : 0n;
      tradeTx.writeContract({
        address: CONFIG.router, abi: ABIS.router, functionName: "sell",
        args: [parsedAmount, minOut],
      });
    }
  }, [mode, parsedAmount, previewBuy, previewSell, tradeTx]);

  const needsApproval = mode === "buy"
    ? (usdtAllowance ?? 0n) < parsedAmount
    : (spvAllowance ?? 0n) < parsedAmount;

  const hasBalance = mode === "buy"
    ? (usdtBalance ?? 0n) >= parsedAmount
    : (spvBalance ?? 0n) >= parsedAmount;

  const canTrade = parsedAmount > 0n && hasBalance && !needsApproval;
  const isPending = approveTx.isPending || tradeTx.isPending || approveReceipt.isLoading || tradeReceipt.isLoading;

  return {
    mode, setMode, amount, setAmount, parsedAmount,
    usdtBalance: usdtBalance ?? 0n, spvBalance: spvBalance ?? 0n,
    previewBuy: previewBuy ?? 0n, previewSell: previewSell ?? 0n,
    needsApproval, hasBalance, canTrade, isPending,
    approve, execute,
    txHash: tradeTx.data,
    error: approveTx.error || tradeTx.error,
  };
}