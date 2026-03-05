"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function LoginDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
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
      window.location.reload();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/40"
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-96 bg-white shadow-lg transform transition ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">Login</h2>

          <button onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">

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
                className="w-full bg-black text-white py-2 rounded-md"
              >
                Send OTP
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
                className="w-full bg-black text-white py-2 rounded-md"
              >
                Verify OTP
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}