import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth/getCurrentAdmin";

import AdminSidebar from "@/components/admin/layouts/admin-sidebar";
import AdminHeader from "@/components/admin/layouts/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const admin = await getCurrentAdmin();

  // 🔒 Protect admin routes
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <AdminHeader admin={admin} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}