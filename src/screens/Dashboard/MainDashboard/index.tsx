import {
  useGetAvilableDriverMutation,
  useGetVehicleActiveListMutation,
  useGetVehicleProcessListMutation,
} from '@api/hooks_api';
import { useIsFocused } from '@react-navigation/native';
import React, { useLayoutEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import FirstScreen from './components/FirstScreen';
import SecondScreen from './components/SecondScreen';

const MainDashboard = () => {
  const isFocused = useIsFocused();
  const { vendorid } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const [getAvilableDriver, { data: avilableData }] =
    useGetAvilableDriverMutation();
  const [getActiveDriver, { data: activeData }] =
    useGetVehicleActiveListMutation();
  const [getProcessDriver, { data: processData }] =
    useGetVehicleProcessListMutation();

  useLayoutEffect(() => {
    const fetchData = async () => {
      if (vendorid && isFocused) {
        setIsLoading(true);
        try {
          await Promise.all([
            getAvilableDriver({ vendorid }),
            getActiveDriver({ vendorid }),
            getProcessDriver({ vendorid }),
          ]);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [vendorid, isFocused]);

  const hasData = [activeData, processData, avilableData].some(
    data => (data?.data?.length ?? 0) > 0,
  );

  // if (isLoading) {
  //   return (
  //     <View style={[styles.container, styles.center]}>
  //       <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
  //       <ActivityIndicator size="large" color="#6366F1" />
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />
      {hasData ? (
        <SecondScreen
          activeData={activeData?.data || []}
          avilableData={avilableData?.data || []}
          processData={processData?.data || []}
        />
      ) : (
        <FirstScreen />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainDashboard;
