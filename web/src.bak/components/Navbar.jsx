import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WalletButton from "./WalletButton";
import SPVMark from "./SPVMark";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#intro", label: "Introduction" },
  { href: "#what", label: "What You're Buying" },
  { href: "#stats", label: "Stats" },
  { href: "#how", label: "How it Works" },
  { href: "#trade", label: "Trade" },
  { href: "#docs", label: "Docs" },
  { href: "#faq", label: "FAQ" },
  { href: "#verify", label: "Verify" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape and return focus to the toggle button
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
                    style={{ color: "rgba(245, 239, 224, 0.55)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212, 175, 55, 0.9)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245, 239, 224, 0.55)"; }}
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
              className="xl:hidden fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(20px)" }}
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
                background: "rgba(15, 11, 7, 0.7)",
                backdropFilter: "blur(50px) saturate(140%)",
                WebkitBackdropFilter: "blur(50px) saturate(140%)",
                border: "1px solid rgba(212, 175, 55, 0.08)",
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
                        style={{ color: "rgba(245, 239, 224, 0.7)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(212, 175, 55, 0.9)"; e.currentTarget.style.background = "rgba(212, 175, 55, 0.04)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(245, 239, 224, 0.7)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
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