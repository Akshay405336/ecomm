"use client";

import { useState } from "react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const sendOTP = async () => {
    await fetch("/api/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });

    setStep(2);
  };

  const verifyOTP = async () => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });

    if (res.ok) {
      window.location.href = "/";
    }
  };

  return (
    <div>

      {step === 1 && (
        <>
          <input
            placeholder="Phone number"
            onChange={(e) => setPhone(e.target.value)}
          />

          <button onClick={sendOTP}>
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button onClick={verifyOTP}>
            Verify OTP
          </button>
        </>
      )}

    </div>
  );
}