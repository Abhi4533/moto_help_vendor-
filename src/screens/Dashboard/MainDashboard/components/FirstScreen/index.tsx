import {
  useGetCountMutation,
  useVendorNearestCustomerPostMutation,
} from '@api/hooks_api';
import OriginMarker from '@assets/map/OriginMarker';
import Parcel from '@assets/map/parcel';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@store/index';
import { routeName } from '@utils/navigationHelpers';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Dimensions,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import { Button, Card, Icon, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

// ---------------- TYPES ----------------
interface CustomerPost {
  Customer_LoadPostID: string;
  CustomerID: string;
  VehicleType: string;
  BodyType: string;
  CargoContent: string;
  CargoPackageType: string;
  ApproxWeight: string;
  PostDate: string;
  PickupLocation: string;
  Origin_Lat: number;
  Origin_Lng: number;
  DestinationLocation: string;
  Destination_Lat: number;
  Destination_Lng: number;
  DistanceKm: number;
  CargoTypes_IMG?: string;
}

interface VendorLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface NearbyCustomersResponse {
  status: string;
  message: string;
  data: CustomerPost[];
}

const DEFAULT_INDIA_REGION = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 15,
  longitudeDelta: 15,
};

// ---------------- MAIN COMPONENT ----------------
const FirstScreen = () => {
  const [nearbyCustomerPost] = useVendorNearestCustomerPostMutation();
  const [getCount] = useGetCountMutation();

  const { vendorid, owner_name } = useSelector(
    (state: RootState) => state.auth,
  );
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region>(DEFAULT_INDIA_REGION);
  const [vendorLocation, setVendorLocation] = useState<VendorLocation | null>(
    null,
  );
  const [customerPosts, setCustomerPosts] = useState<CustomerPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<CustomerPost | null>(null);
  const [radius, setRadius] = useState<number>(50);
  const [watchId, setWatchId] = useState<number | null>(null);

  // ---------------- PERMISSION ----------------
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization();
      console.log({ auth });
      return auth;
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'App needs access to your location to show nearby customers.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  // ---------------- FAST LOCATION FETCH ----------------
  const getVendorLocation = (): Promise<VendorLocation> => {
    return new Promise((resolve, reject) => {
      let resolved = false;

      // Try quick cached fix first
      Geolocation.getCurrentPosition(
        position => {
          if (!resolved) {
            resolved = true;
            const { latitude, longitude, accuracy } = position.coords;
            resolve({ latitude, longitude, accuracy });
          }
        },
        () => {
          // fallback to watchPosition (usually faster)
          const watch = Geolocation.watchPosition(
            pos => {
              if (!resolved) {
                resolved = true;
                Geolocation.clearWatch(watch);
                const { latitude, longitude, accuracy } = pos.coords;
                resolve({ latitude, longitude, accuracy });
              }
            },
            err => {
              if (!resolved) {
                resolved = true;
                reject(err);
              }
            },
            {
              enableHighAccuracy: false,
              distanceFilter: 0,
              timeout: 7000,
            },
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 5000,
        },
      );

      // fallback default region after timeout
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve({
            latitude: DEFAULT_INDIA_REGION.latitude,
            longitude: DEFAULT_INDIA_REGION.longitude,
          });
        }
      }, 8000);
    });
  };

  // ---------------- WATCH LOCATION ----------------
  const startWatchingLocation = () => {
    const id = Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        setVendorLocation({ latitude, longitude, accuracy });
      },
      error => {
        console.log('Error watching location:', error);
        Toast.show({
          type: 'error',
          text1: 'Location Error',
          text2: 'Unable to track your location',
        });
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 50,
        interval: 10000,
        fastestInterval: 5000,
      },
    );
  };

  // ---------------- FETCH NEARBY CUSTOMERS ----------------
  const getLocationName = (fullAddress: string): string => {
    const parts = fullAddress.split(',');
    return parts.length > 1 ? parts[0].trim() : fullAddress;
  };

  const fetchNearbyCustomerPosts = async () => {
    if (!vendorid) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Vendor ID not found',
      });
      return;
    }

    try {
      const vendorLoc = await getVendorLocation();
      setVendorLocation(vendorLoc);

      const requestBody = {
        VendorID: vendorid,
        vendorLat: vendorLoc.latitude,
        vendorLng: vendorLoc.longitude,
        radius,
      };

      const response = (await nearbyCustomerPost(
        requestBody,
      ).unwrap()) as NearbyCustomersResponse;

      if (response?.status === '00' && Array.isArray(response.data)) {
        setCustomerPosts(response.data);
        Toast.show({
          type: 'success',
          text1: 'Nearby Posts Loaded',
          text2: `Found ${response.data.length} customer posts`,
        });
      } else {
        setCustomerPosts([]);
        Toast.show({
          type: 'info',
          text1: 'No Posts Found',
          text2: response?.message || 'No nearby customer posts',
        });
      }
    } catch (error: any) {
      console.error('Error fetching customer posts:', error);
      setCustomerPosts([]);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: error?.message || 'Failed to connect to server',
      });
    }
  };

  // ---------------- INIT ----------------
  const initializeData = async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Toast.show({
          type: 'error',
          text1: 'Permission Denied',
          text2: 'Location access is required to load nearby data.',
        });
        return;
      }

      const location = await getVendorLocation();
      setVendorLocation(location);
      startWatchingLocation();

      if (vendorid) {
        await getCount({ vendorid });
        await fetchNearbyCustomerPosts();
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      Toast.show({
        type: 'error',
        text1: 'Initialization Failed',
        text2: 'Unable to load initial data.',
      });
    }
  };

  useLayoutEffect(() => {
    initializeData();

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [vendorid]);

  useEffect(() => {
    if (vendorLocation && vendorid) {
      fetchNearbyCustomerPosts();
    }
  }, [radius]);

  const handleNavigation = (route: string) =>
    navigation.navigate(route as never);

  // ---------------- UI DATA ----------------
  const quickActions = [
    { icon: 'account', label: 'Drivers', route: routeName.SPLASH },
    { icon: 'car', label: 'Vehicles', route: routeName.VEHICLES },
    { icon: 'cog', label: 'Operations', route: routeName.SPLASH },
    { icon: 'cash', label: 'Expenses', route: routeName.EXPENSES },
    { icon: 'file-document', label: 'Billing', route: routeName.SPLASH },
    { icon: 'credit-card', label: 'Payments', route: routeName.SPLASH },
  ];

  const renderQuickActionsRow = (startIndex: number) => (
    <View style={styles.quickActionsRow}>
      {quickActions.slice(startIndex, startIndex + 3).map(action => (
        <TouchableOpacity
          key={action.label}
          style={styles.quickActionItem}
          onPress={() => handleNavigation(action.route)}
        >
          <View style={styles.quickActionIcon}>
            <Icon source={action.icon} size={24} color="#6366F1" />
          </View>
          <Text style={styles.quickActionText}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const handlePostSelect = (post: CustomerPost) => {
    setSelectedPost(post);
    if (vendorLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: post.Origin_Lat,
        longitude: post.Origin_Lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };

  // ---------------- UI RENDER ----------------
  return (
    <>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Icon source="menu" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          {owner_name && <Text style={styles.ownerName}>{owner_name}</Text>}
        </View>
        {vendorLocation && (
          <View style={styles.locationAccuracy}>
            <Icon source="crosshairs-gps" size={16} color="#FFF" />
            <Text style={styles.accuracyText}>
              {vendorLocation.accuracy
                ? `±${Math.round(vendorLocation.accuracy)}m`
                : 'GPS'}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topButtonsContainer}>
          <Button
            mode="contained"
            icon="car-key"
            style={styles.topButton}
            labelStyle={styles.topButtonLabel}
            onPress={() => handleNavigation(routeName.VEHICLE_ASSIGN)}
          >
            Assign Vehicle
          </Button>
          <Button
            mode="contained"
            icon="car"
            style={[styles.topButton, styles.availableButton]}
            labelStyle={styles.topButtonLabel}
            onPress={() => handleNavigation(routeName.VEHICLE_POSTS)}
          >
            Available Vehicles
          </Button>
        </View>

        <Card style={styles.sectionCard} mode="elevated">
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            initialRegion={DEFAULT_INDIA_REGION}
            showsMyLocationButton={false}
          >
            {vendorLocation && (
              <Marker
                coordinate={vendorLocation}
                flat
                anchor={{ x: 0.5, y: 0.5 }}
                zIndex={800}
                tracksViewChanges={false}
              >
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <OriginMarker size={25} />
                </View>
              </Marker>
            )}

            {customerPosts.map(post => (
              <Marker
                key={post.Customer_LoadPostID}
                coordinate={{
                  latitude: post.Origin_Lat,
                  longitude: post.Origin_Lng,
                }}
                flat
                anchor={{ x: 0.5, y: 0.5 }}
                zIndex={800}
                tracksViewChanges={false}
              >
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Parcel height={60} width={60} />
                </View>
              </Marker>
            ))}

            {selectedPost && (
              <Polyline
                coordinates={[
                  {
                    latitude: selectedPost.Origin_Lat,
                    longitude: selectedPost.Origin_Lng,
                  },
                  {
                    latitude: selectedPost.Destination_Lat,
                    longitude: selectedPost.Destination_Lng,
                  },
                ]}
                strokeColor="#10B981"
                strokeWidth={4}
              />
            )}
          </MapView>
        </Card>

        <Card style={styles.sectionCard} mode="elevated">
          <Card.Content>
            <View style={styles.quickActionsContainer}>
              {renderQuickActionsRow(0)}
              {renderQuickActionsRow(3)}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
};

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  menuButton: { marginRight: 16 },
  headerTextContainer: { flex: 1 },
  welcomeText: { color: '#FFF', fontSize: 16, opacity: 0.9 },
  ownerName: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 2 },
  locationAccuracy: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accuracyText: { color: '#FFF', fontSize: 12, marginLeft: 4 },
  topButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    marginTop: 8,
    gap: 12,
  },
  topButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 4,
  },
  availableButton: { backgroundColor: '#10B981' },
  topButtonLabel: { fontSize: 13, fontWeight: '600' },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  map: { height: height * 0.45, width: '100%' },
  mapPlaceholder: {
    height: height * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loaderText: { marginTop: 8, color: '#6366F1', fontWeight: '500' },
  vendorMarker: {
    backgroundColor: '#6366F1',
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  pickupMarker: {
    backgroundColor: '#10B981',
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  destinationMarker: {
    backgroundColor: '#EF4444',
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  quickActionsContainer: { gap: 12 },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    padding: 4,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickActionIcon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionText: { fontSize: 13, fontWeight: '500', color: '#1e293b' },
});

export default FirstScreen;
