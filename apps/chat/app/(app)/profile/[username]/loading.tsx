export default function ProfileLoading() {
  return (
    <div className="md:max-w-3xl md:mx-auto">
      <div className="relative h-40 md:h-52 bg-gradient-to-br from-[#00ffff]/20 to-[#ff8c00]/10 animate-pulse" />
      <div className="px-5 pt-14 pb-4">
        <div className="h-6 w-32 rounded bg-white/5 animate-pulse mb-2" />
        <div className="h-4 w-24 rounded bg-white/5 animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-4 px-5 pb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-12 rounded bg-white/5 animate-pulse" />
            <div className="h-5 w-8 rounded bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
