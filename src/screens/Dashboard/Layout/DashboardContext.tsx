// DashboardContext.tsx
import {
  getActiveVehicles,
  getAvailableVehicles,
  getProcessVehicles,
} from '@api/endpoints/vehicle.api';
import Geolocation from '@react-native-community/geolocation';
import { useIsFocused } from '@react-navigation/native';
import { RootState } from '@store/index';
import {
  clearMapData,
  setDriverAndCustomerLocations,
  setDriverAndPickupLocations,
  setDriverPickupAndDestinationLocations,
  setVendorLocation,
} from '@store/slices/mapSlice';
import { TAB_CONFIG } from '@utils/mapHelper';
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

interface DashboardContextProps {
  selectedTab: keyof typeof TAB_CONFIG;
  handleTabChange: (value: string) => void;
  handleHeaderButtonPress: () => void;
  idleModalVisible: boolean;
  setIdleModalVisible: (visible: boolean) => void;
  processModalVisible: boolean;
  setProcessModalVisible: (visible: boolean) => void;
  activeModalVisible: boolean;
  setActiveModalVisible: (visible: boolean) => void;
  completeModalVisible: boolean;
  setCompleteModalVisible: (visible: boolean) => void;
  setSelectedTab: (tab: keyof typeof TAB_CONFIG) => void;
  activeData: any[];
  avilableData: any[];
  processData: any[];
}

export const DashboardContext = createContext<DashboardContextProps | null>(
  null,
);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isFocus = useIsFocused();
  const [idleModalVisible, setIdleModalVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [activeModalVisible, setActiveModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof TAB_CONFIG>('idle');
  const vendorid = useSelector((state: RootState) => state.auth?.token);
  const [allData, setAllData] = useState<[any, any, any]>([
    undefined,
    undefined,
    undefined,
  ]);

  const fetchData = async () => {
    if (vendorid) {
      try {
        const response = await Promise.all([
          getAvailableVehicles({ vendorid }),
          getActiveVehicles({ vendorid }),
          getProcessVehicles({ vendorid }),
        ]);
        setAllData(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
  };

  useLayoutEffect(() => {
    fetchData();
  }, [isFocus, vendorid]);

  useEffect(() => {
    const loadsData: any = (allData?.[0]?.data?.[0]?.loads || [])
      .filter(
        (load: any) =>
          load.pickup_Latitude !== 0 && load.pickup_Longitude !== 0,
      )
      .map((load: any) => ({
        latitude: load.pickup_Latitude || 0,
        longitude: load.pickup_Longitude || 0,
      }));
    dispatch(
      setDriverAndCustomerLocations({
        driver: {
          latitude:
            Number(allData?.[0]?.data?.[0]?.driver?.Driver_Latitude) || 0,
          longitude: Number(allData?.[0]?.data?.[0]?.Driver_Longitude) || 0,
          rotation: 0,
        },
        customers: loadsData.map((load: any) => load.coordinate),
      }),
    );
  }, []);

  const handleHeaderButtonPress = (sel?: any) => {
    console.log({ sel });
    dispatch(clearMapData());
    switch (sel || selectedTab) {
      case 'idle':
        const loadsData: any = (allData?.[0]?.data?.[0]?.loads || [])
          .filter(
            (load: any) =>
              load.pickup_Latitude !== 0 && load.pickup_Longitude !== 0,
          )
          .map((load: any) => ({
            latitude: load.pickup_Latitude || 0,
            longitude: load.pickup_Longitude || 0,
          }));
        dispatch(
          setDriverAndCustomerLocations({
            driver: {
              latitude: allData?.[0]?.data?.[0]?.driver?.Driver_Latitude || 0,
              longitude: allData?.[0]?.data?.[0]?.Driver_Longitude || 0,
              rotation: 0,
            },
            customers: loadsData.map((load: any) => load.coordinate),
          }),
        );
        setIdleModalVisible(true);
        break;
      case 'process':
        dispatch(
          setDriverAndPickupLocations({
            driver: {
              latitude: allData?.[2]?.data?.[0]?.Driver_Latitude,
              longitude: allData?.[2]?.data?.[0]?.Driver_Longitude,
              rotation: 0,
            },
            pickup: {
              latitude: allData?.[2]?.data?.[0]?.pickup_Latitude,
              longitude: allData?.[2]?.data?.[0]?.pickup_Longitude,
              rotation: 0,
            },
          }),
        );
        setProcessModalVisible(true);
        break;
      case 'active':
        dispatch(
          setDriverPickupAndDestinationLocations({
            driver: {
              latitude: allData?.[1]?.data?.[0]?.Driver_Latitude,
              longitude: allData?.[1]?.data?.[0]?.dropoff_Longitude,
              rotation: 0,
            },
            destination: {
              latitude: allData?.[1]?.data?.[0]?.dropoff_Latitude,
              longitude: allData?.[1]?.data?.[0]?.dropoff_Longitude,
              rotation: 0,
            },
            pickup: {
              latitude: allData?.[1]?.data?.[0]?.pickup_Latitude,
              longitude: allData?.[1]?.data?.[0]?.pickup_Longitude,
              rotation: 0,
            },
          }),
        );
        setActiveModalVisible(true);
        break;
      case 'complete':
        setCompleteModalVisible(true);
        break;
      default:
        setIdleModalVisible(true);
    }
  };

  const handleTabChange = async (value: string) => {
    console.log({ value });
    await fetchData();
    setSelectedTab(value as keyof typeof TAB_CONFIG);
    handleHeaderButtonPress(value);
    dispatch(clearMapData());
  };

  useEffect(() => {
    Geolocation.watchPosition(
      pos => {
        dispatch(
          setVendorLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            rotation: 0,
          }),
        );
        // emitGetVendorLocations({
        //   lat: pos?.coords?.latitude,
        //   lng: pos?.coords?.longitude,
        //   VendorID: vendorid!,
        // });
      },
      error => Alert.alert('Location Error', JSON.stringify(error)),
    );
  }, [isFocus, vendorid]);
  return (
    <DashboardContext.Provider
      value={{
        selectedTab,
        handleTabChange,
        handleHeaderButtonPress,
        idleModalVisible,
        setIdleModalVisible,
        processModalVisible,
        setProcessModalVisible,
        activeModalVisible,
        setActiveModalVisible,
        completeModalVisible,
        setCompleteModalVisible,
        setSelectedTab,
        activeData: allData?.[1]?.data || [],
        avilableData: allData?.[0]?.data || [],
        processData: allData?.[2]?.data || [],
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
};
