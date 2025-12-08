import { Coordinate } from '@store/slices/mapSlice';

export const isValidCoordinate = (coord: Coordinate | null): boolean => {
  if (!coord) return false;

  const { latitude, longitude } = coord;

  // Check for null/undefined
  if (latitude == null || longitude == null) return false;

  // Check for valid numbers
  if (typeof latitude !== 'number' || typeof longitude !== 'number')
    return false;

  // Check for NaN
  if (isNaN(latitude) || isNaN(longitude)) return false;

  // Check for valid geographic ranges
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return false;

  // Check for zero coordinates (often indicate missing data)
  if (latitude === 0 && longitude === 0) return false;

  return true;
};
