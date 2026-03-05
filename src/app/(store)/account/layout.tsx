import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-5xl mx-auto p-10">

      <h1 className="text-2xl font-bold mb-6">
        My Account
      </h1>

      {children}

    </div>
  );
}