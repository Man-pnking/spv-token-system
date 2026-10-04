import { motion } from "framer-motion";
import { ArrowDownUp, ExternalLink, Loader2 } from "lucide-react";
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
  const topLabel = isBuy ? "You pay" : "You sell";
  const topValue = isBuy ? t.usdtInput : t.spvInput;
  const topSymbol = isBuy ? "USDT" : "SPV";
  const topBalance = isBuy ? formatUsdt(t.usdtBalance) : formatSpv(t.spvBalance);

  const bottomLabel = "You receive";
  const bottomValue = isBuy ? t.spvInput : t.usdtInput;
  const bottomSymbol = isBuy ? "SPV" : "USDT";

  const previewOut = isBuy ? t.previewBuy : t.previewSell;
  const minOut = previewOut > 0n ? (previewOut * 99n) / 100n : 0n;
  const { gasCostPol, loading: gasLoading } = useGasEstimate(t.mode, t.parsedAmount, minOut);

  const handleTopChange = (v) => {
    if (isBuy) t.setUsdtInput(v);
    else t.setSpvInput(v);
  };

  const handleBottomChange = (v) => {
    if (isBuy) t.setSpvInput(v);
    else t.setUsdtInput(v);
  };

  const creatorFeePct = fees.loading ? "—" : `${fees.creatorFeePct.toFixed(2)}%`;
  const polBalanceFormatted = polBalance ? Number(polBalance.formatted).toFixed(4) : "0.0000";

  const inputTop = parseFloat(topValue || "0");
  const balanceTop = isBuy ? Number(t.usdtBalance) / 1e6 : Number(t.spvBalance) / 1e18;
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
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-16">
        <div className="text-xs uppercase tracking-[0.3em] text-warm-mute mb-4">
          Trade
        </div>
        <h2 className="text-4xl sm:text-6xl font-black leading-tight">
          Buy or sell <span className="gradient-text">SPV</span>
        </h2>
      </div>

      {isConnected && (
        <div className="mb-12">
          <div className="grid grid-cols-3 gap-6 pb-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-2">
                POL
              </div>
              <div className="font-mono text-xl text-warm">{polBalanceFormatted}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-2">
                USDT
              </div>
              <div className="font-mono text-xl text-warm">{formatUsdt(t.usdtBalance)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-2">
                SPV
              </div>
              <div className="font-mono text-xl text-warm">{formatSpv(t.spvBalance)}</div>
            </div>
          </div>
          <div className="divider-full" />
        </div>
      )}

      <div className="flex items-center gap-10 mb-16">
        {["buy", "sell"].map((m) => (
          <button
            key={m}
            onClick={() => { t.setMode(m); t.reset(); }}
            className={`relative pb-3 text-2xl sm:text-3xl font-black uppercase tracking-wider transition-colors ${
              t.mode === m ? "text-warm" : "text-warm-mute hover:text-warm-dim"
            }`}
          >
            {m}
            {t.mode === m && (
              <motion.div
                layoutId="trade-mode-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#d4af37] to-[#f4c430]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Top input */}
      <div className="mb-8">
        <div className="flex items-baseline justify-between mb-4">
          <label className="text-xs uppercase tracking-[0.25em] text-warm-mute">
            {topLabel}
          </label>
          <span className="text-xs text-warm-mute">Balance {topBalance}</span>
        </div>
        <div className="flex items-baseline gap-4 pb-4 border-b border-[#d4af37]/15">
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.0"
            value={topValue}
            onChange={(e) => handleTopChange(e.target.value)}
            className="flex-1 bg-transparent text-4xl sm:text-5xl font-mono outline-none placeholder:text-warm-mute/40 text-warm"
          />
          <span className="text-lg font-bold text-warm-dim">{topSymbol}</span>
        </div>
        {inputError && (
          <div className="text-xs text-red-400 mt-3">{validationError}</div>
        )}
      </div>

      <div className="flex justify-center py-4">
        <ArrowDownUp className="w-5 h-5 text-[#d4af37]/60" />
      </div>

      {/* Bottom input */}
      <div className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <label className="text-xs uppercase tracking-[0.25em] text-warm-mute">
            {bottomLabel}
          </label>
          {t.isPreviewLoading && t.parsedAmount > 0n && (
            <span className="text-[10px] uppercase tracking-[0.25em] text-warm-mute flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              Updating
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-4 pb-4 border-b border-[#d4af37]/15">
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.0"
            value={bottomValue}
            onChange={(e) => handleBottomChange(e.target.value)}
            className="flex-1 bg-transparent text-4xl sm:text-5xl font-mono outline-none placeholder:text-warm-mute/40 text-warm"
          />
          <span className="text-lg font-bold text-warm-dim">{bottomSymbol}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-12 pb-8">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-2">
            Creator Fee
          </div>
          <div className="font-mono text-sm text-warm-dim">{creatorFeePct}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-2">
            Est. Gas
          </div>
          <div className="font-mono text-sm text-warm-dim">
            {t.parsedAmount === 0n || inputError
              ? "—"
              : gasLoading
              ? "..."
              : `~${gasCostPol} POL`}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-2">
            Slippage
          </div>
          <div className="font-mono text-sm text-warm-dim">1%</div>
        </div>
      </div>

      {!isConnected ? (
        <button onClick={() => open()} className="btn-gold w-full">
          Connect Wallet
        </button>
      ) : t.needsApproval ? (
        <button
          onClick={t.approve}
          disabled={t.isPending || t.parsedAmount === 0n || inputError}
          className="btn-gold w-full"
        >
          {t.isPending ? "Approving..." : `Approve ${isBuy ? "USDT" : "SPV"}`}
        </button>
      ) : (
        <button
          onClick={t.execute}
          disabled={!t.canTrade || t.isPending || inputError}
          className="btn-gold w-full"
        >
          {t.isPending ? "Confirming..." : isBuy ? "Buy SPV" : "Sell SPV"}
        </button>
      )}

      {t.error && (
        <div className="text-xs text-red-400 text-center mt-6 break-words">
          {t.error.shortMessage || t.error.message}
        </div>
      )}

      {t.txHash && (
        <a
          href={`${CONFIG.explorer}/tx/${t.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-xs text-warm-dim mt-6 hover:text-[#d4af37]"
        >
          View on Polygonscan <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}