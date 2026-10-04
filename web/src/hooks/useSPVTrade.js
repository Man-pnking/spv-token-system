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
  const [debouncedUsdt, setDebouncedUsdt] = useState("");
  const [debouncedSpv, setDebouncedSpv] = useState("");

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

  // Debounce inputs so we don't fire an RPC on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedUsdt(usdtInput), 300);
    return () => clearTimeout(t);
  }, [usdtInput]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSpv(spvInput), 300);
    return () => clearTimeout(t);
  }, [spvInput]);

  const parsedUsdt = (() => {
    if (!debouncedUsdt || isNaN(Number(debouncedUsdt)) || Number(debouncedUsdt) <= 0) return 0n;
    try { return parseUnits(debouncedUsdt, 6); } catch { return 0n; }
  })();

  const parsedSpv = (() => {
    if (!debouncedSpv || isNaN(Number(debouncedSpv)) || Number(debouncedSpv) <= 0) return 0n;
    try { return parseUnits(debouncedSpv, 18); } catch { return 0n; }
  })();

  const { data: previewBuyOut, isFetching: buyFetching } = useReadContract({
    address: CONFIG.router, abi: ABIS.router, functionName: "previewBuy",
    args: parsedUsdt > 0n ? [parsedUsdt] : undefined,
    query: { enabled: parsedUsdt > 0n },
  });

  const { data: previewSellOut, isFetching: sellFetching } = useReadContract({
    address: CONFIG.router, abi: ABIS.router, functionName: "previewSell",
    args: parsedSpv > 0n && address ? [address, parsedSpv] : undefined,
    query: { enabled: parsedSpv > 0n && !!address },
  });

  // Auto-fill opposite side when user types USDT
  useEffect(() => {
    if (lastEdited !== "usdt") return;
    if (parsedUsdt === 0n) {
      if (spvInput !== "") setSpvInput("");
      return;
    }
    if (previewBuyOut === undefined) return;
    const out = Number(formatUnits(previewBuyOut, 18));
    if (!isFinite(out) || out <= 0) return;
    setSpvInput(out.toFixed(6));
  }, [lastEdited, parsedUsdt, previewBuyOut]);

  // Auto-fill opposite side when user types SPV
  useEffect(() => {
    if (lastEdited !== "spv") return;
    if (parsedSpv === 0n) {
      if (usdtInput !== "") setUsdtInput("");
      return;
    }
    if (previewSellOut === undefined) return;
    const out = Number(formatUnits(previewSellOut, 6));
    if (!isFinite(out) || out <= 0) return;
    setUsdtInput(out.toFixed(6));
  }, [lastEdited, parsedSpv, previewSellOut]);

  const reset = useCallback(() => {
    setUsdtInput("");
    setSpvInput("");
    setDebouncedUsdt("");
    setDebouncedSpv("");
    setLastEdited("usdt");
  }, []);

  const onUsdtChange = useCallback((v) => {
    setLastEdited("usdt");
    setUsdtInput(v);
    if (v === "" || isNaN(Number(v)) || Number(v) <= 0) {
      setSpvInput("");
      setDebouncedSpv("");
    }
  }, []);

  const onSpvChange = useCallback((v) => {
    setLastEdited("spv");
    setSpvInput(v);
    if (v === "" || isNaN(Number(v)) || Number(v) <= 0) {
      setUsdtInput("");
      setDebouncedUsdt("");
    }
  }, []);

  // Reset inputs when wallet changes
  useEffect(() => {
    reset();
  }, [address, reset]);

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

  // Reset inputs when trade confirms
  useEffect(() => {
    if (tradeReceipt.isSuccess) {
      reset();
    }
  }, [tradeReceipt.isSuccess, reset]);

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
  const isPreviewLoading = buyFetching || sellFetching;

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
    isPreviewLoading,
    approve, execute,
    txHash: tradeTx.data,
    txSuccess: tradeReceipt.isSuccess,
    error: approveTx.error || tradeTx.error,
  };
}