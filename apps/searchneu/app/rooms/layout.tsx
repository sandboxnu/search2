import { Header } from "@/components/navigation/Header";
import { roomsFlag } from "@/lib/flags";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";

export default async function Layout({ children }: LayoutProps<"/rooms">) {
  return (
    <div className="flex h-[100dvh] flex-col">
      <Header />
      <Suspense>
        <FlagCheck>{children}</FlagCheck>
      </Suspense>
    </div>
  );
}

async function FlagCheck({ children }: { children: ReactNode }) {
  const roomsPage = await roomsFlag();

  if (!roomsPage) {
    notFound();
  }

  return children;
}
