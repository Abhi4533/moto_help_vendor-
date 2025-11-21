export interface AddDriverModalProps {
  setModalVisible: (v: boolean) => void;
  modalVisible: boolean;
  onDriverAdded?: () => void;
}

export interface DriverFormValues {
  full_name: string;
  Phone: string;
  emergency_phone: string;
  Email: string;
  address1: string;
  address2: string;
  pincode: string;
  state: string;
  City: string;
  Tahsil: string;
  driving_license_no: string;
  driving_license_address: string;
  dob: string; // ISO date string
  expiry_date: string; // ISO date string
  Driver_photo: string;
}
