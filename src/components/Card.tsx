import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  overflow?: boolean;
}

export function Card({ children, className = "", padding = false, overflow = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-black/10 bg-white ${padding ? "p-6" : ""} ${overflow ? "overflow-hidden" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
