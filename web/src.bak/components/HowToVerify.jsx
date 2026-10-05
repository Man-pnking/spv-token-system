import Animated from "./Animated";
import SectionWatermark from "./SectionWatermark";
import { ExternalLink, CheckCircle2, Shield } from "lucide-react";
import { CONFIG } from "../config";
import { shorten } from "../utils/format";

const STEPS = [
  {
    n: "01",
    title: "Open the SPV token on Polygonscan",
    desc: "Click the SPV Token link below. This opens the exact contract address that the frontend uses when you trade.",
    action: { label: "View SPV Token on Polygonscan", href: `${CONFIG.explorer}/token/${CONFIG.spvToken}` },
  },
  {
    n: "02",
    title: "Look for the green verification checkmark",
    desc: "On the contract page, next to the word \"Contract,\" you will see a green checkmark. This means Polygonscan has independently confirmed that the bytecode deployed to the chain matches the Solidity source code.",
  },
  {
    n: "03",
    title: "Read the source code",
    desc: "Click the \"Contract\" tab, then \"Read Contract\" or \"Code\" to see the exact Solidity that governs your tokens. You can scroll through every function. There is no hidden logic — this is the same code that runs when you buy or sell.",
  },
  {
    n: "04",
    title: "Check the bonding curve has no backdoor",
    desc: "Open the Bonding Curve on Polygonscan. Look at the Write Contract tab. Every function listed is either a public trade function (buy, sell) or an owner-only admin function with a clear purpose (pause, unpause, forceMigrate, setCreator). None of them allow the owner to withdraw user funds.",
    action: { label: "View Bonding Curve on Polygonscan", href: `${CONFIG.explorer}/address/${CONFIG.curve}#writeContract` },
  },
  {
    n: "05",
    title: "Confirm LP tokens are burned on migration",
    desc: "In the curve's source code, search for the constant DEAD. It points to 0x000000000000000000000000000000000000dEaD. When migration runs, the LP tokens are sent to that address. Nothing can retrieve them. Liquidity becomes permanent.",
  },
  {
    n: "06",
    title: "Verify the router matches the frontend",
    desc: "Open the Router on Polygonscan. Compare the address at the top of the page with the address shown in the footer of this site. If they match, the router you are trading through is the one being verified here.",
    action: { label: "View Router on Polygonscan", href: `${CONFIG.explorer}/address/${CONFIG.router}` },
  },
];

export default function HowToVerify() {
  return (
    <div className="relative max-w-4xl mx-auto px-6 py-16 overflow-hidden">
      <SectionWatermark position="left" size={480} opacity={0.03} rotate={-8} />

      <Animated variant="up" className="mb-16">
        <div className="text-label mb-4">How to verify</div>
        <h2 className="display-lg">
          Do not <span className="gradient-text">trust</span> us. Verify.
        </h2>
        <p className="text-body max-w-3xl mt-8">
          Every claim on this site can be checked on Polygonscan. Below are the six
          steps anyone can take to confirm that the SPV contracts do exactly what
          this site says they do. If you find a discrepancy, do not buy.
        </p>
      </Animated>

      <div className="divider mb-16" />

      <div className="space-y-12 mb-20">
        {STEPS.map((step, i) => (
          <Animated key={i} variant="up" delay={i * 60}>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-2 md:col-span-1">
                <div className="text-4xl md:text-5xl font-black gradient-text leading-none">
                  {step.n}
                </div>
              </div>
              <div className="col-span-10 md:col-span-11">
                <h3 className="text-lg md:text-xl font-bold text-warm mb-3">
                  {step.title}
                </h3>
                <p className="text-body text-sm mb-4">
                  {step.desc}
                </p>
                {step.action && (
                  <a
                    href={step.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium text-[#d4af37] hover:text-[#f4c430] transition-colors"
                  >
                    {step.action.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </Animated>
        ))}
      </div>

      <Animated variant="up" className="pt-8">
        <div className="divider mb-10" />
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(212, 175, 55, 0.08)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
            }}
          >
            <Shield className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="display-md text-warm mb-3">
              What you should be able to confirm
            </h3>
            <ul className="space-y-3 text-sm text-warm-dim leading-relaxed">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>All three contracts (token, curve, router) show a green verification checkmark on Polygonscan.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>The curve holds user USDT in the contract itself, not in the creator's wallet.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>There is no function that lets the owner withdraw user funds.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>On migration, LP tokens are sent to 0x...dEaD and cannot be retrieved.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>The router address on Polygonscan matches the one shown in this site's footer.</span>
              </li>
            </ul>
          </div>
        </div>
      </Animated>

      <Animated variant="up" className="pt-12">
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href={`${CONFIG.explorer}/token/${CONFIG.spvToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-4 px-5 rounded-xl transition-colors hover:bg-white/[0.02]"
            style={{ border: "1px solid rgba(212, 175, 55, 0.1)" }}
          >
            <div className="text-label mb-1">SPV Token</div>
            <div className="text-mono text-xs text-warm-dim flex items-center gap-2">
              {shorten(CONFIG.spvToken)} <ExternalLink className="w-3 h-3" />
            </div>
          </a>
          <a
            href={`${CONFIG.explorer}/address/${CONFIG.curve}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-4 px-5 rounded-xl transition-colors hover:bg-white/[0.02]"
            style={{ border: "1px solid rgba(212, 175, 55, 0.1)" }}
          >
            <div className="text-label mb-1">Bonding Curve</div>
            <div className="text-mono text-xs text-warm-dim flex items-center gap-2">
              {shorten(CONFIG.curve)} <ExternalLink className="w-3 h-3" />
            </div>
          </a>
          <a
            href={`${CONFIG.explorer}/address/${CONFIG.router}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block py-4 px-5 rounded-xl transition-colors hover:bg-white/[0.02]"
            style={{ border: "1px solid rgba(212, 175, 55, 0.1)" }}
          >
            <div className="text-label mb-1">Router</div>
            <div className="text-mono text-xs text-warm-dim flex items-center gap-2">
              {shorten(CONFIG.router)} <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        </div>
      </Animated>
    </div>
  );
}