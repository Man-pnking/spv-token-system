import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { useRecentActivity } from "../hooks/useRecentActivity";
import { CONFIG } from "../config";

function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function ActivityFeed() {
  const { data, loading, error } = useRecentActivity(10);

  return (
    <div className="mb-16">
      <div className="flex items-baseline justify-between mb-6">
        <div className="text-xs uppercase tracking-[0.3em] text-warm-mute">
          Recent activity
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute">
          Last {data.length} trades
        </div>
      </div>

      {loading && (
        <div className="text-sm text-warm-mute py-8 text-center">
          Loading activity…
        </div>
      )}

      {!loading && error && (
        <div className="text-sm text-warm-mute py-8 text-center">
          Feed unavailable — {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="text-sm text-warm-mute py-8 text-center">
          No trades yet. Be the first to buy.
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div>
          {data.map((entry, i) => {
            const isBuy = entry.type === "buy";
            return (
              <motion.a
                key={`${entry.txHash}-${i}`}
                href={`${CONFIG.explorer}/tx/${entry.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex items-center justify-between py-3 border-b border-[#00ffff]/8 group transition-colors hover:border-[#00ffff]/25"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: isBuy
                        ? "rgba(0, 255, 255, 0.08)"
                        : "rgba(255, 255, 255, 0.03)",
                      border: `1px solid ${isBuy ? "rgba(0, 255, 255, 0.2)" : "rgba(240, 240, 240, 0.08)"}`,
                    }}
                  >
                    {isBuy ? (
                      <ArrowUpRight className="w-4 h-4 text-[#00ffff]" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-warm-dim" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="font-mono text-xs"
                        style={{ color: isBuy ? "rgba(0, 255, 255, 0.85)" : "rgba(240, 240, 240, 0.6)" }}
                      >
                        {isBuy ? "Buy" : "Sell"}
                      </span>
                      <span className="font-mono text-xs text-warm-mute">
                        {shortAddress(entry.wallet)}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-warm-mute mt-0.5">
                      {entry.tokens.toFixed(2)} SPV for {entry.usdt.toFixed(4)} USDT
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-warm-mute">
                    {entry.ago}
                  </span>
                  <ExternalLink className="w-3 h-3 text-warm-mute opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.a>
            );
          })}
        </div>
      )}

      <div className="divider-full mt-6" />
    </div>
  );
}