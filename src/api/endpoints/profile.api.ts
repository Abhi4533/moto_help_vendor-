import apiClient from '@api/base';

export const getVendorDetails = async (payload: {
  vendorid: any;
}): Promise<any> => {
  const response = await apiClient.post('/get_Vendor_Details', payload);
  return response.data;
};

export const postUpdateVendorDetails = async (payload: any): Promise<any> => {
  const response = await apiClient.post('/update_Vendor_Details', payload);
  return response.data;
};

export const getEmployeeDetails = async (payload: {
  vendorid: any;
}): Promise<any> => {
  const response = await apiClient.post('/get_vendor_employee', payload);
  return response.data;
};

export const getProfileVehicleDetails = async (payload: {
  vendorid: any;
}): Promise<any> => {
  const response = await apiClient.post('/get_vehicle', payload);
  return response.data;
};

export const getKycDetails = async (payload: {
  vendorid: any;
}): Promise<any> => {
  const response = await apiClient.post('/get_vendor_kyc', payload);
  return response.data;
};

export const deleteEmployee = async (payload: {
  vendorid: any;
  employeeid: any;
}): Promise<any> => {
  const response = await apiClient.post('/delete_vendor_employee', payload);
  return response.data;
};

export const updateEmployee = async (payload: any): Promise<any> => {
  const response = await apiClient.post('/update_vendor_employee', payload);
  return response.data;
};

export const deleteVehicle = async (payload: {
  vendorid: any;
  vehicleid: any;
}): Promise<any> => {
  const response = await apiClient.post('/delete_vehicle', payload);
  return response.data;
};

export const updateVehicle = async (payload: {
  vendorid: string;
  vehicleid: string;
  vehicleWeight: string;
  registrationNo: string;
  vehicle_count: string;
}): Promise<any> => {
  const response = await apiClient.post('/update_vehicle', payload);
  return response.data;
};

export const updateKyc = async (payload: any): Promise<any> => {
  const response = await apiClient.post('/update_vendor_kyc', payload);
  return response.data;
};
