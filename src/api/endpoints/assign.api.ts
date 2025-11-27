import apiClient from '@api/base';

export const getAssignableVehicle = async (payload: {
  vendorId: string;
}): Promise<any> => {
  const response = await apiClient.post('/get_VehicleAvailable', payload);
  return response.data;
};

export const getAssignableDriver = async (payload: {
  vendorId: string;
}): Promise<any> => {
  const response = await apiClient.post('/get_DriverAvailable', payload);
  return response.data;
};

export const postAssignVehicle = async (payload: any): Promise<any> => {
  const response = await apiClient.post(
    '/insert_Driver_Vehicle_Assign',
    payload,
  );
  return response.data;
};

export const updateAssignVehicle = async (payload: any): Promise<any> => {
  const response = await apiClient.post(
    '/update_Driver_Vehicle_Assign',
    payload,
  );
  return response.data;
};
