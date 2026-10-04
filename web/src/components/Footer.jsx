import { Github, Twitter, MessageCircle, ExternalLink } from "lucide-react";
import { CONFIG } from "../config";
import { shorten } from "../utils/format";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-white/5 safe-bottom">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl glow-btn flex items-center justify-center font-black text-xs">SPV</div>
              <span className="font-bold">SPV</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Mint-on-demand token with dynamic bonding curve and automatic DEX migration on Polygon.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/40 mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="text-white/60 hover:text-white">Home</a></li>
              <li><a href="#stats" className="text-white/60 hover:text-white">Stats</a></li>
              <li><a href="#trade" className="text-white/60 hover:text-white">Trade</a></li>
              <li><a href="#docs" className="text-white/60 hover:text-white">Docs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/40 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={CONFIG.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white flex items-center gap-1"
                >
                  Polygonscan <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white flex items-center gap-1"
                >
                  GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li><a href="#faq" className="text-white/60 hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider text-white/40 mb-4">Community</h4>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/10"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/10"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/10"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <div>© {year} SPV Token System. All rights reserved.</div>
          <div className="flex gap-4 font-mono">
            <span>SPV: {shorten(CONFIG.spvToken)}</span>
            <span>Curve: {shorten(CONFIG.curve)}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}