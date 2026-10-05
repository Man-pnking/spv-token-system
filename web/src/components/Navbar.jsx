import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WalletButton from "./WalletButton";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#intro", label: "Introduction" },
  { href: "#stats", label: "Stats" },
  { href: "#how", label: "How it Works" },
  { href: "#trade", label: "Trade" },
  { href: "#docs", label: "Docs" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-top ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-500"
          style={{
            background: "rgba(15, 11, 7, 0.5)",
            backdropFilter: "blur(40px) saturate(140%)",
            WebkitBackdropFilter: "blur(40px) saturate(140%)",
            border: "1px solid rgba(212, 175, 55, 0.06)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          }}
        >
          <a href="#home" className="flex items-center gap-2 shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs"
              style={{
                background: "linear-gradient(135deg, #d4af37 0%, #8a6f22 100%)",
                color: "#0a0705",
              }}
            >
              SPV
            </div>
            <span className="font-medium text-base hidden md:block" style={{ color: "rgba(245, 239, 224, 0.85)" }}>
              Special Purpose Vehicle
            </span>
            <span className="font-medium text-base md:hidden" style={{ color: "rgba(245, 239, 224, 0.85)" }}>
              SPV
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm transition-colors"
                style={{ color: "rgba(245, 239, 224, 0.55)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212, 175, 55, 0.9)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245, 239, 224, 0.55)"; }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <WalletButton />
            </div>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden rounded-xl p-2.5"
              aria-label="Menu"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(212, 175, 55, 0.08)",
              }}
            >
              {open ? <X className="w-5 h-5 text-warm" /> : <Menu className="w-5 h-5 text-warm" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(20px)" }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed top-24 left-4 right-4 z-50 rounded-2xl p-5"
              style={{
                background: "rgba(15, 11, 7, 0.7)",
                backdropFilter: "blur(50px) saturate(140%)",
                WebkitBackdropFilter: "blur(50px) saturate(140%)",
                border: "1px solid rgba(212, 175, 55, 0.08)",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="space-y-1 mb-5">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl transition-colors text-sm"
                    style={{ color: "rgba(245, 239, 224, 0.7)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212, 175, 55, 0.9)"; e.currentTarget.style.background = "rgba(212, 175, 55, 0.04)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245, 239, 224, 0.7)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
              <div className="pt-4" style={{ borderTop: "1px solid rgba(212, 175, 55, 0.08)" }}>
                <WalletButton full />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}