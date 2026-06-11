/* ── Container ──────────────────────────────────────────────────────────────── */
import React, { ReactNode } from "react";

export interface ContainerProps {
  children?: ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => (
  <div className={`mx-auto w-full  px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export default Container;
