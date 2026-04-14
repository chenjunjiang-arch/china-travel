import Link from "next/link";
import { clsx } from "clsx";

interface InkButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
}

const variantStyles = {
  primary:
    "bg-cinnabar text-white hover:bg-cinnabar/85 shadow-md hover:shadow-lg",
  secondary:
    "border-2 border-cinnabar text-cinnabar hover:bg-cinnabar/10",
  ghost:
    "text-ink hover:bg-ink/5",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3 text-lg",
};

export default function InkButton({
  variant = "primary",
  size = "md",
  children,
  className,
  disabled,
  onClick,
  href,
}: InkButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 cursor-pointer",
    variantStyles[variant],
    sizeStyles[size],
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    className
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
