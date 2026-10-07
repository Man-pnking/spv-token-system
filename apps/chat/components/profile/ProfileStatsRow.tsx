type Stats = {
  followers?: number;
  following?: number;
  tweets?: number;
};

type Props = {
  stats: Stats;
};

export function ProfileStatsRow({ stats }: Props) {
  const items = [
    { label: "Followers", value: stats.followers ?? 0 },
    { label: "Following", value: stats.following ?? 0 },
    { label: "Posts", value: stats.tweets ?? 0 },
  ];

  return (
    <div className="grid grid-cols-3 w-full gap-2">
      {items.map((item) => (
        <button
          key={item.label}
          className="flex flex-col items-start md:items-start gap-0.5 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors text-left"
          type="button"
        >
          <span className="text-base md:text-lg font-bold text-warm font-mono">
            {item.value}
          </span>
          <span className="text-[10px] md:text-xs text-warm-mute uppercase tracking-wider">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default ProfileStatsRow;
