"use client";

import { Suspense } from "react";
import LoginForm from "@/components/store/forms/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center mt-20">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}