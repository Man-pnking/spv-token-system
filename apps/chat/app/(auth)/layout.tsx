import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex items-center justify-center px-6 py-12 relative">
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00ffff] to-[#00a8a8] text-[#050510] font-black text-sm mb-5 shadow-[0_8px_32px_rgba(0,255,255,0.35)] hover:scale-105 transition-transform"
          >
            SPV
          </Link>
          <div className="text-label mb-1">SPV Chat</div>
          <h1 className="display-lg gradient-text">Welcome</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
