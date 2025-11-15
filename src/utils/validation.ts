// validation.ts
export const isEmail = (email: string) =>
  /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
export const isPhone = (phone: string) => /^[0-9]{10}$/.test(phone);
export const isEmpty = (v: any) => !v || v === '';
export const isOTPValid = (otp: string[]): boolean => {
  return otp.every(digit => digit !== '') && otp.length === 4;
};
