import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, subtitle, backHref, actions }: Props) {
  return (
    <div
      className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5"
      style={{ background: "rgba(5, 5, 16, 0.85)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Back"
            className="p-2 -ml-1 rounded-full hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-warm" />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-warm font-bold text-lg truncate">{title}</h1>
          {subtitle && (
            <div className="text-warm-mute text-xs font-mono truncate">
              {subtitle}
            </div>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
