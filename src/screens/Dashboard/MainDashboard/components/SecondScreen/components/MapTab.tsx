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
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
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
import { RootState } from '@store/index';
import { Coordinate } from '@store/slices/mapSlice';
import { INDIA_REGION, MAP_STYLE } from '@utils/mapHelper';
import { Button } from 'react-native-paper';
import { styles } from '../styles';

interface MapTabProps {
  type: 'idle' | 'process' | 'active';
}

// Enhanced coordinate validation
const isValidCoordinate = (coord: Coordinate | null): boolean => {
  if (!coord) return false;

  const { latitude, longitude } = coord;

  // Check for null/undefined
  if (latitude == null || longitude == null) return false;

  // Check for valid numbers
  if (typeof latitude !== 'number' || typeof longitude !== 'number')
    return false;

  // Check for NaN
  if (isNaN(latitude) || isNaN(longitude)) return false;

  // Check for valid geographic ranges
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return false;

  // Check for zero coordinates (often indicate missing data)
  if (latitude === 0 && longitude === 0) return false;

  return true;
};

// Get screen dimensions for better region calculation
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MapTab: React.FC<MapTabProps> = ({ type }) => {
  const mapRef = useRef<MapView>(null);
  const [calculatingRoutes, setCalculatingRoutes] = React.useState(false);
  const [vendorLocation, setVendorLocation] = useState<any | null>(null);
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

  // Directions error handler
  const handleDirectionsError = useCallback((error: any) => {
    console.log('Directions error:', error);
    setCalculatingRoutes(false);
  }, []);

  // Directions ready handler
  const handleDirectionsReady = useCallback(() => {
    setCalculatingRoutes(false);
  }, []);

  // Directions start handler
  const handleDirectionsStart = useCallback(() => {
    setCalculatingRoutes(true);
  }, []);

  // Optimized zoom levels for road and society visibility
  const getOptimalZoomLevel = useCallback(
    (coordinates: Coordinate[]): Region => {
      if (coordinates.length === 0) {
        return INDIA_REGION;
      }

      // For single coordinate - zoom level that shows nearby roads and societies
      if (coordinates.length === 1) {
        return {
          latitude: coordinates[0].latitude,
          longitude: coordinates[0].longitude,
          latitudeDelta: 0.01, // Optimal for seeing nearby roads and societies
          longitudeDelta: 0.01, // Shows about 1km area around the point
        };
      }

      // For multiple coordinates - calculate bounds
      const latitudes = coordinates.map(coord => coord.latitude);
      const longitudes = coordinates.map(coord => coord.longitude);

      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);

      // Calculate center
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      // Calculate deltas with optimal padding for road visibility
      let latDelta = (maxLat - minLat) * 1.3;
      let lngDelta = (maxLng - minLng) * 1.3;

      // Adjust for screen aspect ratio
      const screenAspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
      const coordinateAspectRatio = Math.abs(lngDelta / latDelta);

      if (coordinateAspectRatio > screenAspectRatio) {
        latDelta = lngDelta / screenAspectRatio;
      } else {
        lngDelta = latDelta * screenAspectRatio;
      }

      // Set optimal zoom levels for road visibility
      const MIN_DELTA = 0.02; // Close zoom - shows detailed roads
      const MAX_DELTA = 0.1; // Prevent over-zooming out

      // Ensure we have enough zoom to see roads and labels clearly
      const optimalLatDelta = Math.max(
        MIN_DELTA,
        Math.min(latDelta, MAX_DELTA),
      );
      const optimalLngDelta = Math.max(
        MIN_DELTA,
        Math.min(lngDelta, MAX_DELTA),
      );

      return {
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: optimalLatDelta,
        longitudeDelta: optimalLngDelta,
      };
    },
    [],
  );

  // Improved region calculation with optimal zoom for road visibility
  const calculateRegion = useMemo((): Region => {
    const coordinates: Coordinate[] = [];

    // Always include driver coordinate if available
    if (validDriverCoordinate) coordinates.push(validDriverCoordinate);

    switch (type) {
      case 'idle':
        // For idle state: driver and nearby drivers/customers
        validDriverLocations.forEach(coord => coordinates.push(coord));
        validCustomerLocations.forEach(coord => coordinates.push(coord));
        if (validVendorLocation) coordinates.push(validVendorLocation);
        break;

      case 'process':
        // For process state: driver and pickup location
        if (validPickupLocation) coordinates.push(validPickupLocation);
        break;

      case 'active':
        // For active state: driver, pickup, and destination
        if (validPickupLocation) coordinates.push(validPickupLocation);
        if (validDestinationLocation)
          coordinates.push(validDestinationLocation);
        break;
    }

    return getOptimalZoomLevel(coordinates);
  }, [
    type,
    validDriverCoordinate,
    validPickupLocation,
    validDestinationLocation,
    validDriverLocations,
    validCustomerLocations,
    validVendorLocation,
    getOptimalZoomLevel,
  ]);

  // Improved fitToCoordinates function with better zoom
  const fitToCoordinates = useCallback(
    (coordinates: Coordinate[]) => {
      const validCoords = coordinates.filter(coord => isValidCoordinate(coord));

      if (mapRef.current && validCoords.length > 0) {
        const optimalRegion = getOptimalZoomLevel(validCoords);
        mapRef.current.animateToRegion(optimalRegion, 1000);
      } else {
        // If no valid coordinates, use default India view with city-level zoom
        if (mapRef.current) {
          mapRef.current.animateToRegion(INDIA_REGION, 1000);
        }
      }
    },
    [getOptimalZoomLevel],
  );

  // Handle specific view based on type
  const handleFitToView = useCallback(() => {
    const coordinates: Coordinate[] = [];

    // Always include driver if available
    if (validDriverCoordinate) coordinates.push(validDriverCoordinate);

    switch (type) {
      case 'idle':
        validDriverLocations.forEach(coord => coordinates.push(coord));
        validCustomerLocations.forEach(coord => coordinates.push(coord));
        if (validVendorLocation) coordinates.push(validVendorLocation);
        break;

      case 'process':
        if (validPickupLocation) coordinates.push(validPickupLocation);
        break;

      case 'active':
        if (validPickupLocation) coordinates.push(validPickupLocation);
        if (validDestinationLocation)
          coordinates.push(validDestinationLocation);
        break;
    }

    fitToCoordinates(coordinates);
  }, [
    type,
    validDriverCoordinate,
    validPickupLocation,
    validDestinationLocation,
    validDriverLocations,
    validCustomerLocations,
    validVendorLocation,
    fitToCoordinates,
  ]);

  // Fit map to show all relevant markers with optimal zoom
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(calculateRegion, 1000);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [calculateRegion]);

  // Check if we have valid data to display for current type
  const hasDataForCurrentType = useMemo(() => {
    switch (type) {
      case 'idle':
        return (
          validDriverCoordinate !== null ||
          validDriverLocations.length > 0 ||
          validCustomerLocations.length > 0 ||
          validVendorLocation !== null
        );
      case 'process':
        return validDriverCoordinate !== null || validPickupLocation !== null;
      case 'active':
        return (
          validDriverCoordinate !== null ||
          validPickupLocation !== null ||
          validDestinationLocation !== null
        );
      default:
        return false;
    }
  }, [
    type,
    validDriverCoordinate,
    validPickupLocation,
    validDestinationLocation,
    validDriverLocations,
    validCustomerLocations,
    validVendorLocation,
  ]);

  // Function to render markers and routes based on trip type
  const renderMapContent = () => {
    if (!hasDataForCurrentType) {
      return (
        <Marker
          coordinate={{
            latitude: INDIA_REGION.latitude,
            longitude: INDIA_REGION.longitude,
          }}
          title="No Data Available"
          description={`No ${type} data to display`}
        />
      );
    }

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

  // Render for idle state - show vendor, livedriver, and customers with dashed routes
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
      {validCustomerLocations.map((coord, index) => (
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
      ))}

      {/* Routes from Live Driver to Nearby Customers - DASHED */}
      {validDriverCoordinate && validCustomerLocations.length > 0 && (
        <>
          {validCustomerLocations.map((customerCoord, index) => (
            <MapViewDirections
              key={`customer-route-${index}-${customerCoord.latitude}-${customerCoord.longitude}`}
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

  // Render for process state - show driver to pickup location with solid route
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

      {/* Route from Driver to Pickup - SOLID */}
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

  // Render for active state - show pickup to destination with driver navigation route
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

      {/* Main route from Pickup to Destination - SOLID */}
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

      {/* Route from Driver to Destination (Navigation) - DASHED */}
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

      {/* Existing route path from slice (if needed) */}
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
        onLayout={handleFitToView}
        onMapReady={handleFitToView}
      >
        {renderMapContent()}
      </MapView>

      {/* Loading Indicator */}
      {calculatingRoutes && (
        <View style={mapStyles.loadingContainer}>
          <Button mode="contained" loading disabled>
            Calculating Routes...
          </Button>
        </View>
      )}

      {/* Status Indicator */}
      {/* {!hasDataForCurrentType && (
        <View style={mapStyles.noDataContainer}>
          <View style={mapStyles.noDataMessage}>
            <Button icon="map-marker-question" mode="contained" disabled>
              No {type} data available
            </Button>
          </View>
        </View>
      )} */}
    </View>
  );
};

// Additional styles for new components
const mapStyles = StyleSheet.create({
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  fitButton: {
    backgroundColor: 'white',
    elevation: 4,
    borderRadius: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  noDataContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  noDataMessage: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default React.memo(MapTab);
