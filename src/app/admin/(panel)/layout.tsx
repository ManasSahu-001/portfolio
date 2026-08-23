import type { ReactNode } from "react";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-line py-6 md:block">
        <AdminNav />
      </aside>
      <div className="min-w-0 flex-1 pb-16">
        <div className="border-b border-line bg-paper/95 px-5 py-3 md:hidden">
          <AdminNav />
        </div>
        <main className="px-5 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
