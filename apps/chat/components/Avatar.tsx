type Size = number | { base: number; md?: number; lg?: number };

type Props = {
  url?: string | null;
  username?: string | null;
  size?: Size;
  className?: string;
};

/**
 * Avatar — supports fixed numeric size OR responsive object.
 * Examples:
 *   <Avatar url={u} size={40} />                     // fixed
 *   <Avatar url={u} size={{ base: 80, md: 112 }} />  // responsive
 *
 * Implementation: renders a wrapper with CSS custom properties,
 * and uses `style` for width/height so the value can be responsive
 * via Tailwind's arbitrary values is not needed — we compute a
 * media-query-friendly inline style with CSS vars.
 */
export default function Avatar({
  url,
  username,
  size = 40,
  className = "",
}: Props) {
  const initials = (username || "?").slice(0, 2).toUpperCase();

  const isResponsive = typeof size === "object";
  const baseSize = isResponsive ? size.base : size;
  const mdSize = isResponsive ? size.md ?? size.base : size;
  const lgSize = isResponsive ? size.lg ?? mdSize : size;

  const fontSize = baseSize * 0.4;

  // Responsive via CSS var + tailwind arbitrary — but we need
  // dynamic numbers, so use a style tag trick with data attributes.
  if (isResponsive) {
    const css = `
      .avatar-r-${baseSize}-${mdSize}-${lgSize} {
        width: ${baseSize}px; height: ${baseSize}px;
      }
      .avatar-r-${baseSize}-${mdSize}-${lgSize} .avatar-initials {
        font-size: ${fontSize}px;
      }
      @media (min-width: 768px) {
        .avatar-r-${baseSize}-${mdSize}-${lgSize} {
          width: ${mdSize}px; height: ${mdSize}px;
        }
        .avatar-r-${baseSize}-${mdSize}-${lgSize} .avatar-initials {
          font-size: ${mdSize * 0.4}px;
        }
      }
      @media (min-width: 1024px) {
        .avatar-r-${baseSize}-${mdSize}-${lgSize} {
          width: ${lgSize}px; height: ${lgSize}px;
        }
        .avatar-r-${baseSize}-${mdSize}-${lgSize} .avatar-initials {
          font-size: ${lgSize * 0.4}px;
        }
      }
    `;
    const cls = `avatar-r-${baseSize}-${mdSize}-${lgSize}`;

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        {url ? (
          <img
            src={url}
            alt={username || "avatar"}
            className={`rounded-full object-cover border border-[#00ffff]/20 ${cls} ${className}`}
          />
        ) : (
          <div
            className={`rounded-full flex items-center justify-center font-bold text-[#050510] bg-gradient-to-br from-[#00ffff] to-[#00a8a8] ${cls} ${className}`}
          >
            <span className="avatar-initials">{initials}</span>
          </div>
        )}
      </>
    );
  }

  // Fixed size — original behavior
  if (url) {
    return (
      <img
        src={url}
        alt={username || "avatar"}
        width={baseSize}
        height={baseSize}
        className={`rounded-full object-cover border border-[#00ffff]/20 ${className}`}
        style={{ width: baseSize, height: baseSize }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-[#050510] bg-gradient-to-br from-[#00ffff] to-[#00a8a8] ${className}`}
      style={{ width: baseSize, height: baseSize, fontSize }}
    >
      {initials}
    </div>
  );
}
