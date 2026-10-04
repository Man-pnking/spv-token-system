import {
  Github, Twitter, MessageCircle, ExternalLink, Send,
  Shield, FileText, Wallet, BarChart3, BookOpen, AlertCircle,
} from "lucide-react";
import { CONFIG } from "../config";
import { shorten } from "../utils/format";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 border-t border-[#d4af37]/10 safe-bottom">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top section — newsletter + brand */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl glow-btn flex items-center justify-center font-black text-sm">
                SPV
              </div>
              <div>
                <div className="font-black text-lg text-warm">Special Purpose Vehicle</div>
                <div className="text-[10px] uppercase tracking-wider text-warm-mute">
                  Mint-on-demand token · Polygon
                </div>
              </div>
            </div>
            <p className="text-sm text-warm-dim leading-relaxed max-w-xl">
              SPV is a transparent, rule-based token with no pre-mine, no team
              allocation, and permanent liquidity on migration. Every token in
              circulation was bought from the curve by a real user.
            </p>
          </div>

          <div className="glass-strong rounded-2xl p-6">
            <div className="text-xs uppercase tracking-wider text-warm-mute mb-3">
              Stay informed
            </div>
            <p className="text-sm text-warm-dim mb-4">
              Get updates when migration triggers, new features ship, or the
              community grows.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-[#d4af37]/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#d4af37]/40 transition-colors placeholder:text-warm-mute"
              />
              <button className="glow-btn rounded-xl px-4">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle section — 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Column 1 — Product */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#d4af37] mb-5 font-bold">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", href: "#home", icon: null },
                { label: "Live Stats", href: "#stats", icon: BarChart3 },
                { label: "Trade SPV", href: "#trade", icon: Wallet },
                { label: "Documentation", href: "#docs", icon: BookOpen },
                { label: "FAQ", href: "#faq", icon: null },
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href={item.href}
                    className="flex items-center gap-2 text-warm-dim hover:text-[#d4af37] transition-colors"
                  >
                    {item.icon && <item.icon className="w-3.5 h-3.5" />}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Resources */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#d4af37] mb-5 font-bold">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={CONFIG.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-warm-dim hover:text-[#d4af37] transition-colors"
                >
                  Polygonscan <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Man-pnking/spv-token-system"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-warm-dim hover:text-[#d4af37] transition-colors"
                >
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={`${CONFIG.explorer}/token/${CONFIG.spvToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-warm-dim hover:text-[#d4af37] transition-colors"
                >
                  Token Page <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="flex items-center gap-2 text-warm-dim hover:text-[#d4af37] transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" /> Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 — Community */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#d4af37] mb-5 font-bold">
              Community
            </h4>
            <div className="space-y-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-warm-dim hover:text-[#d4af37] transition-colors text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-[#d4af37]/15 flex items-center justify-center">
                  <Twitter className="w-3.5 h-3.5" />
                </div>
                Twitter / X
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-warm-dim hover:text-[#d4af37] transition-colors text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-[#d4af37]/15 flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                Discord
              </a>
              <a
                href="https://github.com/Man-pnking/spv-token-system"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-warm-dim hover:text-[#d4af37] transition-colors text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-[#d4af37]/15 flex items-center justify-center">
                  <Github className="w-3.5 h-3.5" />
                </div>
                GitHub
              </a>
            </div>
          </div>

          {/* Column 4 — Trust */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#d4af37] mb-5 font-bold">
              Trust
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-warm-dim">
                <Shield className="w-3.5 h-3.5 text-emerald-400/70 mt-0.5 flex-shrink-0" />
                <span>Verified Contracts</span>
              </li>
              <li className="flex items-start gap-2 text-warm-dim">
                <Shield className="w-3.5 h-3.5 text-emerald-400/70 mt-0.5 flex-shrink-0" />
                <span>No Pre-mine</span>
              </li>
              <li className="flex items-start gap-2 text-warm-dim">
                <Shield className="w-3.5 h-3.5 text-emerald-400/70 mt-0.5 flex-shrink-0" />
                <span>LP Burn on Migration</span>
              </li>
              <li className="flex items-start gap-2 text-warm-dim">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400/70 mt-0.5 flex-shrink-0" />
                <span>Unaudited</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contract addresses strip */}
        <div className="divider-gold mb-8" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {[
            { label: "SPV Token", addr: CONFIG.spvToken },
            { label: "Bonding Curve", addr: CONFIG.curve },
            { label: "Router", addr: CONFIG.router },
            { label: "USDT", addr: CONFIG.usdt },
          ].map((item, i) => (
            <a
              key={i}
              href={`${CONFIG.explorer}/address/${item.addr}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-3 hover:border-[#d4af37]/30 transition-colors"
            >
              <div className="text-[10px] uppercase tracking-wider text-warm-mute mb-1">
                {item.label}
              </div>
              <div className="font-mono text-xs text-warm-dim flex items-center gap-2">
                {shorten(item.addr)} <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-[#d4af37]/10 text-xs text-warm-mute">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span>© {year} SPV Token System</span>
            <span className="hidden sm:inline">·</span>
            <span>Built on Polygon</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#docs" className="hover:text-[#d4af37] transition-colors">
              Terms
            </a>
            <a href="#docs" className="hover:text-[#d4af37] transition-colors">
              Privacy
            </a>
            <a href="#faq" className="hover:text-[#d4af37] transition-colors">
              Support
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-[10px] leading-relaxed text-warm-mute/70 max-w-4xl">
          <strong className="text-warm-mute">Disclaimer:</strong> SPV is an
          experimental token deployed on Polygon Mainnet. Nothing on this site
          constitutes financial advice. Cryptocurrency involves risk of total
          loss. Only trade what you can afford to lose. Always verify contract
          addresses independently before transacting.
        </div>
      </div>
    </footer>
  );
}