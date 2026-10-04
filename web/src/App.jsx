import { useEffect } from "react";
import AnimatedBackground from "./components/AnimatedBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Intro from "./components/Intro";
import CurveStats from "./components/CurveStats";
import HowItWorks from "./components/HowItWorks";
import TradePanel from "./components/TradePanel";
import Docs from "./components/Docs";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import { useScrollReveal } from "./hooks/useScrollReveal";

export default function App() {
  useScrollReveal();

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <section id="home"><Hero /></section>
          <section id="intro"><Intro /></section>
          <section id="stats"><CurveStats /></section>
          <section id="how"><HowItWorks /></section>
          <section id="trade"><TradePanel /></section>
          <section id="docs"><Docs /></section>
          <section id="faq"><FAQ /></section>
        </main>
        <Footer />
      </div>
    </div>
  );
}