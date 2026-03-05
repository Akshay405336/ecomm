import HeaderActions from "./header-actions";
import Link from "next/link";
import { getUser } from "@/infrastructure/auth/get-user";

export default async function Header() {
  const user = await getUser();

  const isAuthenticated = !!user;

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">

        <Link href="/" className="text-lg font-bold">
          LOGO
        </Link>

        <nav className="flex gap-6">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/about">About</Link>
          <Link href="/cart">Cart</Link>
        </nav>

        <HeaderActions
          isAuthenticated={isAuthenticated}
          user={user}
        />

      </div>
    </header>
  );
}