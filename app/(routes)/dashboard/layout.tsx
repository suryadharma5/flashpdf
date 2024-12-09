import { auth } from "@/auth";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Navbar } from "@/components/dashboard/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-white text-black">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="mx-auto px-4 py-8 xl:max-w-5xl">{children}</div>
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
