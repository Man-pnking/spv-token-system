"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-[#00ffff] to-[#00a8a8] text-[#050510] font-semibold " +
    "shadow-[0_4px_20px_rgba(0,255,255,0.25)] " +
    "hover:shadow-[0_6px_28px_rgba(0,255,255,0.45)] hover:-translate-y-px " +
    "active:translate-y-0 active:scale-[0.98] " +
    "disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0",
  outline:
    "border border-white/15 text-warm bg-transparent " +
    "hover:bg-white/5 hover:border-white/25 " +
    "active:scale-[0.98] " +
    "disabled:opacity-40",
  ghost:
    "text-warm-dim hover:text-warm hover:bg-white/5 " +
    "active:scale-[0.98] " +
    "disabled:opacity-40",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/20 " +
    "hover:bg-red-500/20 hover:border-red-500/40 " +
    "active:scale-[0.98] " +
    "disabled:opacity-40",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-full gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-full gap-2",
  lg: "px-6 py-3 text-base rounded-full gap-2",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = "",
    children,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={
        "inline-flex items-center justify-center whitespace-nowrap " +
        "transition-all duration-200 " +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffff]/60 " +
        VARIANTS[variant] +
        " " +
        SIZES[size] +
        (fullWidth ? " w-full" : "") +
        " " +
        className
      }
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

export default Button;
