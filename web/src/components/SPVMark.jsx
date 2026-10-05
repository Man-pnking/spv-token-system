export default function SPVMark({ size = 36, className = "" }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="spvGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff8c00" />
          <stop offset="50%" stopColor="#00ffff" />
          <stop offset="100%" stopColor="#00a8a8" />
        </linearGradient>
      </defs>

      {/* Outer ring */}
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        stroke="url(#spvGold)"
        strokeWidth="1.2"
        opacity="0.9"
      />

      {/* Top arc — S */}
      <path
        d="M 13 13 Q 20 9 27 13 Q 27 17 20 20"
        fill="none"
        stroke="url(#spvGold)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* Middle — P */}
      <path
        d="M 13 20 L 13 30 M 13 20 Q 22 20 22 24 Q 22 28 13 28"
        fill="none"
        stroke="url(#spvGold)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom — V */}
      <path
        d="M 24 21 L 27 30 L 30 21"
        fill="none"
        stroke="url(#spvGold)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}