export default function ChatsLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="h-6 w-24 rounded bg-white/5 animate-pulse" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-4 border-b border-white/5"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
            <div className="h-2 w-16 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
