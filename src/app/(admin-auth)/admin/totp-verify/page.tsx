"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function TotpVerifyPage() {

  const params = useSearchParams();
  const router = useRouter();

  const adminId = params.get("adminId");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/admin/verify-totp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adminId, code }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.message);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          Enter Authenticator Code
        </h2>

        <form onSubmit={verify} className="space-y-4">

          <input
            type="text"
            required
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md"
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

        </form>

      </div>

    </div>
  );
}