import { formatUnits, parseUnits } from "viem";

export const formatUsdt = (v, decimals = 2) => {
  if (v === undefined || v === null) return "0.00";
  try {
    const n = Number(formatUnits(v, 6));
    return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  } catch { return "0.00"; }
};

export const formatSpv = (v, decimals = 2) => {
  if (v === undefined || v === null) return "0.00";
  try {
    const n = Number(formatUnits(v, 18));
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(2) + "K";
    return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  } catch { return "0.00"; }
};

export const formatBps = (bps) => {
  if (!bps) return "0.00";
  return (Number(bps) / 100).toFixed(2);
};

export const formatPrice = (priceWei) => {
  if (!priceWei) return "0.000000";
  const n = Number(formatUnits(priceWei, 18));
  if (n < 0.0001) return n.toExponential(2);
  return n.toFixed(6);
};

export const shorten = (addr, chars = 4) => {
  if (!addr) return "";
  return `${addr.slice(0, 2 + chars)}...${addr.slice(-chars)}`;
};

export const parseUsdt = (v) => {
  try { return parseUnits(v.toString(), 6); } catch { return 0n; }
};

export const parseSpv = (v) => {
  try { return parseUnits(v.toString(), 18); } catch { return 0n; }
};