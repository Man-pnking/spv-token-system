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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={`frost-layer rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between transition-all ${
            scrolled ? "border border-[#d4af37]/20" : "border border-[#d4af37]/10"
          }`}
        >
          <a href="#home" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl btn-gold flex items-center justify-center font-black text-xs">
              SPV
            </div>
            <span className="font-bold text-lg hidden md:block text-warm">
              Special Purpose Vehicle
            </span>
            <span className="font-bold text-lg md:hidden text-warm">SPV</span>
          </a>

          <nav className="hidden lg:flex items-center gap-6">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-warm-dim hover:text-[#d4af37] transition-colors"
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
              className="lg:hidden glass-button p-2.5 rounded-xl"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5 text-warm" /> : <Menu className="w-5 h-5 text-warm" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed top-20 left-4 right-4 z-50 frost-layer rounded-2xl p-5 border border-[#d4af37]/20"
            >
              <div className="space-y-1 mb-5">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-xl text-warm-dim hover:text-[#d4af37] hover:bg-white/5 transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
              <div className="pt-4 border-t border-[#d4af37]/15">
                <WalletButton />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}