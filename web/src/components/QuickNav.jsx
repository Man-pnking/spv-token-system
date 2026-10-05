import { useEffect, useState } from "react";
import { ArrowUp, ArrowLeftRight, ArrowDown } from "lucide-react";

export default function QuickNav({ onOpenTrade }) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(y > 200);

      // Highlight the active icon based on scroll position
      if (y < 100) setActive("top");
      else if (y >= max - 200) setActive("bottom");
      else setActive(null);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToFooter = () => {
    const footer = document.getElementById("footer");
    if (footer) {
      const top = footer.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleTrade = () => {
    if (onOpenTrade && window.innerWidth < 768) {
      onOpenTrade();
      return;
    }
    const el = document.querySelector("#trade");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-40 flex flex-col items-center gap-2 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
    >
      {/* Top */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`group glass-strong w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
          active === "top" ? "ring-1 ring-[#00ffff]/50" : ""
        }`}
      >
        <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white transition-colors" />
      </button>

      {/* Trade — accent, larger */}
      <button
        onClick={handleTrade}
        aria-label="Open trade panel"
        className="group w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 bg-gradient-to-br from-[#00ffff] to-[#00a8a8] shadow-[0_8px_32px_rgba(0,255,255,0.45)] hover:shadow-[0_12px_44px_rgba(0,255,255,0.65)]"
      >
        <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#050510]" strokeWidth={2.5} />
      </button>

      {/* Footer */}
      <button
        onClick={scrollToFooter}
        aria-label="Scroll to footer"
        className={`group glass-strong w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
          active === "bottom" ? "ring-1 ring-[#00ffff]/50" : ""
        }`}
      >
        <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white transition-colors" />
      </button>
    </div>
  );
}