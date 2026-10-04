import { motion } from "framer-motion";
import { ArrowDownUp, ExternalLink } from "lucide-react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useSPVTrade } from "../hooks/useSPVTrade";
import { CONFIG } from "../config";
import { formatUsdt, formatSpv } from "../utils/format";

export default function TradePanel() {
  const { isConnected } = useAccount();
  const { open } = useAppKit();
  const t = useSPVTrade();

  const isBuy = t.mode === "buy";
  const topLabel = isBuy ? "You pay (USDT)" : "You sell (SPV)";
  const topValue = isBuy ? t.usdtInput : t.spvInput;
  const topSymbol = isBuy ? "USDT" : "SPV";
  const topBalance = isBuy ? formatUsdt(t.usdtBalance) : formatSpv(t.spvBalance);

  const bottomLabel = isBuy ? "You receive (SPV)" : "You receive (USDT)";
  const bottomValue = isBuy ? t.spvInput : t.usdtInput;
  const bottomSymbol = isBuy ? "SPV" : "USDT";

  const handleTopChange = (v) => {
    if (isBuy) t.setUsdtInput(v);
    else t.setSpvInput(v);
  };

  const handleBottomChange = (v) => {
    if (isBuy) t.setSpvInput(v);
    else t.setUsdtInput(v);
  };

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto glass-strong rounded-3xl p-6"
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
          <div className="glass rounded-2xl p-4">
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
            disabled={t.isPending || t.parsedAmount === 0n}
            className="w-full glow-btn text-white font-bold rounded-2xl py-4"
          >
            {t.isPending ? "Approving..." : `Approve ${isBuy ? "USDT" : "SPV"}`}
          </button>
        ) : (
          <button
            onClick={t.execute}
            disabled={!t.canTrade || t.isPending}
            className="w-full glow-btn text-white font-bold rounded-2xl py-4 disabled:opacity-40"
          >
            {t.isPending ? "Confirming..." : isBuy ? "Buy SPV" : "Sell SPV"}
          </button>
        )}

        {!t.hasBalance && t.parsedAmount > 0n && (
          <div className="text-xs text-red-400 text-center mt-3">Insufficient balance</div>
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
    </div>
  );
}