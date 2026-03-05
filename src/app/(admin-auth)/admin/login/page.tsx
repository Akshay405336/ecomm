"use client";

import { Suspense } from "react";
import AdminLoginForm from "@/components/admin/forms/AdminLoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center mt-20">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}