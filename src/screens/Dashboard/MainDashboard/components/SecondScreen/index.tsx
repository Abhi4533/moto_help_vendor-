import { useDashboard } from '@screens/Dashboard/Layout/DashboardContext';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import ActiveTripsModal from './components/ActiveTripsModal';
import CompleteTripsModal from './components/CompleteTripsModal';
import IdleDriversModal from './components/IdleDriversModal';
import MapTab from './components/MapTab';
import ProcessDriversModal from './components/ProcessDriversModal';
import TabSelector from './components/TabSelector';

const SecondScreen: FC<any> = ({
  activeData,
  avilableData,
  processData,
  completeData = [],
}) => {
  const dispatch = useDispatch();
  const {
    activeModalVisible,
    setActiveModalVisible,
    idleModalVisible,
    setIdleModalVisible,
    setCompleteModalVisible,
    setProcessModalVisible,
    completeModalVisible,
    processModalVisible,
    selectedTab,
    setSelectedTab,
    handleTabChange,
  } = useDashboard();
  // const handleTabChange = (value: any) => {
  //   setSelectedTab(value);

  //   dispatch(clearMapData());
  //   if (value === 'idle') {
  //     const loadsData: any = (avilableData?.[0]?.loads || [])
  //       .filter(
  //         (load: any) =>
  //           load.pickup_Latitude !== 0 && load.pickup_Longitude !== 0,
  //       )
  //       .map((load: any) => ({
  //         coordinate: {
  //           latitude: load.pickup_Latitude || 0,
  //           longitude: load.pickup_Longitude || 0,
  //         },
  //         id: load.LoadPostID || '',
  //         address: '',
  //         status: 'available',
  //       }));

  //     dispatch(
  //       setDriverAndCustomerLocations({
  //         driver: {
  //           latitude: avilableData?.[0]?.Driver_Latitude || 0,
  //           longitude: avilableData?.[0]?.Driver_Longitude || 0,
  //         },
  //         customers: loadsData.map((load: any) => load.coordinate),
  //       }),
  //     );
  //   } else if (value === 'process') {
  //     dispatch(
  //       setDriverAndPickupLocations({
  //         driver: {
  //           latitude: processData?.[0]?.Driver_Latitude,
  //           longitude: processData?.[0]?.Driver_Longitude,
  //         },
  //         pickup: {
  //           latitude: processData?.[0]?.pickup_Latitude,
  //           longitude: processData?.[0]?.pickup_Longitude,
  //         },
  //       }),
  //     );
  //   } else if (value === 'active') {
  //     dispatch(
  //       setDriverPickupAndDestinationLocations({
  //         driver: {
  //           latitude: activeData?.[0]?.Driver_Latitude,
  //           longitude: activeData?.[0]?.dropoff_Longitude,
  //         },
  //         destination: {
  //           latitude: activeData?.[0]?.dropoff_Latitude,
  //           longitude: activeData?.[0]?.dropoff_Longitude,
  //         },
  //         pickup: {
  //           latitude: activeData?.[0]?.pickup_Latitude,
  //           longitude: activeData?.[0]?.pickup_Longitude,
  //         },
  //       }),
  //     );
  //   }
  // };
  return (
    <>
      <TabSelector
        handleTabChange={handleTabChange}
        selectedTab={selectedTab as any}
      />

      <MapTab type={activeData} />

      {/* Individual Modals with raw data */}
      <IdleDriversModal
        visible={idleModalVisible}
        onDismiss={() => setIdleModalVisible(false)}
        rawData={avilableData || []}
      />

      <ProcessDriversModal
        visible={processModalVisible}
        onDismiss={() => setProcessModalVisible(false)}
        rawData={processData || []}
      />

      <ActiveTripsModal
        visible={activeModalVisible}
        onDismiss={() => setActiveModalVisible(false)}
        rawData={activeData || []}
      />

      <CompleteTripsModal
        visible={completeModalVisible}
        onDismiss={() => setCompleteModalVisible(false)}
        rawData={completeData}
      />
    </>
  );
};

export default SecondScreen;
