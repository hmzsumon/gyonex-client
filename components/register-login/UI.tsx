"use client";

// ── Minimal UI primitives with forwardRef (required for RHF)
import React from "react";

export const Field: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-neutral-200">{label}</label>
    {children}
    {error ? <p className="text-sm text-red-500">{error}</p> : null}
  </div>
);

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={`h-11 w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 text-neutral-100 outline-none ring-0 transition placeholder:text-neutral-400 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 ${className}`}
  />
));
Input.displayName = "Input";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className = "", ...props }, ref) => (
  <select
    ref={ref}
    {...props}
    className={`h-11 w-full appearance-none rounded-lg border border-neutral-800 bg-neutral-900 px-3 pr-10 text-left text-neutral-100 outline-none transition focus:border-neutral-700 focus:ring-2 focus:ring-neutral-700 ${className}`}
  />
));
Select.displayName = "Select";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 text-sm font-semibold text-neutral-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);
