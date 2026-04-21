import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  children: ReactNode;
  className?: string;
}

type ButtonVariant = NonNullable<ButtonProps["variant"]>;

export function Button({
  variant = "primary",
  children,
  className = "",
  style,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:brightness-110",
    outline:
      "border border-border text-muted-foreground hover:border-accent hover:text-accent-light",
  };

  const variantStyles: Record<ButtonVariant, CSSProperties> = {
    primary: {
      backgroundImage: "linear-gradient(90deg, var(--accent), var(--accent-hot))",
    },
    outline: {},
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
