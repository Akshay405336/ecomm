"use client";

import { Suspense } from "react";
import TotpVerifyForm from "@/components/admin/forms/TotpVerifyForm";

export default function TotpVerifyPage() {
  return (
    <Suspense fallback={<div className="flex justify-center mt-20">Loading...</div>}>
      <TotpVerifyForm />
    </Suspense>
  );
}