"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">

      {/* Left - Title */}
      <div className="text-lg font-semibold">
        Admin Dashboard
      </div>

      {/* Center - Search */}
      <div className="w-1/3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <button className="relative">
          <span className="text-xl">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              A
            </div>
            <span className="text-sm font-medium">Admin</span>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg">

              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Profile
              </button>

              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Settings
              </button>

              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}