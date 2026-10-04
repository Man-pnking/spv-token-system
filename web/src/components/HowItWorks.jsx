import Animated from "./Animated";

const STEPS = [
  { n: "01", title: "Buy with USDT", desc: "USDT enters the curve. SPV mints on demand. Price rises along a constant-product curve." },
  { n: "02", title: "Hold or trade", desc: "Sell fees drop from 15% to 0.5% as your hold time grows. A volume-scaled burn removes supply on every sell." },
  { n: "03", title: "Auto migration", desc: "When 2 of 3 triggers hit (price 5x, 5M minted, 500 holders), reserves move to QuickSwap automatically." },
  { n: "04", title: "Trade on DEX", desc: "Liquidity locked forever. LP tokens burned. The same router routes all future trades to the DEX." },
];

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Animated variant="up" className="mb-16">
        <div className="text-xs uppercase tracking-[0.3em] text-warm-mute mb-4">
          How it works
        </div>
        <h2 className="text-4xl sm:text-6xl font-black leading-tight">
          Four steps from launch to <span className="gradient-text">permanent liquidity</span>
        </h2>
      </Animated>

      <div>
        {STEPS.map((step, i) => (
          <div key={i} className="py-10 md:py-12 grid md:grid-cols-12 gap-6 items-start">
            <Animated variant="left" delay={i * 60} className="md:col-span-2">
              <div className="text-6xl md:text-7xl font-black gradient-text leading-none">
                {step.n}
              </div>
            </Animated>
            <Animated variant="up" delay={i * 60 + 100} className="md:col-span-4">
              <h3 className="text-2xl md:text-3xl font-bold text-warm">
                {step.title}
              </h3>
            </Animated>
            <Animated variant="up" delay={i * 60 + 200} className="md:col-span-6">
              <p className="text-warm-dim leading-relaxed">{step.desc}</p>
            </Animated>
            {i < STEPS.length - 1 && <div className="md:col-span-12 divider" />}
          </div>
        ))}
      </div>
    </div>
  );
}