import Animated from "./Animated";
import Stagger from "./Stagger";
import SectionLabel from "./SectionLabel";
import SectionWatermark from "./SectionWatermark";
import { AtSign, Github, MessageCircle, Mail, ExternalLink } from "lucide-react";

const LINKS = [
  { icon: AtSign,        label: "@specialpur6fu", href: "https://x.com/specialpur6fu" },
  { icon: Github,        label: "GitHub", href: "https://github.com/Man-pnking/spv-token-system" },
  { icon: MessageCircle, label: "Discord", href: "https://discord.gg/yXfT4YKg" },
  { icon: Mail,          label: "contactus@spvtoken.io", href: "mailto:contactus@spvtoken.io" },
];

export default function Team() {
  return (
    <div className="relative max-w-4xl mx-auto px-6 py-16 overflow-hidden">
      <SectionWatermark position="right" size={520} opacity={0.03} rotate={6} />
      <Stagger delay={0} stagger={110} className="mb-16">
        <Animated variant="up">
          <SectionLabel current={7} total={8} title="Built by one" />
        </Animated>
        <Animated variant="up">
          <h2 className="display-lg mt-6">
            Built by one. <span className="gradient-text">Verified by everyone.</span>
          </h2>
        </Animated>
        <Animated variant="up">
          <p className="text-body max-w-3xl mt-8">
            No team wallet. No insider allocation. No anonymous entity with special access.
          </p>
        </Animated>
      </Stagger>

      <div className="divider mb-16" />

      <Animated variant="up" className="mb-12">
        <p className="text-body max-w-3xl">
          SPV was designed, written, and deployed by a single developer who prefers to
          let the code speak. There is no company behind it, no venture capital, and no
          marketing budget. Every function in the three contracts was written by hand
          and published on-chain for anyone to inspect.
        </p>
        <p className="text-body max-w-3xl mt-6">
          Trust in SPV does not depend on knowing who built it — it depends on being
          able to read exactly what was built. Every contract is verified on Polygonscan.
          Every claim on this site can be checked against the chain.
        </p>
      </Animated>

      <Animated variant="up" className="mb-12">
        <div className="text-label mb-6">Reach the project</div>
        <div className="flex flex-wrap gap-3">
          {LINKS.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm text-warm-dim hover:text-[#00ffff] border border-[#00ffff]/15 hover:border-[#00ffff]/40 transition-colors"
            >
              <link.icon className="w-3.5 h-3.5 text-[#00ffff]" />
              {link.label}
              {!link.href.startsWith("mailto:") && (
                <ExternalLink className="w-3 h-3 opacity-50" />
              )}
            </a>
          ))}
        </div>
      </Animated>

      <Animated variant="up">
        <div className="divider mb-10" />
        <p className="text-xs text-warm-mute leading-relaxed max-w-3xl italic">
          A note on pseudonymity: this project is published without a legal identity
          attached to the frontend. This is common in on-chain-first projects — the
          contract is the trust layer, not the person. If you need a team to trust
          before you buy, SPV is not for you. If you are comfortable verifying code
          instead, everything is here.
        </p>
      </Animated>
    </div>
  );
}
