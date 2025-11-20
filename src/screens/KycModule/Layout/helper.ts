// tabs.ts
export type TabKey =
  | 'TemporaryDashboard'
  | 'ValidateVehicle'
  | 'DriverList'
  | 'BankVerification';

export interface TabItem {
  id: TabKey;
  label: string;
  icon: string;
}

export const TAB_ITEMS: TabItem[] = [
  { id: 'TemporaryDashboard', icon: 'view-dashboard', label: 'Dashboard' },
  { id: 'ValidateVehicle', icon: 'truck', label: 'vehicles' },
  { id: 'DriverList', icon: 'account-group', label: 'Drivers' },
  { id: 'BankVerification', icon: 'shield-account', label: 'eKYC' },
];
