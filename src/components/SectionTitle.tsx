interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-[30px] font-bold tracking-tight text-gray-900">{title}</h1>
      {subtitle && (
        <p className="mt-1.5 text-[15px] text-secondary">{subtitle}</p>
      )}
    </div>
  );
}
