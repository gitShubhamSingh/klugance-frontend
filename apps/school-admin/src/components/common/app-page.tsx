import { ReactNode } from "react";

type AppPageProps = {
  children: ReactNode;
};

export function AppPage({ children }: AppPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-8">
      {children}
    </div>
  );
}