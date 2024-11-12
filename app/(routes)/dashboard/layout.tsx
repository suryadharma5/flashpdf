import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Navbar } from "@/components/dashboard/navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
