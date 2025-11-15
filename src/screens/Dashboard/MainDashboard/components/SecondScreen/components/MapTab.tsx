// components/MapTab.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { Dimensions, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';

// Assets
import DropMarker from '@assets/map/DropMarker';
import OriginMarker from '@assets/map/OriginMarker';
import Parcel from '@assets/map/parcel';
import Truck from '@assets/map/Truck';

// Utils & Styles
import { RootState } from '@store/index';
import { Coordinate } from '@store/slice/mapTypes';
import colors from '@utils/colors';
import { GOOGLE_MAPS_API_KEY } from '@utils/env';
import { Button } from 'react-native-paper';
import { INDIA_REGION, MAP_STYLE, TAB_CONFIG } from '../helper';
import { styles } from '../styles';

interface MapTabProps {
  type: keyof typeof TAB_CONFIG;
}

// Helper function to check if coordinates are valid
const isValidCoordinate = (coord: Coordinate | null): boolean => {
  if (!coord) return false;
  return (
    coord.latitude !== 0 &&
    coord.longitude !== 0 &&
    coord.latitude !== null &&
    coord.longitude !== null &&
    !isNaN(coord.latitude) &&
    !isNaN(coord.longitude) &&
    Math.abs(coord.latitude) <= 90 &&
    Math.abs(coord.longitude) <= 180
  );
};

// Get screen dimensions for better region calculation
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MapTab: React.FC<MapTabProps> = ({ type }) => {
  const mapRef = useRef<MapView>(null);

  // Get all map tab data from Redux store
  const mapTabData = useSelector((state: RootState) => state.mapTab);

  // Destructure the data for easier access
  const {
    driverCoordinate,
    originCoordinates,
    destinationCoordinates,
    nearbyParcels,
  } = mapTabData;

  console.log('Map Data:', {
    driverCoordinate,
    originCoordinates,
    destinationCoordinates,
    nearbyParcels,
    type,
  });

  // Filter active parcels with VALID coordinates only
  const activeParcels = useMemo(() => {
    if (type === 'idle') {
      return nearbyParcels.filter(
        (parcel: any) =>
          (parcel.status === 'available' || parcel.status === 'assigned') &&
          isValidCoordinate(parcel.coordinate),
      );
    }
    return [];
  }, [nearbyParcels, type]);

  // Get valid driver coordinate
  const validDriverCoordinate = useMemo(() => {
    return isValidCoordinate(driverCoordinate) ? driverCoordinate : null;
  }, [driverCoordinate]);

  // Get valid origin coordinates
  const validOriginCoordinates = useMemo(() => {
    return isValidCoordinate(originCoordinates) ? originCoordinates : null;
  }, [originCoordinates]);

  // Get valid destination coordinates
  const validDestinationCoordinates = useMemo(() => {
    return isValidCoordinate(destinationCoordinates)
      ? destinationCoordinates
      : null;
  }, [destinationCoordinates]);

  // Optimized zoom levels for road and society visibility
  const getOptimalZoomLevel = (coordinates: Coordinate[]): Region => {
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
    let latDelta = (maxLat - minLat) * 1.3; // Reduced padding for closer zoom
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
    const optimalLatDelta = Math.max(MIN_DELTA, Math.min(latDelta, MAX_DELTA));
    const optimalLngDelta = Math.max(MIN_DELTA, Math.min(lngDelta, MAX_DELTA));

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: optimalLatDelta,
      longitudeDelta: optimalLngDelta,
    };
  };

  // Improved region calculation with optimal zoom for road visibility
  const calculateRegion = (): Region => {
    const coordinates: Coordinate[] = [];

    // Always include driver coordinate if available
    if (validDriverCoordinate) coordinates.push(validDriverCoordinate);

    switch (type) {
      case 'idle':
        // For idle state: driver and nearby parcels
        activeParcels?.forEach(parcel => {
          if (isValidCoordinate(parcel.coordinate)) {
            coordinates.push(parcel.coordinate);
          }
        });
        break;

      case 'process':
        // For process state: driver and origin
        if (validOriginCoordinates) coordinates.push(validOriginCoordinates);
        break;

      case 'active':
        // For active state: driver, origin, and destination
        if (validOriginCoordinates) coordinates.push(validOriginCoordinates);
        if (validDestinationCoordinates)
          coordinates.push(validDestinationCoordinates);
        break;
    }

    return getOptimalZoomLevel(coordinates);
  };

  // Fit map to show all relevant markers with optimal zoom
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mapRef.current) {
        const region = calculateRegion();
        console.log('Animating to optimal region for road visibility:', region);
        mapRef.current.animateToRegion(region, 1000);
      }
    }, 500); // Increased delay to ensure map is fully ready

    return () => clearTimeout(timeoutId);
  }, [
    type,
    validDriverCoordinate,
    validOriginCoordinates,
    validDestinationCoordinates,
    activeParcels,
  ]);

  // Improved fitToCoordinates function with better zoom
  const fitToCoordinates = (coordinates: Coordinate[]) => {
    const validCoords = coordinates.filter(coord => isValidCoordinate(coord));

    if (mapRef.current && validCoords.length > 0) {
      const optimalRegion = getOptimalZoomLevel(validCoords);
      console.log('Fitting to optimal zoom:', optimalRegion);
      mapRef.current.animateToRegion(optimalRegion, 1000);
    } else {
      // If no valid coordinates, use default India view with city-level zoom
      if (mapRef.current) {
        mapRef.current.animateToRegion(INDIA_REGION, 1000);
      }
    }
  };

  // Handle specific view based on type
  const handleFitToView = () => {
    const coordinates: Coordinate[] = [];

    // Always include driver if available
    if (validDriverCoordinate) coordinates.push(validDriverCoordinate);

    switch (type) {
      case 'idle':
        activeParcels.forEach(parcel => {
          if (isValidCoordinate(parcel.coordinate)) {
            coordinates.push(parcel.coordinate);
          }
        });
        break;

      case 'process':
        if (validOriginCoordinates) coordinates.push(validOriginCoordinates);
        break;

      case 'active':
        if (validOriginCoordinates) coordinates.push(validOriginCoordinates);
        if (validDestinationCoordinates)
          coordinates.push(validDestinationCoordinates);
        break;
    }

    console.log('Fitting to coordinates with road-visible zoom:', coordinates);
    fitToCoordinates(coordinates);
  };

  // Check if we have valid data to display for current type
  const hasDataForCurrentType = useMemo(() => {
    switch (type) {
      case 'idle':
        return validDriverCoordinate !== null || activeParcels.length > 0;
      case 'process':
        return (
          validDriverCoordinate !== null || validOriginCoordinates !== null
        );
      case 'active':
        return (
          validDriverCoordinate !== null ||
          validOriginCoordinates !== null ||
          validDestinationCoordinates !== null
        );
      default:
        return false;
    }
  }, [
    type,
    validDriverCoordinate,
    validOriginCoordinates,
    validDestinationCoordinates,
    activeParcels,
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

  // Render for idle state - show driver location and nearby parcels ONLY
  const renderIdleState = () => (
    <>
      {/* Driver/Truck Marker */}
      {validDriverCoordinate && (
        <Marker
          key={`driver-${validDriverCoordinate.latitude}-${validDriverCoordinate.longitude}`}
          coordinate={validDriverCoordinate}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={900}
          tracksViewChanges={false}
        >
          <View style={{ transform: [{ rotate: `${180}deg` }] }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Truck height={70} width={70} />
            </View>
          </View>
        </Marker>
      )}

      {/* Nearby Parcels Markers - Only valid coordinates */}
      {activeParcels.map(
        (parcel: any) =>
          isValidCoordinate(parcel.coordinate) && (
            <Marker
              key={`parcel-${parcel.id}`}
              coordinate={parcel.coordinate}
              flat
              anchor={{ x: 0.5, y: 0.5 }}
              zIndex={800}
              tracksViewChanges={false}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Parcel height={60} width={60} />
              </View>
            </Marker>
          ),
      )}

      {/* Routes from Driver to Nearby Parcels - ONLY valid routes */}
      {validDriverCoordinate && activeParcels.length > 0 && (
        <>
          {activeParcels.map(
            (parcel: any) =>
              isValidCoordinate(parcel.coordinate) && (
                <MapViewDirections
                  key={`parcel-route-${parcel.id}`}
                  origin={validDriverCoordinate}
                  destination={parcel.coordinate}
                  apikey={GOOGLE_MAPS_API_KEY}
                  strokeWidth={3}
                  strokeColor={colors.accent}
                  strokeColors={[colors.accent]}
                  lineDashPattern={[5, 5]}
                  lineCap="round"
                  lineJoin="round"
                  precision="high"
                />
              ),
          )}
        </>
      )}
    </>
  );

  // Render for process state - show driver to origin route ONLY
  const renderProcessState = () => (
    <>
      {/* Origin Marker */}
      {validOriginCoordinates && (
        <Marker
          key={`origin-${validOriginCoordinates.latitude}-${validOriginCoordinates.longitude}`}
          coordinate={validOriginCoordinates}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={700}
          tracksViewChanges={false}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <OriginMarker size={45} />
          </View>
        </Marker>
      )}

      {/* Driver/Truck Marker */}
      {validDriverCoordinate && (
        <Marker
          key={`driver-${validDriverCoordinate.latitude}-${validDriverCoordinate.longitude}`}
          coordinate={validDriverCoordinate}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={900}
          tracksViewChanges={false}
        >
          <View style={{ transform: [{ rotate: `${180}deg` }] }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Truck height={70} width={70} />
            </View>
          </View>
        </Marker>
      )}

      {/* Route from Driver to Origin - ONLY if both coordinates are valid */}
      {validDriverCoordinate && validOriginCoordinates && (
        <MapViewDirections
          key="pickup-route"
          origin={validDriverCoordinate}
          destination={validOriginCoordinates}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={8}
          strokeColor={colors.primary}
          strokeColors={[colors.primary]}
          lineCap="round"
          lineJoin="round"
          precision="high"
        />
      )}
    </>
  );

  // Render for active state - show origin to destination route with driver navigation ONLY
  const renderActiveState = () => (
    <>
      {/* Origin Marker */}
      {validOriginCoordinates && (
        <Marker
          key={`origin-${validOriginCoordinates.latitude}-${validOriginCoordinates.longitude}`}
          coordinate={validOriginCoordinates}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={700}
          tracksViewChanges={false}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <OriginMarker size={45} />
          </View>
        </Marker>
      )}

      {/* Destination Marker */}
      {validDestinationCoordinates && (
        <Marker
          key={`destination-${validDestinationCoordinates.latitude}-${validDestinationCoordinates.longitude}`}
          coordinate={validDestinationCoordinates}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={700}
          tracksViewChanges={false}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <DropMarker size={45} />
          </View>
        </Marker>
      )}

      {/* Driver/Truck Marker */}
      {validDriverCoordinate && (
        <Marker
          key={`driver-${validDriverCoordinate.latitude}-${validDriverCoordinate.longitude}`}
          coordinate={validDriverCoordinate}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          zIndex={900}
          tracksViewChanges={false}
        >
          <View style={{ transform: [{ rotate: `${180}deg` }] }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Truck height={50} width={50} />
            </View>
          </View>
        </Marker>
      )}

      {/* Route from Origin to Destination - Main route */}
      {validOriginCoordinates && validDestinationCoordinates && (
        <MapViewDirections
          key="delivery-route"
          origin={validOriginCoordinates}
          destination={validDestinationCoordinates}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={6}
          strokeColor={colors.primary}
          strokeColors={[colors.primary]}
          lineCap="round"
          lineJoin="round"
          precision="high"
        />
      )}

      {/* Route from Driver to Destination (Navigation) */}
      {validDriverCoordinate && validDestinationCoordinates && (
        <MapViewDirections
          key="navigation-route"
          origin={validDriverCoordinate}
          destination={validDestinationCoordinates}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={4}
          strokeColor={colors.success}
          strokeColors={[colors.success]}
          lineDashPattern={[2, 3]}
          lineCap="round"
          lineJoin="round"
          precision="high"
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
        mapType="standard" // Use standard for better label visibility
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
        showsTraffic={false} // Disable traffic for cleaner view
        showsScale={true} // Show scale for reference
        showsBuildings={true} // Show buildings for context
        customMapStyle={MAP_STYLE} // Ensure map style doesn't hide labels
        moveOnMarkerPress={false}
        toolbarEnabled={false}
        onLayout={handleFitToView}
        onMapReady={handleFitToView}
      >
        {renderMapContent()}
      </MapView>

      {/* Status Indicator */}
      {!hasDataForCurrentType && (
        <View style={styles.noDataContainer}>
          <View style={styles.noDataMessage}>
            <Button icon="map-marker-question" mode="contained" disabled>
              No {type} data available
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default MapTab;
