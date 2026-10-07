export default function ProfileStatsRow({ stats }) {
  const items = [
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
    { label: "Posts", value: stats.tweets },
  ];

  return (
    <div className="grid grid-cols-3 w-full">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-start">
          <span className="text-xs text-warm-mute mb-1">{item.label}</span>
          <span className="text-base font-bold text-warm">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
