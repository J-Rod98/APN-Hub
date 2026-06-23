// Reusable button. Renders an <a> when `href` is provided, else a <button>.
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "gold";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 font-bold rounded-full transition " +
  "hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-bright/60 disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-gradient-to-br from-brand to-brand-deep shadow-glow hover:brightness-110",
  ghost:
    "text-ink border border-line bg-transparent hover:border-brand-bright hover:bg-brand/10",
  gold: "text-[#2a1c00] bg-gradient-to-br from-gold to-[#e8a93c]",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-[0.95rem] px-5 py-3",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps &
  ({ href: string } | ButtonHTMLAttributes<HTMLButtonElement>) & {
    href?: string;
  }) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
