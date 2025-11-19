// tabs.ts
export type TabKey = 'dashboard' | 'vehicles' | 'drivers' | 'ekyc';

export interface TabItem {
  id: TabKey;
  label: string;
  icon: string;
}

export const TAB_ITEMS: TabItem[] = [
  { id: 'dashboard', icon: 'view-dashboard', label: 'Dashboard' },
  { id: 'vehicles', icon: 'truck', label: 'Vehicles' },
  { id: 'drivers', icon: 'account-group', label: 'Drivers' },
  { id: 'ekyc', icon: 'shield-account', label: 'eKYC' },
];
