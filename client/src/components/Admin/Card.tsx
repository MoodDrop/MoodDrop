interface CardProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Card({ title, subtitle, className = "", children }: CardProps) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white/70 shadow-sm p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-stone-800">{title}</h3>}
          {subtitle && <p className="text-sm text-stone-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
