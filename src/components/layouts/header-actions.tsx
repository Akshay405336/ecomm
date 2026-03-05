"use client";

import { useState } from "react";
import LoginDrawer from "./login-drawer";
import { useRouter } from "next/navigation";

export default function HeaderActions({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.refresh();
  };

  // NOT LOGGED IN
  if (!isAuthenticated) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Login
        </button>

        <LoginDrawer open={open} setOpen={setOpen} />
      </>
    );
  }

  // LOGGED IN
  return (
    <div className="relative">

      {/* Avatar */}
      <button
        onClick={() => setDropdown(!dropdown)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200"
      >
        U
      </button>

      {/* Dropdown */}
      {dropdown && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-lg">

          <a
            href="/account"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            My Account
          </a>

          <a
            href="/orders"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Orders
          </a>

          <button
            onClick={logout}
            className="block w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100"
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
}