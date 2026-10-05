import { useEffect, useState } from "react";
import AnimatedBackground from "./components/AnimatedBackground";
import CursorGlow from "./components/CursorGlow";
import ScrollProgress from "./components/ScrollProgress";
import BackgroundAudio from "./components/BackgroundAudio";
import Navbar from "./components/Navbar";
import QuickNav from "./components/QuickNav";
import CommandPalette from "./components/CommandPalette";
import Hero from "./components/Hero";
import StatsStrip from "./components/StatsStrip";
import Intro from "./components/Intro";
import WhatYoureBuying from "./components/WhatYoureBuying";
import CurveStats from "./components/CurveStats";
import HowItWorks from "./components/HowItWorks";
import TradePanel from "./components/TradePanel";
import Docs from "./components/Docs";
import FAQ from "./components/FAQ";
import HowToVerify from "./components/HowToVerify";
import Footer from "./components/Footer";

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollProgress />
      <AnimatedBackground />
      <CursorGlow />
      <BackgroundAudio />

      <div className="relative z-10 min-h-screen w-full">
        <Navbar />

        <main id="main-content" className="w-full" aria-label="Main content">
          <section id="home" aria-label="Hero">
            <Hero />
          </section>

          <section id="stripped" aria-label="Key stats">
            <StatsStrip />
          </section>

          <section id="intro" aria-label="Introduction">
            <Intro />
          </section>

          <section id="what" aria-label="What you are buying">
            <WhatYoureBuying />
          </section>

          <section id="stats" aria-label="Live curve stats">
            <CurveStats />
          </section>

          <section id="how" aria-label="How it works">
            <HowItWorks />
          </section>

          <section id="trade" aria-label="Trade SPV">
            <TradePanel />
          </section>

          <section id="docs" aria-label="Documentation">
            <Docs />
          </section>

          <section id="faq" aria-label="Frequently asked questions">
            <FAQ />
          </section>

          <section id="verify" aria-label="How to verify the contracts">
            <HowToVerify />
          </section>
        </main>

        <Footer />
      </div>

      <QuickNav />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}