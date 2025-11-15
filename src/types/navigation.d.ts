export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OtpVerify: { phone: string };
};

export type KycStackParamList = {
  TemporaryDashboard: undefined;
  KycStart: undefined;
  KycUploadDocs: undefined;
  KycSuccess: undefined;
};

export type DashboardStackParamList = {
  MainDashboard: undefined;
  Profile: undefined;
  VehicleList: undefined;
  DriverList: undefined;
};

export type MapStackParamList = {
  MapHome: undefined;
  TripTracking: { tripId: string };
};

export type RootStackParamList = {
  Auth: undefined;
  KycFlow: undefined;
  Dashboard: undefined;
  Map: undefined;
};
