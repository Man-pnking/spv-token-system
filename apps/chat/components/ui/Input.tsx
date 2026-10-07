"use client";

import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";

type Variant = "default" | "filled" | "outlined";

type BaseProps = {
  label?: string;
  helper?: string;
  error?: string | null;
  variant?: Variant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

const VARIANTS: Record<Variant, string> = {
  default:
    "bg-transparent border-0 border-b border-white/15 rounded-none px-0 py-2 " +
    "focus:border-[#00ffff]/60",
  filled:
    "bg-white/5 border border-white/10 rounded-input px-3.5 py-2.5 " +
    "focus:bg-white/[0.07] focus:border-[#00ffff]/40",
  outlined:
    "bg-transparent border border-white/15 rounded-input px-3.5 py-2.5 " +
    "focus:border-[#00ffff]/50",
};

const baseInput =
  "w-full text-sm text-warm outline-none transition-colors " +
  "placeholder:text-warm-mute disabled:opacity-50";

function Wrapper({
  label,
  helper,
  error,
  children,
  htmlFor,
}: BaseProps & { children: ReactNode; htmlFor?: string }) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-xs text-warm-dim block mb-1.5 font-medium"
        >
          {label}
        </label>
      )}
      {children}
      {(helper || error) && (
        <div
          className={
            "text-[11px] mt-1.5 " +
            (error ? "text-red-400" : "text-warm-mute")
          }
        >
          {error || helper}
        </div>
      )}
    </div>
  );
}

// ---------- Input ----------
type InputProps = InputHTMLAttributes<HTMLInputElement> & BaseProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helper,
    error,
    variant = "filled",
    leftIcon,
    rightIcon,
    className = "",
    id,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;

  if (leftIcon || rightIcon) {
    return (
      <Wrapper label={label} helper={helper} error={error} htmlFor={inputId}>
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-mute pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={
              baseInput +
              " " +
              VARIANTS[variant] +
              (leftIcon ? " pl-9" : "") +
              (rightIcon ? " pr-9" : "") +
              (error ? " border-red-500/60" : "") +
              " " +
              className
            }
            {...rest}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-mute">
              {rightIcon}
            </div>
          )}
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper label={label} helper={helper} error={error} htmlFor={inputId}>
      <input
        ref={ref}
        id={inputId}
        className={
          baseInput +
          " " +
          VARIANTS[variant] +
          (error ? " border-red-500/60" : "") +
          " " +
          className
        }
        {...rest}
      />
    </Wrapper>
  );
});

// ---------- Textarea ----------
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  BaseProps & { showCount?: number };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      helper,
      error,
      variant = "filled",
      className = "",
      id,
      showCount,
      value,
      ...rest
    },
    ref
  ) {
    const autoId = useId();
    const inputId = id || autoId;
    const len = typeof value === "string" ? value.length : 0;

    return (
      <Wrapper label={label} helper={helper} error={error} htmlFor={inputId}>
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          className={
            baseInput +
            " resize-none " +
            VARIANTS[variant] +
            (error ? " border-red-500/60" : "") +
            " " +
            className
          }
          {...rest}
        />
        {showCount !== undefined && (
          <div
            className={
              "text-[10px] font-mono mt-1 text-right " +
              (len > showCount ? "text-red-400" : "text-warm-mute")
            }
          >
            {len} / {showCount}
          </div>
        )}
      </Wrapper>
    );
  }
);

export default Input;
