/* ── Polymorphic Button ─────────────────────────────────────────────────────── */
import type { LucideIcon } from "lucide-react";
import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type ButtonBaseProps = {
  className?: string;
  icon?: LucideIcon;
  children?: ReactNode;
};

export type ButtonProps<C extends ElementType> = ButtonBaseProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof ButtonBaseProps | "as">;

function Button<C extends ElementType = "button">({
  as,
  className = "",
  icon: Icon,
  children,
  ...props
}: ButtonProps<C>) {
  const Comp = (as || "button") as ElementType;
  return (
    <Comp
      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm transition hover:opacity-90 active:scale-[.98] ${className}`}
      {...(props as object)}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span>{children}</span>
    </Comp>
  );
}

export default Button;
