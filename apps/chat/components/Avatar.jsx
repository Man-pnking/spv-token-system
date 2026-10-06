export default function Avatar({ url, username, size = 40 }) {
  const initials = (username || "?").slice(0, 2).toUpperCase();

  if (url) {
    return (
      <img
        src={url}
        alt={username || "avatar"}
        width={size}
        height={size}
        className="rounded-full object-cover border border-[#00ffff]/20"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-[#050510] bg-gradient-to-br from-[#00ffff] to-[#00a8a8]"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}
