export interface RouteType {
  state: string;
  region: string;
  districts: string[];
  timestamp: number;
  displayText: string;
}

export interface RouteParamType {
  LoadPostID?: string;
  DriverID?: string;
  cribedVendorID?: string;
  driverMobile?: string;
  Origin?: string;
  Destination?: string | null;
  VehicleNumber?: string | null;
  VehicleType?: string | null;
  VehicleStatus?: string;
  reportingTime?: string | null;
  ExpectedAvailableTime?: string | null;
  RouteLabel?: Array<{
    RouteLabel: string;
    State: string;
    Region: string;
    District: string;
    DistanceKm: string;
  }>;
  routes?: any;
}

export interface FormValues {
  driverMobile: string;
  vehicleStatus: string;
  routes: RouteType[];
  driverId: string; // Added for driver selection
}

export interface DropdownProps {
  label: string;
  value: string;
  options: Array<{ key: string; value: string; label?: string }>;
  onSelect: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  multiSelect?: boolean;
  selectedValues?: string[];
  onMultiSelect?: (values: string[]) => void;
}
