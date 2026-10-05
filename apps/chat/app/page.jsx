export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        <div className="text-label mb-4">Design System Check</div>
        <h1 className="display-lg gradient-text mb-6">
          SPV Chat
        </h1>
        <p className="text-body mb-8">
          This page confirms the design system is inherited from the parent SPV site.
          Same colors, same fonts, same glassmorphism. If you see cyan text on a dark
          background with the Space Grotesk headline, everything is wired correctly.
        </p>

        <div className="glass p-6 mb-6">
          <div className="text-label mb-2">Glass Panel</div>
          <p className="text-warm-dim text-sm">
            This is a glass-styled container using the parent's .glass utility.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="btn-gold">Primary Action</button>
          <button className="btn-ghost">Secondary</button>
        </div>

        <div className="mt-8 text-mono text-sm text-warm-dim">
          0.010003 USDT · JetBrains Mono
        </div>
      </div>
    </div>
  );
}
