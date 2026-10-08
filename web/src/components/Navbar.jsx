import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WalletButton from "./WalletButton";
import SPVMark from "./SPVMark";
import PriceTickerBanner from "./PriceTickerBanner";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#intro", label: "Introduction" },
  { href: "#what", label: "What You're Buying" },
  { href: "#stats", label: "Stats" },
  { href: "#how", label: "How it Works" },
  { href: "#trade", label: "Trade" },
  { href: "#docs", label: "Docs" },
  { href: "#faq", label: "FAQ" },
  { href: "#team", label: "Team" },
  { href: "#verify", label: "Verify" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 safe-top">
      <div
        className="w-full py-3"
        style={{
          background: "rgba(10, 8, 6, 0.92)",
          borderBottom: "1px solid rgba(0, 255, 255, 0.08)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
          contain: "layout paint",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 shrink-0" aria-label="SPV home">
            <SPVMark size={32} />
            <span className="hidden md:block text-sm font-medium text-warm">
              Special Purpose Vehicle
            </span>
            <span className="md:hidden text-sm font-medium text-warm">
              SPV
            </span>
          </a>

          <nav className="hidden xl:block" aria-label="Primary">
            <ul className="flex items-center gap-5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm transition-colors whitespace-nowrap"
                    style={{ color: "rgba(240, 240, 240, 0.55)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0, 255, 255, 0.9)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(240, 240, 240, 0.55)"; }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <WalletButton />
            </div>
            <button
              ref={toggleRef}
              onClick={() => setOpen((v) => !v)}
              className="xl:hidden rounded-xl p-2.5"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(0, 255, 255, 0.08)",
              }}
            >
              {open ? <X className="w-5 h-5 text-warm" /> : <Menu className="w-5 h-5 text-warm" />}
            </button>
          </div>
        </div>
      </div>

      <PriceTickerBanner />

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.6)" }}
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              key="menu"
              id="mobile-menu"
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="xl:hidden fixed top-24 left-4 right-4 z-50 rounded-2xl p-5"
              style={{
                background: "rgba(10, 8, 6, 0.96)",
                border: "1px solid rgba(0, 255, 255, 0.08)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              }}
            >
              <nav aria-label="Mobile">
                <ul className="space-y-1 mb-5">
                  {LINKS.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="block px-4 py-3 rounded-xl transition-colors text-sm"
                        style={{ color: "rgba(240, 240, 240, 0.7)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(0, 255, 255, 0.9)"; e.currentTarget.style.background = "rgba(0, 255, 255, 0.04)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(240, 240, 240, 0.7)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="pt-4" style={{ borderTop: "1px solid rgba(0, 255, 255, 0.08)" }}>
                <WalletButton full />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}