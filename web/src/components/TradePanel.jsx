import { motion } from "framer-motion";
import { ArrowDownUp, ExternalLink } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useSPVTrade } from "../hooks/useSPVTrade";
import { useSPVFees } from "../hooks/useSPVFees";
import { useGasEstimate } from "../hooks/useGasEstimate";
import { CONFIG } from "../config";
import { formatUsdt, formatSpv } from "../utils/format";
import AnimatedNumber from "./AnimatedNumber";

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

  const applyPercent = (pct) => {
    if (isBuy) {
      const balance = Number(t.usdtBalance) / 1e6;
      const value = (balance * pct) / 100;
      if (value > 0) t.setUsdtInput(value.toFixed(6));
    } else {
      const balance = Number(t.spvBalance) / 1e18;
      const value = (balance * pct) / 100;
      if (value > 0) t.setSpvInput(value.toFixed(6));
    }
  };

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

  const actionDisabled =
    !isConnected ||
    t.isPending ||
    inputError ||
    t.parsedAmount === 0n ||
    (t.needsApproval ? false : !t.canTrade);

  const actionReady = !actionDisabled;
  const actionLabel = !isConnected
    ? "Connect Wallet"
    : t.isPending
    ? "Confirming..."
    : t.needsApproval
    ? `Approve ${isBuy ? "USDT" : "SPV"}`
    : isBuy
    ? "Buy SPV"
    : "Sell SPV";

  const handleAction = () => {
    if (!isConnected) {
      open();
      return;
    }
    if (t.needsApproval) {
      t.approve();
      return;
    }
    t.execute();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="text-label mb-4">Trade</div>
        <h2 className="display-lg">
          Buy or sell <span className="gradient-text">SPV</span>
        </h2>
      </div>

      {isConnected && (
        <div className="mb-12">
          <div className="grid grid-cols-3 gap-6 pb-8">
            <div>
              <div className="text-label mb-2">POL</div>
              <div className="text-mono text-xl text-warm">{polBalanceFormatted}</div>
            </div>
            <div>
              <div className="text-label mb-2">USDT</div>
              <div className="text-mono text-xl text-warm">{formatUsdt(t.usdtBalance)}</div>
            </div>
            <div>
              <div className="text-label mb-2">SPV</div>
              <div className="text-mono text-xl text-warm">{formatSpv(t.spvBalance)}</div>
            </div>
          </div>
          <div className="divider-full" />
        </div>
      )}

      <div className="flex items-center gap-10 mb-12" role="tablist" aria-label="Trade direction">
        {["buy", "sell"].map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={t.mode === m}
            onClick={() => { t.setMode(m); t.reset(); }}
            className={`btn-feedback relative pb-3 text-2xl sm:text-3xl font-black uppercase tracking-wider transition-colors ${
              t.mode === m ? "text-warm" : "text-warm-mute hover:text-warm-dim"
            }`}
          >
            {m}
            {t.mode === m && (
              <motion.div
                layoutId="trade-mode-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00ffff] to-[#ff8c00]"
              />
            )}
          </button>
        ))}
      </div>

      {isConnected && (
        <div className="flex gap-2 mb-6" role="group" aria-label="Quick fill percentages">
          {[
            { label: "25%", pct: 25 },
            { label: "50%", pct: 50 },
            { label: "75%", pct: 75 },
            { label: "Max", pct: 100 },
          ].map((btn) => (
            <button
              key={btn.label}
              type="button"
              onClick={() => applyPercent(btn.pct)}
              aria-label={`Fill ${btn.label} of balance`}
              className="btn-feedback flex-1 py-2 rounded-full border border-[#00ffff]/15 text-xs font-bold text-warm-dim hover:border-[#00ffff]/40 hover:text-[#00ffff] transition-colors"
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}

      <div className="mb-8">
        <label htmlFor="trade-top" className="text-label block mb-4">
          {topLabel}
        </label>
        <div className="flex items-baseline gap-4 pb-4 border-b border-[#00ffff]/15">
          <input
            id="trade-top"
            type="number"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.0"
            value={topValue}
            onChange={(e) => handleTopChange(e.target.value)}
            aria-label={`${topLabel} in ${topSymbol}`}
            aria-invalid={inputError}
            aria-describedby={inputError ? "trade-error" : undefined}
            className="flex-1 bg-transparent text-4xl sm:text-5xl font-mono outline-none placeholder:text-warm-mute/40 text-warm"
          />
          <span className="text-lg font-bold text-warm-dim">{topSymbol}</span>
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className="text-xs text-warm-mute">Balance {topBalance}</span>
        </div>
        {inputError && (
          <div id="trade-error" role="alert" className="text-xs text-red-400 mt-3">
            {validationError}
          </div>
        )}
      </div>

      <div className="flex justify-center py-4" aria-hidden="true">
        <ArrowDownUp className="w-5 h-5 text-[#00ffff]/60" />
      </div>

      <div className="mb-12">
        <label htmlFor="trade-bottom" className="text-label block mb-4">
          {bottomLabel}
        </label>
        <div className="flex items-baseline gap-4 pb-4 border-b border-[#00ffff]/15">
          <input
            id="trade-bottom"
            type="number"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.0"
            value={bottomValue}
            onChange={(e) => handleBottomChange(e.target.value)}
            aria-label={`${bottomLabel} in ${bottomSymbol}`}
            className="flex-1 bg-transparent text-4xl sm:text-5xl font-mono outline-none placeholder:text-warm-mute/40 text-warm"
          />
          <span className="text-lg font-bold text-warm-dim">{bottomSymbol}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-12 pb-8">
        <div>
          <div className="text-label mb-2">Creator Fee</div>
          <div className="text-mono text-sm text-warm-dim">
            {fees.loading ? (
              "—"
            ) : (
              <AnimatedNumber value={fees.creatorFeePct} decimals={2} suffix="%" />
            )}
          </div>
        </div>
        <div>
          <div className="text-label mb-2">Est. Gas</div>
          <div className="text-mono text-sm text-warm-dim">
            {t.parsedAmount === 0n || inputError
              ? "—"
              : gasLoading
              ? "..."
              : (
                <>
                  ~
                  <AnimatedNumber value={Number(gasCostPol)} decimals={6} /> POL
                </>
              )}
          </div>
        </div>
        <div>
          <div className="text-label mb-2">Slippage</div>
          <div className="text-mono text-sm text-warm-dim">2%</div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAction}
        disabled={actionDisabled && isConnected}
        aria-label={actionLabel}
        className={`btn-feedback btn-feedback-strong btn-gold w-full ${actionReady ? "btn-idle-pulse" : ""}`}
      >
        {actionLabel}
      </button>

      {t.error && (
        <div role="alert" className="text-xs text-red-400 text-center mt-6 break-words">
          {t.error.shortMessage || t.error.message}
        </div>
      )}

      {t.txHash && (
        <a
          href={`${CONFIG.explorer}/tx/${t.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View transaction on Polygonscan"
          className="flex items-center justify-center gap-2 text-xs text-warm-dim mt-6 hover:text-[#00ffff]"
        >
          View on Polygonscan <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}