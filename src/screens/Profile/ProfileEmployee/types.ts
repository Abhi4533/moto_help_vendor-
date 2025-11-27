export interface EmployeeItem {
  employeeid?: string;
  vendor_id?: string;
  full_name: string;
  contact_no: string;
  alternate_no?: string;
  email_id: string | null;
  website?: string;
  designation: string;
  employee_count?: string;
  customDesignation?: any;
}

export interface EmployeeData extends EmployeeItem {
  id?: string; // if needed for edit mode
}

export interface FormModalProps {
  handleFormSubmit: (values: EmployeeItem) => void;
  modalVisible: boolean;
  currentEmployee: EmployeeItem | null;
  isEditMode: boolean;
  setModalVisible: (value: boolean) => void;
}

export interface DesignationItem {
  label: string;
  value: string;
}
