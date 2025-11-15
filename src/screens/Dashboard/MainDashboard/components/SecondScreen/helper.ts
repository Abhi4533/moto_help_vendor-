import { Region } from 'react-native-maps';

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
