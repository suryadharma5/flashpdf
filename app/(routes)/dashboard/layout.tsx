import Sidebar from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar />
      {children}
    </div>
  );
}
