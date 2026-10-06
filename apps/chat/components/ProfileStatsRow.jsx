export default function ProfileStatsRow({ stats }) {
  return (
    <div className="flex items-center gap-5 text-sm">
      <div>
        <span className="text-warm font-bold">{stats.tweets}</span>{" "}
        <span className="text-warm-mute">Posts</span>
      </div>
      <div>
        <span className="text-warm font-bold">{stats.following}</span>{" "}
        <span className="text-warm-mute">Following</span>
      </div>
      <div>
        <span className="text-warm font-bold">{stats.followers}</span>{" "}
        <span className="text-warm-mute">Followers</span>
      </div>
    </div>
  );
}
