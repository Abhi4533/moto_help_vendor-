export interface CustomerPost {
  Customer_LoadPostID: string;
  PickupLat: number;
  PickupLng: number;
}

export interface VendorLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const DEFAULT_INDIA_REGION = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 15,
  longitudeDelta: 15,
};
