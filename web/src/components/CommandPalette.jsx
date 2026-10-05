import { useEffect, useState, useMemo, useRef } from "react";
import { useAppKit } from "@reown/appkit/react";
import {
  Home, BarChart3, ArrowLeftRight, BookOpen, HelpCircle, ShieldCheck,
  Wallet, ExternalLink, Sparkles,
} from "lucide-react";
import { CONFIG } from "../config";

const ITEMS = [
  { id: "home",    label: "Home",             icon: Home,            type: "section", href: "#home" },
  { id: "stats",   label: "Live Stats",       icon: BarChart3,       type: "section", href: "#stats" },
  { id: "how",     label: "How It Works",     icon: Sparkles,        type: "section", href: "#how" },
  { id: "trade",   label: "Trade SPV",        icon: ArrowLeftRight,  type: "section", href: "#trade" },
  { id: "docs",    label: "Documentation",    icon: BookOpen,        type: "section", href: "#docs" },
  { id: "faq",     label: "FAQ",              icon: HelpCircle,      type: "section", href: "#faq" },
  { id: "verify",  label: "Verify Contracts", icon: ShieldCheck,     type: "section", href: "#verify" },
  { id: "wallet",  label: "Connect Wallet",   icon: Wallet,          type: "action",  action: "wallet" },
  { id: "polygon", label: "View on Polygonscan", icon: ExternalLink, type: "external", href: CONFIG.explorer },
];

export default function CommandPalette({ open, onClose, onOpenTrade }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const { open: openWallet } = useAppKit();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((i) => i.label.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    setTimeout(() => inputRef.current?.focus(), 20);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(filtered[active]);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, active, filtered, onClose]);

  const handleSelect = (item) => {
    if (!item) return;

    if (item.type === "external") {
      window.open(item.href, "_blank", "noopener");
      onClose();
      return;
    }

    if (item.type === "action" && item.action === "wallet") {
      openWallet();
      onClose();
      return;
    }

    if (item.type === "section") {
      onClose();
      if (item.id === "trade" && onOpenTrade && window.innerWidth < 768) {
        onOpenTrade();
        return;
      }
      const el = document.querySelector(item.href);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl glass-strong rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            placeholder="Jump to section or action..."
            className="flex-1 bg-transparent text-base outline-none placeholder:text-white/30"
          />
          <kbd className="text-[10px] px-2 py-1 rounded border border-white/15 text-white/50 font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-white/40 text-sm">
              No results for "{query}"
            </div>
          )}
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onMouseEnter={() => setActive(idx)}
                onClick={() => handleSelect(item)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                  idx === active ? "bg-[#00ffff]/10" : "hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${idx === active ? "text-[#00ffff]" : "text-white/50"}`} />
                <span className={`text-sm ${idx === active ? "text-white" : "text-white/70"}`}>
                  {item.label}
                </span>
                {item.type === "external" && (
                  <ExternalLink className="w-3 h-3 ml-auto text-white/30" />
                )}
              </button>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-white/8 flex items-center justify-between text-[10px] text-white/40 font-mono">
          <span>Arrows navigate / Enter select / ESC close</span>
          <span>Ctrl K</span>
        </div>
      </div>
    </div>
  );
}