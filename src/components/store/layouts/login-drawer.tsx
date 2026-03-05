"use client";

import { useState, useEffect } from "react";
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [otpTimer, setOtpTimer] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);

  const reset = () => {
    setPhone("");
    setOtp("");
    setStep(1);
    setError("");
    setOtpTimer(0);
    setResendTimer(0);
  };

  const closeDrawer = () => {
    setOpen(false);
    reset();
  };

  const sendOTP = async () => {
    if (phone.length < 10) {
      setError("Enter valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setStep(2);
      setOtp("");
      setOtpTimer(data.expiresIn || 30);
      setResendTimer(data.resendIn || 15);
    } else {
      setError(data.error || "Failed to send OTP");
    }
  };

  const verifyOTP = async () => {
    if (otp.length < 4) {
      setError("Invalid OTP");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      window.location.reload();
    } else {
      setError(data.error || "Invalid OTP");
    }
  };

  // OTP expiry timer
  useEffect(() => {
    if (otpTimer <= 0) return;

    const interval = setInterval(() => {
      setOtpTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpTimer]);

  // resend cooldown timer
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* Overlay */}
      <div onClick={closeDrawer} className="absolute inset-0 bg-black/40" />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-96 bg-white shadow-lg transform transition ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold text-lg">Login</h2>

          <button onClick={closeDrawer}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && <div className="text-sm text-red-500">{error}</div>}

          {/* PHONE STEP */}
          {step === 1 && (
            <>
              <input
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <button
                disabled={loading}
                onClick={sendOTP}
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {/* OTP STEP */}
          {step === 2 && (
            <>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <button
                disabled={loading}
                onClick={verifyOTP}
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              {/* OTP expiry */}
              <div className="text-sm text-gray-500">
                OTP expires in {otpTimer}s
              </div>

              {/* resend */}
              <div className="text-sm">
                {resendTimer > 0 ? (
                  <span className="text-gray-500">
                    Resend OTP in {resendTimer}s
                  </span>
                ) : (
                  <button
                    onClick={sendOTP}
                    className="text-black underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}