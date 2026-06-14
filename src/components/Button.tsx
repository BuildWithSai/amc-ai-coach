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
    md: "min-h-[44px] px-4 py-2 text-[14px] md:min-h-0",
  };
  const variants = {
    primary:
      "bg-accent text-white hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent/40",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-black/20",
  };
  return (
    <button
      className={`rounded-lg font-medium outline-none transition-all duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
