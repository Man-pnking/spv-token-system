import type { ReactNode } from "react";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  compact = false,
}: Props) {
  return (
    <div
      className={
        "text-center animate-fade-up " +
        (compact ? "px-6 py-10" : "px-6 py-20")
      }
    >
      <div
        className={
          "mx-auto mb-5 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#ff8c00]/10 " +
          "border border-[#00ffff]/20 flex items-center justify-center " +
          (compact ? "w-14 h-14" : "w-16 h-16")
        }
      >
        {icon ?? <span className={compact ? "text-xl" : "text-2xl"}>✨</span>}
      </div>
      <div
        className={
          "text-warm font-semibold " + (compact ? "text-sm" : "text-base")
        }
      >
        {title}
      </div>
      {description && (
        <div
          className={
            "text-warm-dim mt-1 " + (compact ? "text-xs" : "text-sm")
          }
        >
          {description}
        </div>
      )}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export default EmptyState;
