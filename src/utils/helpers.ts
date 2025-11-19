// helpers.ts
export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
export const randomId = () => Math.random().toString(36).substring(2, 10);
export const noop = () => {};

// extract pan from gst
export const extractPanFromGst = (gstNumber: string): string => {
  if (gstNumber && gstNumber.length === 15) {
    return gstNumber.substring(2, 12);
  }
  return '';
};
