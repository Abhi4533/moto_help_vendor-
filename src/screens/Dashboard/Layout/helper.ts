// tabs.ts
export type TabKey =
  | 'Dashboard'
  | 'Vehicles'
  | 'Drivers'
  | 'Available'
  | 'Assign';

export interface TabItem {
  id: TabKey;
  label: string;
  icon: string;
}

export const TAB_ITEMS: TabItem[] = [
  { id: 'Dashboard', icon: 'view-dashboard', label: 'Dashboard' },
  { id: 'Vehicles', icon: 'truck', label: 'vehicles' },
  { id: 'Drivers', icon: 'account-group', label: 'Drivers' },
  { id: 'Available', icon: 'shield-account', label: 'Available' },
  { id: 'Assign', icon: 'shield-account', label: 'Assign' },
];
