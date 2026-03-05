import { cookies } from "next/headers";
import HeaderActions from "./header-actions";
import Link from "next/link";

export default async function Header() {
  const cookieStore = await cookies(); // ⭐ important
  const token = cookieStore.get("customer_token");

  const isAuthenticated = !!token;

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 max-w-7xl">

        {/* Logo */}
        <Link href="/" className="text-lg font-bold">
          LOGO
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
          <Link href="/cart">Cart</Link>
        </nav>

        {/* Login / Avatar */}
        <HeaderActions isAuthenticated={isAuthenticated} />

      </div>
    </header>
  );
}