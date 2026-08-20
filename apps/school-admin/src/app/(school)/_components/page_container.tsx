import type {
    ReactNode,
  } from "react";
  
  type Props = {
    children: ReactNode;
    className?: string;
  };
  
  export function PageContainer({
    children,
    className = "",
  }: Props) {
    return (
      <main
        className={`flex-1 p-4 sm:p-6 lg:p-8 ${className}`}
      >
        {children}
      </main>
    );
  }