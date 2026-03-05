const otpStore = new Map<string, string>();

export function saveOTP(phone: string, otp: string) {
  otpStore.set(phone, otp);
}

export function getOTP(phone: string) {
  return otpStore.get(phone);
}

export function deleteOTP(phone: string) {
  otpStore.delete(phone);
}