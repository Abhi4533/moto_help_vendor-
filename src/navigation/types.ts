// types.ts
export type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
  MapFlow: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  KYC: undefined;
};

export type DashboardStackParamList = {
  HomeTabs: undefined;
};

export type MapStackParamList = {
  Map: undefined;
  VehicleLocation: { vehicleId: string };
};
