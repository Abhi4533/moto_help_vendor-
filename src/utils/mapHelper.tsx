import { Coordinate } from '@store/slices/mapSlice';
import { Dimensions } from 'react-native';
import { Region } from 'react-native-maps';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// helper.ts
export const TAB_CONFIG = {
  idle: {
    title: 'Available Drivers',
    color: '#4CAF50',
    tripsKey: 'idle',
    description: 'Drivers currently available for assignments',
  },
  process: {
    title: 'In Process',
    color: '#FF9800',
    tripsKey: 'process',
    description: 'Drivers with ongoing loading/unloading processes',
  },
  active: {
    title: 'Active Trips',
    color: '#2196F3',
    tripsKey: 'active',
    description: 'Drivers currently on active trips',
  },
  complete: {
    title: 'Completed Trips',
    color: '#9C27B0',
    tripsKey: 'complete',
    description: 'Drivers with recently completed trips',
  },
} as const;

// Uber/Ola grayscale map style
export const MAP_STYLE = [
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

export const INDIA_REGION: Region = {
  latitude: 20.5937, // Center of India
  longitude: 78.9629,
  latitudeDelta: 25, // Wide view to show entire India
  longitudeDelta: 25,
};

export const isValidCoordinate = (coord: Coordinate | null): boolean => {
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

export const getOptimalZoomLevel = (coordinates: Coordinate[]): Region => {
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

export const fitToCoordinates = (coordinates: Coordinate[], mapRef: any) => {
  const validCoords = coordinates.filter(coord => isValidCoordinate(coord));

  if (mapRef.current && validCoords.length > 0) {
    const optimalRegion = getOptimalZoomLevel(validCoords);
    mapRef.current.animateToRegion(optimalRegion, 1000);
  } else {
    if (mapRef.current) {
      mapRef.current.animateToRegion(INDIA_REGION, 1000);
    }
  }
};
