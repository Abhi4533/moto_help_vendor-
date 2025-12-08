// components/MapTab.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import MapView, {
  LatLng,
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';

// Assets
import DropMarker from '@assets/map/DropMarker';
import OriginMarker from '@assets/map/OriginMarker';
import Parcel from '@assets/map/parcel';
import Truck from '@assets/map/Truck';

// Utils & Styles
import { ENV } from '@config/env';
import { COLORS } from '@config/theme';
import Geolocation from '@react-native-community/geolocation';
import { useDashboard } from '@screens/Dashboard/Layout/DashboardContext';
import { RootState } from '@store/index';
import { Coordinate } from '@store/slices/mapSlice';
import { INDIA_REGION, MAP_STYLE } from '@utils/mapHelper';
import { Button } from 'react-native-paper';
import { isValidCoordinate } from '../helper';

// Get screen dimensions for better region calculation
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;

const MapTab = () => {
  const { selectedTab: type } = useDashboard();
  const mapRef = useRef<MapView>(null);
  const [calculatingRoutes, setCalculatingRoutes] = useState(false);
  const [vendorLocation, setVendorLocation] = useState<any | null>(null);
  const [directionsCoordinates, setDirectionsCoordinates] = useState<LatLng[]>(
    [],
  );

  // Extract map state from Redux using your existing slice
  const {
    pickupLocation,
    destinationLocation,
    liveDriverLocation,
    driverLocations,
    customerLocations,
    routePath,
  } = useSelector((state: RootState) => state.map);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      pos => {
        setVendorLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      error => Alert.alert('Location Error', JSON.stringify(error)),
      { enableHighAccuracy: true },
    );
  }, []);

  // Get valid coordinates
  const validDriverCoordinate = useMemo(() => {
    return isValidCoordinate(liveDriverLocation) ? liveDriverLocation : null;
  }, [liveDriverLocation]);

  const validPickupLocation = useMemo(() => {
    return isValidCoordinate(pickupLocation) ? pickupLocation : null;
  }, [pickupLocation]);

  const validDestinationLocation = useMemo(() => {
    return isValidCoordinate(destinationLocation) ? destinationLocation : null;
  }, [destinationLocation]);

  const validVendorLocation = useMemo(() => {
    return isValidCoordinate(vendorLocation) ? vendorLocation : null;
  }, [vendorLocation]);

  // Filter valid driver locations
  const validDriverLocations = useMemo(() => {
    return driverLocations.filter(coord => isValidCoordinate(coord));
  }, [driverLocations]);

  // Filter valid customer locations
  const validCustomerLocations = useMemo(() => {
    return customerLocations.filter(coord => isValidCoordinate(coord));
  }, [customerLocations]);

  // Collect ALL coordinates including route waypoints
  const getAllCoordinates = useCallback((): Coordinate[] => {
    const allCoords: Coordinate[] = [];

    // Helper to add unique coordinates
    const addCoordinate = (coord: Coordinate) => {
      if (isValidCoordinate(coord)) {
        const exists = allCoords.some(
          c => c.latitude === coord.latitude && c.longitude === coord.longitude,
        );
        if (!exists) {
          allCoords.push(coord);
        }
      }
    };

    // Add all marker coordinates based on type
    switch (type) {
      case 'idle':
        if (validVendorLocation) addCoordinate(validVendorLocation);
        if (validDriverCoordinate) addCoordinate(validDriverCoordinate);
        validDriverLocations.forEach(addCoordinate);
        validCustomerLocations.forEach(addCoordinate);

        // Add route waypoints from driver to customers
        if (validDriverCoordinate && validCustomerLocations.length > 0) {
          validCustomerLocations.forEach(customerCoord => {
            // Add intermediate points from directions (we'll calculate these below)
            const midPoint = {
              latitude:
                (validDriverCoordinate.latitude + customerCoord.latitude) / 2,
              longitude:
                (validDriverCoordinate.longitude + customerCoord.longitude) / 2,
            };
            addCoordinate(midPoint);
          });
        }
        break;

      case 'process':
        if (validPickupLocation) addCoordinate(validPickupLocation);
        if (validDriverCoordinate) addCoordinate(validDriverCoordinate);

        // Add midpoint for route
        if (validDriverCoordinate && validPickupLocation) {
          const midPoint = {
            latitude:
              (validDriverCoordinate.latitude + validPickupLocation.latitude) /
              2,
            longitude:
              (validDriverCoordinate.longitude +
                validPickupLocation.longitude) /
              2,
          };
          addCoordinate(midPoint);
        }
        break;

      case 'active':
        if (validPickupLocation) addCoordinate(validPickupLocation);
        if (validDestinationLocation) addCoordinate(validDestinationLocation);
        if (validDriverCoordinate) addCoordinate(validDriverCoordinate);

        // Add midpoints for both routes
        if (validPickupLocation && validDestinationLocation) {
          const routeMidPoint = {
            latitude:
              (validPickupLocation.latitude +
                validDestinationLocation.latitude) /
              2,
            longitude:
              (validPickupLocation.longitude +
                validDestinationLocation.longitude) /
              2,
          };
          addCoordinate(routeMidPoint);
        }

        if (validDriverCoordinate && validDestinationLocation) {
          const navMidPoint = {
            latitude:
              (validDriverCoordinate.latitude +
                validDestinationLocation.latitude) /
              2,
            longitude:
              (validDriverCoordinate.longitude +
                validDestinationLocation.longitude) /
              2,
          };
          addCoordinate(navMidPoint);
        }
        break;
    }

    // Add route path coordinates
    routePath.filter(isValidCoordinate).forEach(addCoordinate);

    console.log('All coordinates to fit:', allCoords.length, allCoords);
    return allCoords;
  }, [
    type,
    validDriverCoordinate,
    validPickupLocation,
    validDestinationLocation,
    validVendorLocation,
    validDriverLocations,
    validCustomerLocations,
    routePath,
  ]);

  // Function to calculate bounding box with proper padding
  const calculateBoundingBox = useCallback((coordinates: Coordinate[]) => {
    if (coordinates.length === 0) {
      return {
        minLat: INDIA_REGION.latitude - INDIA_REGION.latitudeDelta / 2,
        maxLat: INDIA_REGION.latitude + INDIA_REGION.latitudeDelta / 2,
        minLng: INDIA_REGION.longitude - INDIA_REGION.longitudeDelta / 2,
        maxLng: INDIA_REGION.longitude + INDIA_REGION.longitudeDelta / 2,
      };
    }

    const latitudes = coordinates.map(c => c.latitude);
    const longitudes = coordinates.map(c => c.longitude);

    let minLat = Math.min(...latitudes);
    let maxLat = Math.max(...latitudes);
    let minLng = Math.min(...longitudes);
    let maxLng = Math.max(...longitudes);

    // Add 15% padding
    const latPadding = (maxLat - minLat) * 0.15;
    const lngPadding = (maxLng - minLng) * 0.15;

    minLat -= latPadding;
    maxLat += latPadding;
    minLng -= lngPadding;
    maxLng += lngPadding;

    // Ensure minimum size (in case all points are very close)
    const MIN_LAT_DIFF = 0.01; // ~1.1km
    const MIN_LNG_DIFF = 0.01;

    if (maxLat - minLat < MIN_LAT_DIFF) {
      const centerLat = (minLat + maxLat) / 2;
      minLat = centerLat - MIN_LAT_DIFF / 2;
      maxLat = centerLat + MIN_LAT_DIFF / 2;
    }

    if (maxLng - minLng < MIN_LNG_DIFF) {
      const centerLng = (minLng + maxLng) / 2;
      minLng = centerLng - MIN_LNG_DIFF / 2;
      maxLng = centerLng + MIN_LNG_DIFF / 2;
    }

    return { minLat, maxLat, minLng, maxLng };
  }, []);

  // Fit ALL coordinates to map
  const fitAllCoordinates = useCallback(() => {
    const coordinates = getAllCoordinates();

    if (coordinates.length === 0) {
      mapRef.current?.animateToRegion(INDIA_REGION, 1000);
      return;
    }

    const { minLat, maxLat, minLng, maxLng } =
      calculateBoundingBox(coordinates);

    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLng + maxLng) / 2;

    const latDelta = maxLat - minLat;
    const lngDelta = maxLng - minLng;

    // Adjust for screen aspect ratio
    const region = {
      latitude,
      longitude,
      latitudeDelta: Math.max(latDelta, lngDelta / ASPECT_RATIO),
      longitudeDelta: Math.max(lngDelta, latDelta * ASPECT_RATIO),
    };

    console.log('Fitting to region:', region);
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      },
      animated: true,
    });

    // Also animate to the calculated region for better control
    mapRef.current?.animateToRegion(region, 1000);
  }, [getAllCoordinates, calculateBoundingBox]);

  // Improved fit using fitToCoordinates method
  const fitToMarkersAndRoutes = useCallback(() => {
    const coordinates = getAllCoordinates();

    if (coordinates.length === 0) {
      mapRef.current?.animateToRegion(INDIA_REGION, 1000);
      return;
    }

    console.log('Fitting to', coordinates.length, 'coordinates');

    // Use fitToCoordinates for better fitting
    mapRef.current?.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100,
      },
      animated: true,
    });
  }, [getAllCoordinates]);

  // Handle directions ready to capture coordinates
  const handleDirectionsReady = useCallback(
    (result: any) => {
      setCalculatingRoutes(false);

      // Extract coordinates from the route
      if (result?.coordinates && Array.isArray(result.coordinates)) {
        setDirectionsCoordinates(prev => [...prev, ...result.coordinates]);

        // Refit after getting route coordinates
        setTimeout(fitToMarkersAndRoutes, 500);
      }
    },
    [fitToMarkersAndRoutes],
  );

  const handleDirectionsError = useCallback((error: any) => {
    console.log('Directions error:', error);
    setCalculatingRoutes(false);
  }, []);

  const handleDirectionsStart = useCallback(() => {
    setCalculatingRoutes(true);
  }, []);

  // Auto-fit when important data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fitToMarkersAndRoutes();
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    type,
    validDriverCoordinate,
    validPickupLocation,
    validDestinationLocation,
    validVendorLocation,
    validDriverLocations.length,
    validCustomerLocations.length,
    fitToMarkersAndRoutes,
  ]);

  // Function to render markers and routes based on trip type
  const renderMapContent = () => {
    switch (type) {
      case 'idle':
        return renderIdleState();
      case 'process':
        return renderProcessState();
      case 'active':
        return renderActiveState();
      default:
        return null;
    }
  };

  // Render for idle state
  const renderIdleState = () => (
    <>
      {/* Vendor Marker */}
      {validVendorLocation && (
        <Marker
          coordinate={validVendorLocation}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={600}
          tracksViewChanges={false}
        >
          <OriginMarker size={34} />
        </Marker>
      )}

      {/* Live Driver Marker */}
      {validDriverCoordinate && (
        <Marker
          coordinate={validDriverCoordinate}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={900}
          tracksViewChanges={false}
        >
          <View style={{ transform: [{ rotate: `${180}deg` }] }}>
            <Truck width={70} height={70} />
          </View>
        </Marker>
      )}

      {/* Multiple Driver Markers */}
      {validDriverLocations.map((coord, index) => (
        <Marker
          key={`driver-${index}-${coord.latitude}-${coord.longitude}`}
          coordinate={coord}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={800}
          tracksViewChanges={false}
        >
          <Truck width={42} height={42} />
        </Marker>
      ))}

      {/* Customer Markers */}
      {validCustomerLocations.map((coord, index) => {
        console.log(`Rendering customer ${index}:`, coord);
        return (
          <Marker
            key={`customer-${index}-${coord.latitude}-${coord.longitude}`}
            coordinate={coord}
            flat
            anchor={{ x: 0.5, y: 0.5 }}
            zIndex={700}
            tracksViewChanges={false}
          >
            <Parcel width={34} height={34} />
          </Marker>
        );
      })}

      {/* Routes from Live Driver to Nearby Customers */}
      {validDriverCoordinate && validCustomerLocations.length > 0 && (
        <>
          {validCustomerLocations.map((customerCoord, index) => (
            <MapViewDirections
              key={`customer-route-${index}`}
              origin={validDriverCoordinate}
              destination={customerCoord}
              apikey={ENV.MAP_API_KEY}
              strokeWidth={3}
              strokeColor={'#FF9500'}
              lineDashPattern={[5, 5]}
              lineCap="round"
              lineJoin="round"
              precision="high"
              onStart={handleDirectionsStart}
              onReady={handleDirectionsReady}
              onError={handleDirectionsError}
              timePrecision="now"
              mode="DRIVING"
            />
          ))}
        </>
      )}
    </>
  );

  // Render for process state
  const renderProcessState = () => (
    <>
      {/* Pickup Marker */}
      {validPickupLocation && (
        <Marker
          coordinate={validPickupLocation}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={700}
          tracksViewChanges={false}
        >
          <Parcel width={38} height={38} />
        </Marker>
      )}

      {/* Live Driver Marker */}
      {validDriverCoordinate && (
        <Marker
          coordinate={validDriverCoordinate}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={900}
          tracksViewChanges={false}
        >
          <View style={{ transform: [{ rotate: `${180}deg` }] }}>
            <Truck width={70} height={70} />
          </View>
        </Marker>
      )}

      {/* Route from Driver to Pickup */}
      {validDriverCoordinate && validPickupLocation && (
        <MapViewDirections
          key="pickup-route"
          origin={validDriverCoordinate}
          destination={validPickupLocation}
          apikey={ENV.MAP_API_KEY}
          strokeWidth={8}
          strokeColor={COLORS.primary}
          lineCap="round"
          lineJoin="round"
          precision="high"
          onStart={handleDirectionsStart}
          onReady={handleDirectionsReady}
          onError={handleDirectionsError}
          timePrecision="now"
          mode="DRIVING"
        />
      )}
    </>
  );

  // Render for active state
  const renderActiveState = () => (
    <>
      {/* Pickup Marker */}
      {validPickupLocation && (
        <Marker
          coordinate={validPickupLocation}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={700}
          tracksViewChanges={false}
        >
          <Parcel width={38} height={38} />
        </Marker>
      )}

      {/* Destination Marker */}
      {validDestinationLocation && (
        <Marker
          coordinate={validDestinationLocation}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={700}
          tracksViewChanges={false}
        >
          <DropMarker size={38} />
        </Marker>
      )}

      {/* Live Driver Marker */}
      {validDriverCoordinate && (
        <Marker
          coordinate={validDriverCoordinate}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={900}
          tracksViewChanges={false}
        >
          <View style={{ transform: [{ rotate: `${180}deg` }] }}>
            <Truck width={50} height={50} />
          </View>
        </Marker>
      )}

      {/* Main route from Pickup to Destination */}
      {validPickupLocation && validDestinationLocation && (
        <MapViewDirections
          key="delivery-route"
          origin={validPickupLocation}
          destination={validDestinationLocation}
          apikey={ENV.MAP_API_KEY}
          strokeWidth={6}
          strokeColor={COLORS.primary}
          lineCap="round"
          lineJoin="round"
          precision="high"
          onStart={handleDirectionsStart}
          onReady={handleDirectionsReady}
          onError={handleDirectionsError}
          timePrecision="now"
          mode="DRIVING"
        />
      )}

      {/* Route from Driver to Destination */}
      {validDriverCoordinate && validDestinationLocation && (
        <MapViewDirections
          key="navigation-route"
          origin={validDriverCoordinate}
          destination={validDestinationLocation}
          apikey={ENV.MAP_API_KEY}
          strokeWidth={4}
          strokeColor={'#4CD964'}
          lineDashPattern={[2, 3]}
          lineCap="round"
          lineJoin="round"
          precision="high"
          onStart={handleDirectionsStart}
          onReady={handleDirectionsReady}
          onError={handleDirectionsError}
          timePrecision="now"
          mode="DRIVING"
        />
      )}

      {/* Existing route path */}
      {routePath.length > 1 && (
        <Polyline
          coordinates={routePath}
          strokeWidth={5}
          strokeColor="#007AFF"
          lineCap="round"
          lineJoin="round"
        />
      )}
    </>
  );

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        initialRegion={INDIA_REGION}
        showsUserLocation={false}
        showsMyLocationButton={false}
        mapType="standard"
        zoomControlEnabled={true}
        zoomEnabled={true}
        zoomTapEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={true}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        showsCompass={true}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
        showsScale={true}
        showsBuildings={true}
        customMapStyle={MAP_STYLE}
        moveOnMarkerPress={false}
        toolbarEnabled={false}
        onLayout={fitToMarkersAndRoutes}
        onMapReady={fitToMarkersAndRoutes}
      >
        {renderMapContent()}
      </MapView>

      {/* Loading Indicator */}
      {calculatingRoutes && (
        <View style={styles.loadingContainer}>
          <Button mode="contained" loading disabled>
            Calculating Routes...
          </Button>
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: 'relative' as const,
  },
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  fitButton: {
    backgroundColor: 'white',
    elevation: 8,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
});

export default React.memo(MapTab);
