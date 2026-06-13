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
    md: "px-4 py-2 text-[14px]",
  };
  const variants = {
    primary: "bg-[#0A84FF] text-white hover:bg-[#0071E3]",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  };
  return (
    <button
      className={`rounded-lg font-medium transition-all duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
