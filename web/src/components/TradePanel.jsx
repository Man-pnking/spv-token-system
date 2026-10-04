import { motion } from "framer-motion";
import { ArrowDownUp, ExternalLink, Wallet, Fuel, Info, AlertCircle } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useSPVTrade } from "../hooks/useSPVTrade";
import { useSPVFees } from "../hooks/useSPVFees";
import { useGasEstimate } from "../hooks/useGasEstimate";
import { CONFIG } from "../config";
import { formatUsdt, formatSpv } from "../utils/format";

const MIN_USDT = 0.01;
const MIN_SPV = 1;

export default function TradePanel() {
  const { isConnected, address } = useAccount();
  const { open } = useAppKit();
  const t = useSPVTrade();
  const fees = useSPVFees();

  const { data: polBalance } = useBalance({
    address,
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  const isBuy = t.mode === "buy";
  const topLabel = isBuy ? "You pay (USDT)" : "You sell (SPV)";
  const topValue = isBuy ? t.usdtInput : t.spvInput;
  const topSymbol = isBuy ? "USDT" : "SPV";
  const topBalance = isBuy ? formatUsdt(t.usdtBalance) : formatSpv(t.spvBalance);

  const bottomLabel = isBuy ? "You receive (SPV)" : "You receive (USDT)";
  const bottomValue = isBuy ? t.spvInput : t.usdtInput;
  const bottomSymbol = isBuy ? "SPV" : "USDT";

  const previewOut = isBuy ? t.previewBuy : t.previewSell;
  const minOut = previewOut > 0n ? (previewOut * 99n) / 100n : 0n;
  const { gasCostPol, loading: gasLoading } = useGasEstimate(
    t.mode,
    t.parsedAmount,
    minOut
  );

  const handleTopChange = (v) => {
    if (isBuy) t.setUsdtInput(v);
    else t.setSpvInput(v);
  };

  const handleBottomChange = (v) => {
    if (isBuy) t.setSpvInput(v);
    else t.setUsdtInput(v);
  };

  const creatorFeePct = fees.loading ? "—" : `${fees.creatorFeePct.toFixed(2)}%`;
  const burnPct = fees.loading ? "—" : `${fees.burnPct.toFixed(2)}%`;
  const polBalanceFormatted = polBalance
    ? Number(polBalance.formatted).toFixed(4)
    : "0.0000";

  // --- Validation logic ---
  const inputTop = parseFloat(topValue || "0");
  const balanceTop = isBuy
    ? Number(t.usdtBalance) / 1e6
    : Number(t.spvBalance) / 1e18;
  const minRequired = isBuy ? MIN_USDT : MIN_SPV;

  let validationError = "";
  if (topValue && inputTop > 0) {
    if (inputTop < minRequired) {
      validationError = isBuy
        ? `Minimum buy is ${MIN_USDT} USDT`
        : `Minimum sell is ${MIN_SPV} SPV`;
    } else if (inputTop > balanceTop) {
      validationError = isBuy
        ? `Insufficient USDT. You have ${balanceTop.toFixed(6)} USDT.`
        : `Insufficient SPV. You have ${balanceTop.toFixed(4)} SPV.`;
    }
  }

  const inputError = validationError !== "";

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-black mb-4">
          Trade <span className="gradient-text">SPV</span>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Buy or sell on the bonding curve. Prices update as you type.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 glass-strong rounded-3xl p-6"
        >
          <div className="grid grid-cols-2 gap-2 p-1 rounded-full glass mb-6">
            <button
              onClick={() => { t.setMode("buy"); t.reset(); }}
              className={`py-2.5 rounded-full text-sm font-bold transition-all ${isBuy ? "glow-btn text-white" : "text-white/60"}`}
            >
              Buy
            </button>
            <button
              onClick={() => { t.setMode("sell"); t.reset(); }}
              className={`py-2.5 rounded-full text-sm font-bold transition-all ${!isBuy ? "glow-btn text-white" : "text-white/60"}`}
            >
              Sell
            </button>
          </div>

          <div className="space-y-3 mb-4">
            <label className="text-xs text-white/60">{topLabel}</label>
            <div className={`glass rounded-2xl p-4 transition-colors ${inputError ? "border border-red-500/40" : ""}`}>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.0"
                  value={topValue}
                  onChange={(e) => handleTopChange(e.target.value)}
                  className="flex-1 bg-transparent text-2xl font-mono outline-none placeholder:text-white/20"
                />
                <span className="text-sm font-bold text-white/60">{topSymbol}</span>
              </div>
              <div className="text-xs text-white/40 mt-2">Balance: {topBalance}</div>
            </div>
            {inputError && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}
          </div>

          <div className="flex justify-center -my-3 relative z-10">
            <div className="w-10 h-10 glass-strong rounded-full flex items-center justify-center">
              <ArrowDownUp className="w-4 h-4 text-white/60" />
            </div>
          </div>

          <div className="space-y-3 mt-4 mb-6">
            <label className="text-xs text-white/60">{bottomLabel}</label>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.0"
                  value={bottomValue}
                  onChange={(e) => handleBottomChange(e.target.value)}
                  className="flex-1 bg-transparent text-2xl font-mono outline-none placeholder:text-white/20"
                />
                <span className="text-sm font-bold text-white/60">{bottomSymbol}</span>
              </div>
              <div className="text-xs text-white/40 mt-2">Estimated · 1% slippage</div>
            </div>
          </div>

          {!isConnected ? (
            <button onClick={() => open()} className="w-full glow-btn text-white font-bold rounded-2xl py-4">
              Connect Wallet
            </button>
          ) : t.needsApproval ? (
            <button
              onClick={t.approve}
              disabled={t.isPending || t.parsedAmount === 0n || inputError}
              className="w-full glow-btn text-white font-bold rounded-2xl py-4 disabled:opacity-40"
            >
              {t.isPending ? "Approving..." : `Approve ${isBuy ? "USDT" : "SPV"}`}
            </button>
          ) : (
            <button
              onClick={t.execute}
              disabled={!t.canTrade || t.isPending || inputError}
              className="w-full glow-btn text-white font-bold rounded-2xl py-4 disabled:opacity-40"
            >
              {t.isPending ? "Confirming..." : isBuy ? "Buy SPV" : "Sell SPV"}
            </button>
          )}

          {t.error && (
            <div className="text-xs text-red-400 text-center mt-3 break-words">
              {t.error.shortMessage || t.error.message}
            </div>
          )}

          {t.txHash && (
            <a
              href={`${CONFIG.explorer}/tx/${t.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs text-white/60 mt-4 hover:text-white"
            >
              View on Polygonscan <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-5 space-y-4 h-fit"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">
            Wallet
          </h3>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white/70" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-white/50">POL Balance</div>
              <div className="font-mono text-sm">{polBalanceFormatted} POL</div>
              <div className="text-[10px] text-white/40 mt-0.5">For gas fees</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-teal-400">$</span>
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-white/50">USDT Balance</div>
              <div className="font-mono text-sm">{formatUsdt(t.usdtBalance)} USDT</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-violet-400">S</span>
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-white/50">SPV Balance</div>
              <div className="font-mono text-sm">{formatSpv(t.spvBalance)} SPV</div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4" />

          <h3 className="text-sm font-bold uppercase tracking-wider text-white/60">
            Fees
          </h3>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Info className="w-4 h-4 text-white/70" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-white/50">Creator Fee</div>
              <div className="font-mono text-sm">{creatorFeePct}</div>
              <div className="text-[10px] text-white/40 mt-0.5">Paid in USDT</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Info className="w-4 h-4 text-white/70" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-white/50">Burn Rate</div>
              <div className="font-mono text-sm">{burnPct}</div>
              <div className="text-[10px] text-white/40 mt-0.5">Per sell</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Fuel className="w-4 h-4 text-white/70" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-wider text-white/50">Estimated Gas</div>
              <div className="font-mono text-sm">
                {t.parsedAmount === 0n || inputError
                  ? "—"
                  : gasLoading
                  ? "Loading..."
                  : `~${gasCostPol} POL`}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">Network fee</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}