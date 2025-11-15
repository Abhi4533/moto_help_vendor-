import {
  ActiveDriverData,
  ProcessDriverData,
  VehicleAvailabilityDriver,
} from '@api/api.type';
import { initializeTrip, resetMapTab } from '@store/slice/mapTabSlice';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import ActiveTripsModal from './components/ActiveTripsModal';
import CompleteTripsModal from './components/CompleteTripsModal';
import Header from './components/Header';
import IdleDriversModal from './components/IdleDriversModal';
import MapTab from './components/MapTab';
import ProcessDriversModal from './components/ProcessDriversModal';
import TabSelector from './components/TabSelector';
import { TAB_CONFIG } from './helper';

interface SecondScreenProps {
  activeData: ActiveDriverData[];
  avilableData: VehicleAvailabilityDriver[];
  processData: ProcessDriverData[];
  completeData?: any[];
}

const SecondScreen: FC<SecondScreenProps> = ({
  activeData,
  avilableData,
  processData,
  completeData = [],
}) => {
  const dispatch = useDispatch();
  const [idleModalVisible, setIdleModalVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [activeModalVisible, setActiveModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);

  const [selectedTab, setSelectedTab] =
    useState<keyof typeof TAB_CONFIG>('idle');

  const handleTabChange = (value: string) => {
    setSelectedTab(value as keyof typeof TAB_CONFIG);
    dispatch(resetMapTab());
    if (value === 'idle' && avilableData?.[0]?.Driver_Latitude) {
      const loadsData: any = (avilableData?.[0]?.loads || [])
        .filter(
          load => load.pickup_Latitude !== 0 && load.pickup_Longitude !== 0,
        )
        .map(load => ({
          coordinate: {
            latitude: load.pickup_Latitude || 0,
            longitude: load.pickup_Longitude || 0,
          },
          id: load.LoadPostID || '',
          address: '',
          status: 'available',
        }));
      dispatch(
        initializeTrip({
          driverCoordinate: {
            latitude: avilableData?.[0]?.Driver_Latitude || 0,
            longitude: avilableData?.[0]?.Driver_Longitude || 0,
          },
          destination: null,
          origin: null,
          parcels: loadsData || [],
          tripId: avilableData?.[0]?.driver_id,
        }),
      );
    } else if (value === 'process' && processData?.[0]?.Driver_Latitude) {
      dispatch(
        initializeTrip({
          driverCoordinate: {
            latitude: processData?.[0]?.Driver_Latitude,
            longitude: processData?.[0]?.Driver_Longitude,
          },
          destination: null,
          origin: {
            latitude: processData?.[0]?.pickup_Latitude,
            longitude: processData?.[0]?.pickup_Longitude,
          },
          parcels: [],
          tripId: processData?.[0]?.driver_id,
        }),
      );
    } else if (value === 'active' && activeData?.[0]?.pickup_Latitude) {
      dispatch(
        initializeTrip({
          driverCoordinate: {
            latitude: activeData?.[0]?.Driver_Latitude,
            longitude: activeData?.[0]?.dropoff_Longitude,
          },
          destination: {
            latitude: activeData?.[0]?.dropoff_Latitude,
            longitude: activeData?.[0]?.dropoff_Longitude,
          },
          origin: {
            latitude: activeData?.[0]?.pickup_Latitude,
            longitude: activeData?.[0]?.pickup_Longitude,
          },
          parcels: [],
          tripId: activeData?.[0]?.LoadPostID,
        }),
      );
    }
  };

  const handleHeaderButtonPress = () => {
    switch (selectedTab) {
      case 'idle':
        setIdleModalVisible(true);
        break;
      case 'process':
        setProcessModalVisible(true);
        break;
      case 'active':
        setActiveModalVisible(true);
        break;
      case 'complete':
        setCompleteModalVisible(true);
        break;
      default:
        setIdleModalVisible(true);
    }
  };

  return (
    <>
      <Header setModalVisible={handleHeaderButtonPress} />
      <TabSelector
        handleTabChange={handleTabChange}
        selectedTab={selectedTab}
      />

      <MapTab type={selectedTab} />

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
