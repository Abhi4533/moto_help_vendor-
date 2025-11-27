import {
  getActiveVehicles,
  getAvailableVehicles,
  getProcessVehicles,
} from '@api/endpoints/vehicle.api';
import Loader from '@components/common/Loader';
import { useIsFocused } from '@react-navigation/native';
import { RootState } from '@store/index';
import React, { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../Layout/Layout';
import FirstScreen from './components/FirstScreen';
import SecondScreen from './components/SecondScreen';

const MainDashboard = () => {
  const isFocused = useIsFocused();
  const vendorid = useSelector((state: RootState) => state.auth?.token);
  const [isLoading, setIsLoading] = useState(true);
  const [allData, setAllData] = useState<[any, any, any]>([
    undefined,
    undefined,
    undefined,
  ]);
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
          setAllData(response);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  const hasData = allData?.some(data => (data?.data?.length ?? 0) > 0);
  return (
    <DashboardLayout>
      <Loader visible={isLoading} />
      {hasData ? (
        <SecondScreen
          activeData={allData?.[1]?.data || []}
          avilableData={allData?.[0]?.data || []}
          processData={allData?.[2]?.data || []}
        />
      ) : (
        <FirstScreen />
      )}
    </DashboardLayout>
  );
};

export default MainDashboard;
