import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  overflow?: boolean;
  interactive?: boolean;
}

export function Card({
  children,
  className = "",
  padding = false,
  overflow = false,
  interactive = false,
}: CardProps) {
  return (
    <div
      className={`rounded-xl bg-surface ${padding ? "p-6" : ""} ${overflow ? "overflow-hidden" : ""} ${interactive ? "card-interactive" : ""} ${className}`}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {children}
    </div>
  );
}
