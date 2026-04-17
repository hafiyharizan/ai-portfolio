interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-card-hover px-3 py-1 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground ${className}`}
    >
      {children}
    </span>
  );
}
