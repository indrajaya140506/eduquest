import type { CSSProperties, ReactNode } from "react";

type DashboardContainerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function DashboardContainer({
  children,
  className = "",
  style = {},
}: DashboardContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
