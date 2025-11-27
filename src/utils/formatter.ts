import RNFS from 'react-native-fs';

// formatter.ts
export const formatPhone = (number: string): string => {
  const cleanNumber = number.replace(/\D/g, '');
  if (cleanNumber.length <= 3) return cleanNumber;
  if (cleanNumber.length <= 6)
    return `${cleanNumber.slice(0, 3)} ${cleanNumber.slice(3)}`;
  return `${cleanNumber.slice(0, 3)} ${cleanNumber.slice(
    3,
    6,
  )} ${cleanNumber.slice(6, 10)}`;
};

export const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
export const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

export const convertToBase64 = async (uri: string) => {
  try {
    const base64 = await RNFS.readFile(uri, 'base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (err) {
    console.log('Base64 convert error', err);
    return null;
  }
};
