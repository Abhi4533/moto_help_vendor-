// helpers.ts
export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));
export const randomId = () => Math.random().toString(36).substring(2, 10);
export const noop = () => {};
