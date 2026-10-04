import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import WalletButton from "./WalletButton";

const LINKS = [
  { href: "#home", label: "Home" },
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${scrolled ? "py-2" : "py-4"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between transition-all ${scrolled ? "glass-strong" : ""}`}>
          <a href="#home" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl glow-btn flex items-center justify-center font-black text-xs">SPV</div>
            <span className="font-bold text-lg hidden md:block">Special Purpose Vehicle</span>
            <span className="font-bold text-lg md:hidden">SPV</span>
          </a>

          <nav className="hidden lg:flex items-center gap-6">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <WalletButton />
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden glass-button p-2.5"
              aria-label="Menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden glass-strong rounded-2xl mt-2 p-4 space-y-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-xl text-white/80 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}