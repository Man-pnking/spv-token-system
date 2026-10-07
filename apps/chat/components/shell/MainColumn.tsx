import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function MainColumn({ children }: Props) {
  return (
    <main className="flex-1 min-w-0 flex flex-col bg-black/5">
      {children}
    </main>
  );
}
