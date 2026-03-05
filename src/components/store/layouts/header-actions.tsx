"use client";

import { useState, useEffect, useRef } from "react";
import LoginDrawer from "./login-drawer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@prisma/client";

export default function HeaderActions({
  isAuthenticated,
  user,
}: {
  isAuthenticated: boolean;
  user: User | null;
}) {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setDropdown(false);
    router.refresh();
  };

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // NOT LOGGED IN
  if (!isAuthenticated) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 transition"
        >
          Login
        </button>

        <LoginDrawer open={open} setOpen={setOpen} />
      </>
    );
  }

  // avatar initial
  const initial =
    user?.name?.charAt(0) ||
    user?.phone?.charAt(0) ||
    "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar */}
      <button
        onClick={() => setDropdown(!dropdown)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 font-semibold"
      >
        {initial.toUpperCase()}
      </button>

      {/* Dropdown */}
      {dropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-lg overflow-hidden">

          <Link
            href="/account/profile"
            onClick={() => setDropdown(false)}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            My Profile
          </Link>

          <Link
            href="/account/orders"
            onClick={() => setDropdown(false)}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Orders
          </Link>

          <Link
            href="/account/addresses"
            onClick={() => setDropdown(false)}
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Addresses
          </Link>

          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
          >
            Logout
          </button>

        </div>
      )}
    </div>
  );
}