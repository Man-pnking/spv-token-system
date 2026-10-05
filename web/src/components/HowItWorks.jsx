import Animated from "./Animated";
import Stagger from "./Stagger";
import SectionLabel from "./SectionLabel";

const STEPS = [
  { n: "01", title: "Buy with USDT", desc: "USDT enters the curve. SPV mints on demand. Price rises along a constant-product curve." },
  { n: "02", title: "Hold or trade", desc: "Sell fees drop from 15% to 0.5% as your hold time grows. A volume-scaled burn removes supply on every sell." },
  { n: "03", title: "Auto migration", desc: "When 2 of 3 triggers hit (price 5x, 5M minted, 500 holders), reserves move to QuickSwap automatically." },
  { n: "04", title: "Trade on DEX", desc: "Liquidity locked forever. LP tokens burned. The same router routes all future trades to the DEX." },
];

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Stagger delay={0} stagger={120} className="mb-16">
        <Animated variant="up">
          <SectionLabel current={9} total={9} title="How it works" />
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