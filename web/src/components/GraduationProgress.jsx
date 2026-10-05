import { motion } from "framer-motion";
import { useSPVFees } from "../hooks/useSPVFees";
import { formatSpv } from "../utils/format";

const PRICE_TARGET = 5;         // 5x
const SUPPLY_TARGET = 5_000_000;
const HOLDER_TARGET = 500;

function Bar({ label, value, target, ok, format }) {
  const pct = Math.min(100, Math.max(0, (value / target) * 100));

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-warm-mute">
          {label}
        </span>
        <span
          className={`text-[10px] uppercase tracking-[0.2em] ${
            ok ? "text-[#d4af37]" : "text-warm-mute"
          }`}
        >
          {ok ? "Met" : `${pct.toFixed(1)}%`}
        </span>
      </div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-sm text-warm">
          {format(value)}
        </span>
        <span className="font-mono text-[11px] text-warm-mute">
          / {format(target)}
        </span>
      </div>
      <div className="h-px bg-white/5 relative overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4c430]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export default function GraduationProgress() {
  const s = useSPVFees();

  if (s.loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-[10px] uppercase tracking-[0.3em] text-warm-mute mb-6 text-center">
          Loading migration progress…
        </div>
      </div>
    );
  }

  const priceX = s.priceRatio;
  const supply = Number(s.totalMinted) / 1e18;
  const holders = s.uniqueBuyers;

  const priceOk = s.priceOk;
  const supplyOk = s.supplyOk;
  const holdersOk = s.holdersOk;
  const triggersMet = s.triggersMet;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-baseline justify-between mb-6">
        <div className="text-[10px] uppercase tracking-[0.3em] text-warm-mute">
          Migration progress
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-warm-mute">
          <span className="text-[#d4af37]">{triggersMet}</span> of 2 triggers met
        </div>
      </div>

      <div className="space-y-6">
        <Bar
          label="Price 5x initial"
          value={priceX}
          target={PRICE_TARGET}
          ok={priceOk}
          format={(v) => `${v.toFixed(2)}x`}
        />
        <Bar
          label="Total minted"
          value={supply}
          target={SUPPLY_TARGET}
          ok={supplyOk}
          format={(v) => formatSpv(BigInt(Math.floor(v)) * 10n ** 18n)}
        />
        <Bar
          label="Unique buyers"
          value={holders}
          target={HOLDER_TARGET}
          ok={holdersOk}
          format={(v) => Math.floor(v).toString()}
        />
      </div>

      <div className="mt-8 pt-6 border-t border-[#d4af37]/10 text-center">
        <div className="text-[10px] uppercase tracking-[0.3em] text-warm-mute mb-2">
          Once graduated
        </div>
        <p className="text-xs text-warm-dim leading-relaxed max-w-md mx-auto">
          Liquidity migrates to QuickSwap. LP tokens are burned.
          Trading continues via the same router.
        </p>
      </div>
    </div>
  );
}