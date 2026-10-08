import { useState } from "react";
import {
  Github, Twitter, MessageCircle, ExternalLink, Send, Shield, Check,
} from "lucide-react";
import { CONFIG } from "../config";
import { shorten } from "../utils/format";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    // Placeholder — hook up to your newsletter service later
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer id="footer" className="relative mt-16 safe-bottom">
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
          <form onSubmit={handleSubscribe} className="flex items-end gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              className="flex-1 bg-transparent border-b border-[#00ffff]/20 px-0 py-3 text-sm outline-none focus:border-[#00ffff]/60 transition-colors placeholder:text-warm-mute"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              disabled={subscribed}
              className="btn-gold px-6 py-3 disabled:opacity-60"
            >
              {subscribed ? (
                <Check className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#00ffff] mb-6 font-bold">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", href: "#home" },
                { label: "Introduction", href: "#intro" },
                { label: "What You're Buying", href: "#what" },
                { label: "Live Stats", href: "#stats" },
                { label: "Trade", href: "#trade" },
                { label: "Docs", href: "#docs" },
                { label: "FAQ", href: "#faq" },
                { label: "Team", href: "#team" },
                { label: "How to Verify", href: "#verify" },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-warm-dim hover:text-[#00ffff] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#00ffff] mb-6 font-bold">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={CONFIG.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-warm-dim hover:text-[#00ffff] transition-colors"
                >
                  Polygonscan <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Man-pnking/spv-token-system"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-warm-dim hover:text-[#00ffff] transition-colors"
                >
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={`${CONFIG.explorer}/token/${CONFIG.spvToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-warm-dim hover:text-[#00ffff] transition-colors"
                >
                  Token Page <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:contactus@spvtoken.io"
                  className="flex items-center gap-2 text-warm-dim hover:text-[#00ffff] transition-colors"
                >
                  contactus@spvtoken.io
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#00ffff] mb-6 font-bold">
              Community
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://x.com/specialpur6fu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-warm-dim hover:text-[#00ffff] transition-colors"
                >
                  <Twitter className="w-4 h-4" /> Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/yXfT4YKg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-warm-dim hover:text-[#00ffff] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Discord
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Man-pnking/spv-token-system"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-warm-dim hover:text-[#00ffff] transition-colors"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[#00ffff] mb-6 font-bold">
              Contracts
            </h4>
            <ul className="space-y-3 text-xs font-mono">
              <li>
                <a
                  href={`${CONFIG.explorer}/address/${CONFIG.spvToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-dim hover:text-[#00ffff] transition-colors"
                >
                  SPV · {shorten(CONFIG.spvToken)}
                </a>
              </li>
              <li>
                <a
                  href={`${CONFIG.explorer}/address/${CONFIG.curve}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-dim hover:text-[#00ffff] transition-colors"
                >
                  Curve · {shorten(CONFIG.curve)}
                </a>
              </li>
              <li>
                <a
                  href={`${CONFIG.explorer}/address/${CONFIG.router}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-dim hover:text-[#00ffff] transition-colors"
                >
                  Router · {shorten(CONFIG.router)}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="rounded-xl px-5 py-4 mb-8 flex items-start gap-3"
          style={{
            background: "rgba(0, 255, 255, 0.03)",
            border: "1px solid rgba(0, 255, 255, 0.08)",
          }}
        >
          <Shield className="w-4 h-4 text-[#00ffff] shrink-0 mt-0.5" />
          <div className="text-xs text-warm-dim leading-relaxed">
            <strong className="text-warm">Verify before you trade.</strong> All three SPV
            contracts are verified on Polygonscan. Follow the{" "}
            <a
              href="#verify"
              className="text-[#00ffff] hover:text-[#ff8c00] transition-colors"
            >
              verification guide
            </a>{" "}
            to independently confirm the deployed code matches the source.
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
            <a href="#docs" className="hover:text-[#00ffff] transition-colors">
              Terms
            </a>
            <a href="#docs" className="hover:text-[#00ffff] transition-colors">
              Privacy
            </a>
            <a href="#faq" className="hover:text-[#00ffff] transition-colors">
              Support
            </a>
          </div>
        </div>

        <div className="mt-8 text-[10px] leading-relaxed text-warm-mute/70 max-w-4xl">
          <strong className="text-warm-mute">Disclaimer:</strong> SPV is an experimental
          token deployed on Polygon Mainnet. Nothing on this site constitutes financial
          advice. Cryptocurrency involves risk of total loss. Only trade what you can
          afford to lose. Always verify contract addresses independently before
          transacting.
        </div>
      </div>
    </footer>
  );
}