// components/LinkButton.tsx
"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary";

interface LinkButtonProps extends LinkProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  disabled?: boolean;
}

export default function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
  disabled = false,
  ...rest
}: LinkButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md px-2 py-2 text-sm font-medium transition-colors";
  const variants: Record<Variant, string> = {
    primary: "bg-yellow-400 text-black hover:bg-yellow-300",
    secondary: "bg-zinc-700 text-zinc-100 hover:bg-zinc-600",
  };

  const disabledStyles = "opacity-40 cursor-not-allowed";
  const classes =
    base +
    " " +
    variants[variant] +
    " " +
    (disabled ? disabledStyles : "") +
    " " +
    className;

  if (disabled) {
    return (
      <button type="button" className={classes} disabled>
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
