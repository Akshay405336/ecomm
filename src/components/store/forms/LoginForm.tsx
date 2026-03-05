"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {

  const router = useRouter(); // ✅ initialize router

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {

    setLoading(true);

    await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    setLoading(false);
    setStep(2);
  };

  const verifyOTP = async () => {

    setLoading(true);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/"); // ✅ redirect after login
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-4">

        <h2 className="text-2xl font-bold text-center">
          Phone Login
        </h2>

        {step === 1 && (
          <>
            <input
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />

            <button
              onClick={sendOTP}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />

            <button
              onClick={verifyOTP}
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

      </div>

    </div>
  );
}