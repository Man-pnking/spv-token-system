export default function FeedLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="h-6 w-20 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="px-4 py-4 border-b border-[#00ffff]/10">
        <div className="flex gap-3">
          <div className="w-11 h-11 rounded-full bg-white/5 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2 py-2">
            <div className="h-3 w-3/4 rounded bg-white/5 animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-4 py-4 border-b border-[#00ffff]/10">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-full bg-white/5 animate-pulse shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
              <div className="h-3 w-full rounded bg-white/5 animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
