import { useState, useCallback, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { maxUint256, parseUnits, formatUnits } from "viem";
import { CONFIG, ABIS } from "../config";

export function useSPVTrade() {
  const { address } = useAccount();
  const [mode, setMode] = useState("buy");
  const [usdtInput, setUsdtInput] = useState("");
  const [spvInput, setSpvInput] = useState("");
  const [lastEdited, setLastEdited] = useState("usdt");

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

  const parsedUsdt = (() => {
    if (!usdtInput || isNaN(Number(usdtInput)) || Number(usdtInput) <= 0) return 0n;
    try { return parseUnits(usdtInput, 6); } catch { return 0n; }
  })();

  const parsedSpv = (() => {
    if (!spvInput || isNaN(Number(spvInput)) || Number(spvInput) <= 0) return 0n;
    try { return parseUnits(spvInput, 18); } catch { return 0n; }
  })();

  const { data: previewBuyOut } = useReadContract({
    address: CONFIG.router, abi: ABIS.router, functionName: "previewBuy",
    args: parsedUsdt > 0n ? [parsedUsdt] : undefined,
    query: { enabled: parsedUsdt > 0n },
  });

  const { data: previewSellOut } = useReadContract({
    address: CONFIG.router, abi: ABIS.router, functionName: "previewSell",
    args: parsedSpv > 0n && address ? [address, parsedSpv] : undefined,
    query: { enabled: parsedSpv > 0n && !!address },
  });

  useEffect(() => {
    if (lastEdited !== "usdt") return;
    if (parsedUsdt === 0n || previewBuyOut === undefined) return;
    const out = Number(formatUnits(previewBuyOut, 18));
    if (!isFinite(out) || out <= 0) return;
    setSpvInput(out.toFixed(6));
  }, [lastEdited, parsedUsdt, previewBuyOut]);

  useEffect(() => {
    if (lastEdited !== "spv") return;
    if (parsedSpv === 0n || previewSellOut === undefined) return;
    const out = Number(formatUnits(previewSellOut, 6));
    if (!isFinite(out) || out <= 0) return;
    setUsdtInput(out.toFixed(6));
  }, [lastEdited, parsedSpv, previewSellOut]);

  const onUsdtChange = useCallback((v) => {
    setLastEdited("usdt");
    setUsdtInput(v);
  }, []);

  const onSpvChange = useCallback((v) => {
    setLastEdited("spv");
    setSpvInput(v);
  }, []);

  const reset = useCallback(() => {
    setUsdtInput("");
    setSpvInput("");
    setLastEdited("usdt");
  }, []);

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
    if (mode === "buy") {
      if (parsedUsdt <= 0n) return;
      const minOut = previewBuyOut ? (previewBuyOut * 99n) / 100n : 0n;
      tradeTx.writeContract({
        address: CONFIG.router, abi: ABIS.router, functionName: "buy",
        args: [parsedUsdt, minOut],
      });
    } else {
      if (parsedSpv <= 0n) return;
      const minOut = previewSellOut ? (previewSellOut * 99n) / 100n : 0n;
      tradeTx.writeContract({
        address: CONFIG.router, abi: ABIS.router, functionName: "sell",
        args: [parsedSpv, minOut],
      });
    }
  }, [mode, parsedUsdt, parsedSpv, previewBuyOut, previewSellOut, tradeTx]);

  const needsApproval = mode === "buy"
    ? (usdtAllowance ?? 0n) < parsedUsdt
    : (spvAllowance ?? 0n) < parsedSpv;

  const hasBalance = mode === "buy"
    ? (usdtBalance ?? 0n) >= parsedUsdt
    : (spvBalance ?? 0n) >= parsedSpv;

  const canTrade = mode === "buy"
    ? parsedUsdt > 0n && hasBalance && !needsApproval
    : parsedSpv > 0n && hasBalance && !needsApproval;

  const isPending = approveTx.isPending || tradeTx.isPending || approveReceipt.isLoading || tradeReceipt.isLoading;

  const parsedAmount = mode === "buy" ? parsedUsdt : parsedSpv;

  return {
    mode, setMode,
    usdtInput, spvInput,
    setUsdtInput: onUsdtChange,
    setSpvInput: onSpvChange,
    reset,
    parsedAmount, parsedUsdt, parsedSpv,
    usdtBalance: usdtBalance ?? 0n,
    spvBalance: spvBalance ?? 0n,
    previewBuy: previewBuyOut ?? 0n,
    previewSell: previewSellOut ?? 0n,
    needsApproval, hasBalance, canTrade, isPending,
    approve, execute,
    txHash: tradeTx.data,
    error: approveTx.error || tradeTx.error,
  };
}