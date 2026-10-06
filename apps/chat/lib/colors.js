export function gradientForUsername(username) {
  if (!username) return "linear-gradient(135deg, #00ffff 0%, #00a8a8 100%)";

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 45) % 360;
  const h3 = (h1 + 90) % 360;

  return "linear-gradient(135deg, hsl(" + h1 + ", 65%, 55%) 0%, hsl(" + h2 + ", 65%, 45%) 50%, hsl(" + h3 + ", 60%, 40%) 100%)";
}
