import Animated from "./Animated";
import Stagger from "./Stagger";
import SectionLabel from "./SectionLabel";

const STEPS = [
  { n: "01", title: "Buy with USDT", desc: "USDT enters the curve. SPV mints on demand. Price rises along a constant-product curve. No pre-mine, no team allocation, no insider advantage." },
  { n: "02", title: "Hold for rewards", desc: "Every holder starts at the same exit fee. Stay 30 days and it drops from 15% to 0.5% — a 30x reduction for conviction. A volume-scaled burn also removes supply on every sell, benefiting everyone who stays." },
  { n: "03", title: "Market-proven graduation", desc: "SPV migrates to QuickSwap when 2 of 3 signals confirm real demand: price 5x, 5M minted, or 500 unique holders. Not on a schedule — on proof." },
  { n: "04", title: "Permanent liquidity", desc: "Liquidity locks forever on graduation. LP tokens are burned. No rug is possible. The same router routes all future trades to the DEX, seamlessly." },
];

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-[clamp(6rem,10vw,7rem)]">
      <Stagger delay={0} stagger={120} className="mb-16">
        <Animated variant="up">
          <SectionLabel current={4} total={8} title="How it works" />
        </Animated>
        <Animated variant="up">
          <h2 className="display-lg mt-6">
            Four steps from launch to <span className="gradient-text">permanent liquidity</span>
          </h2>
        </Animated>
      </Stagger>

      <div>
        {STEPS.map((step, i) => (
          <Animated
            key={i}
            variant={i % 2 === 0 ? "left" : "right"}
            delay={i * 100}
            className="py-10 md:py-12 grid md:grid-cols-12 gap-6 items-start"
          >
            <div className="md:col-span-2">
              <div className="text-6xl md:text-7xl font-black gradient-text leading-none">
                {step.n}
              </div>
            </div>
            <div className="md:col-span-4">
              <h3 className="display-md text-warm">
                {step.title}
              </h3>
            </div>
            <div className="md:col-span-6">
              <p className="text-body">{step.desc}</p>
            </div>
            {i < STEPS.length - 1 && <div className="md:col-span-12 divider" />}
          </Animated>
        ))}
      </div>
    </div>
  );
}
