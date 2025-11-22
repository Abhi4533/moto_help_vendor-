// import {
//   useGetAvilableDriverMutation,
//   useGetVehicleActiveListMutation,
//   useGetVehicleProcessListMutation,
// } from '@api/hooks_api';
import {
  getActiveVehicles,
  getAvailableVehicles,
  getProcessVehicles,
} from '@api/endpoints/vehicle.api';
import { useIsFocused } from '@react-navigation/native';
import { RootState } from '@store/index';
import React, { useLayoutEffect, useState } from 'react';
import { Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import DashboardLayout from '../Layout/Layout';

const MainDashboard = () => {
  const isFocused = useIsFocused();
  const vendorid = useSelector((state: RootState) => state.auth?.token);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const fetchData = async () => {
      if (vendorid && isFocused) {
        setIsLoading(true);
        try {
          const response = await Promise.all([
            getAvailableVehicles({ vendorid }),
            getActiveVehicles({ vendorid }),
            getProcessVehicles({ vendorid }),
          ]);
          console.log({ response });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [vendorid, isFocused]);

  return (
    <DashboardLayout>
      <Text>check</Text>
    </DashboardLayout>
  );
};

export default MainDashboard;
