import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const sizes = {
    sm: "px-3 py-1.5 text-[13px]",
    md: "px-4 py-[9px] text-[14px]",
  };
  const variants = {
    primary:
      "bg-accent text-white shadow-sm hover:bg-accent-hover",
    secondary:
      "bg-surface-alt text-secondary hover:bg-surface-hover hover:text-primary",
  };
  return (
    <button
      className={`rounded-[10px] font-medium transition-all duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
