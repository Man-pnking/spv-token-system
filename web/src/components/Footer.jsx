import {
  Github, Twitter, MessageCircle, ExternalLink, Send,
} from "lucide-react";
import { CONFIG } from "../config";
import { shorten } from "../utils/format";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 safe-bottom">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="divider mb-16" />

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h3 className="text-2xl font-black text-warm mb-4">
              Stay <span className="gradient-text">informed</span>
            </h3>
            <p className="text-sm text-warm-dim leading-relaxed max-w-md">
              Updates when migration triggers, new features ship, or the community grows.
              No spam. Unsubscribe anytime.
            </p>
          </div>
          <div className="flex items-end gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent border-b border-[#d4af37]/20 px-0 py-3 text-sm outline-none focus:border-[#d4af37]/60 transition-colors placeholder:text-warm-mute"
            />
            <button className="btn-gold px-6 py-3">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-6 font-bold">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", href: "#home" },
                { label: "Introduction", href: "#intro" },
                { label: "Live Stats", href: "#stats" },
                { label: "Trade", href: "#trade" },
                { label: "Docs", href: "#docs" },
                { label: "FAQ", href: "#faq" },
              ].map((item, i) => (
                <li key={i}>
                  <a href={item.href} className="text-warm-dim hover:text-[#d4af37] transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-6 font-bold">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={CONFIG.explorer} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-warm-dim hover:text-[#d4af37] transition-colors">
                  Polygonscan <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://github.com/Man-pnking/spv-token-system" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-warm-dim hover:text-[#d4af37] transition-colors">
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href={`${CONFIG.explorer}/token/${CONFIG.spvToken}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-warm-dim hover:text-[#d4af37] transition-colors">
                  Token Page <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-6 font-bold">
              Community
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-warm-dim hover:text-[#d4af37] transition-colors">
                  <Twitter className="w-4 h-4" /> Twitter
                </a>
              </li>
              <li>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-warm-dim hover:text-[#d4af37] transition-colors">
                  <MessageCircle className="w-4 h-4" /> Discord
                </a>
              </li>
              <li>
                <a href="https://github.com/Man-pnking/spv-token-system" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-warm-dim hover:text-[#d4af37] transition-colors">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] mb-6 font-bold">
              Contracts
            </h4>
            <ul className="space-y-3 text-xs font-mono">
              <li>
                <a href={`${CONFIG.explorer}/address/${CONFIG.spvToken}`} target="_blank" rel="noopener noreferrer" className="text-warm-dim hover:text-[#d4af37] transition-colors">
                  SPV · {shorten(CONFIG.spvToken)}
                </a>
              </li>
              <li>
                <a href={`${CONFIG.explorer}/address/${CONFIG.curve}`} target="_blank" rel="noopener noreferrer" className="text-warm-dim hover:text-[#d4af37] transition-colors">
                  Curve · {shorten(CONFIG.curve)}
                </a>
              </li>
              <li>
                <a href={`${CONFIG.explorer}/address/${CONFIG.router}`} target="_blank" rel="noopener noreferrer" className="text-warm-dim hover:text-[#d4af37] transition-colors">
                  Router · {shorten(CONFIG.router)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-full mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-warm-mute">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span>© {year} SPV Token System</span>
            <span className="hidden sm:inline">·</span>
            <span>Built on Polygon</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#docs" className="hover:text-[#d4af37] transition-colors">Terms</a>
            <a href="#docs" className="hover:text-[#d4af37] transition-colors">Privacy</a>
            <a href="#faq" className="hover:text-[#d4af37] transition-colors">Support</a>
          </div>
        </div>

        <div className="mt-8 text-[10px] leading-relaxed text-warm-mute/70 max-w-4xl">
          <strong className="text-warm-mute">Disclaimer:</strong> SPV is an experimental
          token deployed on Polygon Mainnet. Nothing on this site constitutes financial
          advice. Cryptocurrency involves risk of total loss. Only trade what you can
          afford to lose. Always verify contract addresses independently before transacting.
        </div>
      </div>
    </footer>
  );
}