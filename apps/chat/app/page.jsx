export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="text-label mb-4">SPV Chat</div>
        <h1 className="display-lg gradient-text mb-8">Welcome</h1>

        <div className="glass p-6">
          <div className="text-warm font-mono text-sm mb-2">Coming next</div>
          <ul className="text-warm-dim text-sm space-y-2">
            <li>· Sign in with wallet (identity only)</li>
            <li>· Public feed</li>
            <li>· Direct messages</li>
            <li>· SPV tips</li>
          </ul>
        </div>
      </div>
    </div>
  );
}