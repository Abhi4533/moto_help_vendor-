// // components/MapTab.tsx
// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from 'react';
// import { Dimensions, StyleSheet, View } from 'react-native';
// import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import { useSelector } from 'react-redux';

// // Assets
// import DropMarker from '@assets/map/DropMarker';
// import OriginMarker from '@assets/map/OriginMarker';
// import Parcel from '@assets/map/parcel';
// import Truck from '@assets/map/Truck';

// // Utils & Styles
// import { ENV } from '@config/env';
// import { COLORS } from '@config/theme';
// import { useDashboard } from '@screens/Dashboard/Layout/DashboardContext';
// import { RootState } from '@store/index';
// import { Coordinate } from '@store/slices/mapSlice';
// import { INDIA_REGION, MAP_STYLE } from '@utils/mapHelper';
// import { Button } from 'react-native-paper';
// import { isValidCoordinate } from '../helper';

// // Get screen dimensions for better region calculation
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// const ASPECT_RATIO = SCREEN_WIDTH / SCREEN_HEIGHT;

// const MapTab = () => {
//   const { selectedTab: type } = useDashboard();
//   const mapRef = useRef<MapView>(null);
//   const [calculatingRoutes, setCalculatingRoutes] = useState(false);

//   // Extract map state from Redux using your existing slice
//   const {
//     pickupLocation,
//     destinationLocation,
//     liveDriverLocation,
//     driverLocations,
//     customerLocations,
//     routePath,
//     vendorLocation,
//   } = useSelector((state: RootState) => state.map);
//   console.log({ vendorLocation });

//   // Get valid coordinates
//   const validDriverCoordinate = useMemo(() => {
//     return isValidCoordinate(liveDriverLocation) ? liveDriverLocation : null;
//   }, [liveDriverLocation]);

//   const validPickupLocation = useMemo(() => {
//     return isValidCoordinate(pickupLocation) ? pickupLocation : null;
//   }, [pickupLocation]);

//   const validDestinationLocation = useMemo(() => {
//     return isValidCoordinate(destinationLocation) ? destinationLocation : null;
//   }, [destinationLocation]);

//   const validVendorLocation = useMemo(() => {
//     return isValidCoordinate(vendorLocation) ? vendorLocation : null;
//   }, [vendorLocation]);

//   // Filter valid driver locations
//   const validDriverLocations = useMemo(() => {
//     return driverLocations.filter(coord => isValidCoordinate(coord));
//   }, [driverLocations]);

//   // Filter valid customer locations
//   const validCustomerLocations = useMemo(() => {
//     return customerLocations?.filter(coord => isValidCoordinate(coord));
//   }, [customerLocations]);

//   // Collect ALL coordinates including route waypoints
//   const getAllCoordinates = useCallback((): Coordinate[] => {
//     const allCoords: Coordinate[] = [];

//     // Helper to add unique coordinates
//     const addCoordinate = (coord: Coordinate) => {
//       if (isValidCoordinate(coord)) {
//         const exists = allCoords.some(
//           c => c.latitude === coord.latitude && c.longitude === coord.longitude,
//         );
//         if (!exists) {
//           allCoords.push(coord);
//         }
//       }
//     };

//     // Add all marker coordinates based on type
//     switch (type) {
//       case 'idle':
//         if (validVendorLocation) addCoordinate(validVendorLocation);
//         if (validDriverCoordinate) addCoordinate(validDriverCoordinate);
//         validDriverLocations.forEach(addCoordinate);
//         validCustomerLocations?.forEach(addCoordinate);

//         // Add route waypoints from driver to customers
//         if (validDriverCoordinate && validCustomerLocations?.length > 0) {
//           validCustomerLocations?.forEach(customerCoord => {
//             // Add intermediate points from directions (we'll calculate these below)
//             const midPoint = {
//               latitude:
//                 (validDriverCoordinate.latitude + customerCoord.latitude) / 2,
//               longitude:
//                 (validDriverCoordinate.longitude + customerCoord.longitude) / 2,
//               rotation: 0,
//             };
//             addCoordinate(midPoint);
//           });
//         }
//         break;

//       case 'process':
//         if (validPickupLocation) addCoordinate(validPickupLocation);
//         if (validDriverCoordinate) addCoordinate(validDriverCoordinate);

//         // Add midpoint for route
//         if (validDriverCoordinate && validPickupLocation) {
//           const midPoint = {
//             latitude:
//               (validDriverCoordinate.latitude + validPickupLocation.latitude) /
//               2,
//             longitude:
//               (validDriverCoordinate.longitude +
//                 validPickupLocation.longitude) /
//               2,
//             rotation: 0,
//           };
//           addCoordinate(midPoint);
//         }
//         break;

//       case 'active':
//         if (validPickupLocation) addCoordinate(validPickupLocation);
//         if (validDestinationLocation) addCoordinate(validDestinationLocation);
//         if (validDriverCoordinate) addCoordinate(validDriverCoordinate);

//         // Add midpoints for both routes
//         if (validPickupLocation && validDestinationLocation) {
//           const routeMidPoint = {
//             latitude:
//               (validPickupLocation.latitude +
//                 validDestinationLocation.latitude) /
//               2,
//             longitude:
//               (validPickupLocation.longitude +
//                 validDestinationLocation.longitude) /
//               2,
//             rotation: 0,
//           };
//           addCoordinate(routeMidPoint);
//         }

//         if (validDriverCoordinate && validDestinationLocation) {
//           const navMidPoint = {
//             latitude:
//               (validDriverCoordinate.latitude +
//                 validDestinationLocation.latitude) /
//               2,
//             longitude:
//               (validDriverCoordinate.longitude +
//                 validDestinationLocation.longitude) /
//               2,
//             rotation: 0,
//           };
//           addCoordinate(navMidPoint);
//         }
//         break;
//     }

//     // Add route path coordinates
//     routePath.filter(isValidCoordinate).forEach(addCoordinate);

//     return allCoords;
//   }, [
//     type,
//     validDriverCoordinate,
//     validPickupLocation,
//     validDestinationLocation,
//     validVendorLocation,
//     validDriverLocations,
//     validCustomerLocations,
//     routePath,
//   ]);

//   // Improved fit using fitToCoordinates method
//   const fitToMarkersAndRoutes = useCallback(() => {
//     const coordinates = getAllCoordinates();

//     if (coordinates.length === 0) {
//       mapRef.current?.animateToRegion(INDIA_REGION, 1000);
//       return;
//     }

//     console.log('Fitting to', coordinates.length, 'coordinates');

//     // Use fitToCoordinates for better fitting
//     mapRef.current?.fitToCoordinates(coordinates, {
//       edgePadding: {
//         top: 100,
//         right: 100,
//         bottom: 100,
//         left: 100,
//       },
//       animated: true,
//     });
//   }, [getAllCoordinates]);

//   // Handle directions ready to capture coordinates
//   const handleDirectionsReady = useCallback(
//     (result: any) => {
//       setCalculatingRoutes(false);
//       // Extract coordinates from the route
//       if (result?.coordinates && Array.isArray(result.coordinates)) {
//         // Refit after getting route coordinates
//         setTimeout(fitToMarkersAndRoutes, 500);
//       }
//     },
//     [fitToMarkersAndRoutes],
//   );

//   const handleDirectionsError = useCallback((error: any) => {
//     console.log('Directions error:', error);
//     setCalculatingRoutes(false);
//   }, []);

//   const handleDirectionsStart = useCallback(() => {
//     setCalculatingRoutes(true);
//   }, []);

//   // Auto-fit when important data changes
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fitToMarkersAndRoutes();
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [
//     type,
//     validDriverCoordinate,
//     validPickupLocation,
//     validDestinationLocation,
//     validVendorLocation,
//     validDriverLocations.length,
//     validCustomerLocations?.length,
//     fitToMarkersAndRoutes,
//   ]);

//   // Function to render markers and routes based on trip type
//   const renderMapContent = () => {
//     switch (type) {
//       case 'idle':
//         return renderIdleState();
//       case 'process':
//         return renderProcessState();
//       case 'active':
//         return renderActiveState();
//       default:
//         return null;
//     }
//   };

//   // Render for idle state
//   const renderIdleState = () => (
//     <>
//       {/* Vendor Marker */}
//       {validVendorLocation && (
//         <Marker
//           coordinate={validVendorLocation}
//           flat
//           anchor={{ x: 0.5, y: 0.5 }}
//           zIndex={600}
//           tracksViewChanges={false}
//         >
//           <OriginMarker size={34} />
//         </Marker>
//       )}

//       {/* Live Driver Marker */}
//       {validDriverCoordinate && (
//         <Marker
//           coordinate={validDriverCoordinate}
//           flat
//           anchor={{ x: 0.5, y: 0.5 }}
//           zIndex={900}
//           tracksViewChanges={false}
//         >
//           <View style={{ transform: [{ rotate: `${180}deg` }] }}>
//             <Truck width={42} height={42} />
//           </View>
//         </Marker>
//       )}

//       {/* Multiple Driver Markers */}
//       {validDriverLocations.map((coord, index) => (
//         <Marker
//           key={`driver-${index}-${coord.latitude}-${coord.longitude}`}
//           coordinate={coord}
//           flat
//           anchor={{ x: 0.5, y: 0.5 }}
//           zIndex={800}
//           tracksViewChanges={false}
//         >
//           <Truck width={42} height={42} />
//         </Marker>
//       ))}

//       {/* Customer Markers */}
//       {validCustomerLocations?.map((coord, index) => {
//         console.log(`Rendering customer ${index}:`, coord);
//         return (
//           <Marker
//             key={`customer-${index}-${coord.latitude}-${coord.longitude}`}
//             coordinate={coord}
//             flat
//             anchor={{ x: 0.5, y: 0.5 }}
//             zIndex={700}
//             tracksViewChanges={false}
//           >
//             <Parcel width={34} height={34} />
//           </Marker>
//         );
//       })}

//       {/* Routes from Live Driver to Nearby Customers */}
//       {validDriverCoordinate && validCustomerLocations?.length > 0 && (
//         <>
//           {validCustomerLocations?.map((customerCoord, index) => (
//             <MapViewDirections
//               key={`customer-route-${index}`}
//               origin={validDriverCoordinate}
//               destination={customerCoord}
//               apikey={ENV.MAP_API_KEY}
//               strokeWidth={3}
//               strokeColor={'#FF9500'}
//               lineDashPattern={[5, 5]}
//               lineCap="round"
//               lineJoin="round"
//               precision="high"
//               onStart={handleDirectionsStart}
//               onReady={handleDirectionsReady}
//               onError={handleDirectionsError}
//               timePrecision="now"
//               mode="DRIVING"
//             />
//           ))}
//         </>
//       )}
//     </>
//   );

//   // Render for process state
//   const renderProcessState = () => (
//     <>
//       {/* Pickup Marker */}
//       {validPickupLocation && (
//         <Marker
//           coordinate={validPickupLocation}
//           flat
//           anchor={{ x: 0.5, y: 0.5 }}
//           zIndex={700}
//           tracksViewChanges={false}
//         >
//           <Parcel width={38} height={38} />
//         </Marker>
//       )}

//       {/* Live Driver Marker */}
//       {validDriverCoordinate && (
//         <Marker
//           coordinate={validDriverCoordinate}
//           flat
//           anchor={{ x: 0.5, y: 0.5 }}
//           zIndex={900}
//           tracksViewChanges={false}
//         >
//           <View style={{ transform: [{ rotate: `${180}deg` }] }}>
//             <Truck width={70} height={70} />
//           </View>
//         </Marker>
//       )}

//       {/* Route from Driver to Pickup */}
//       {validDriverCoordinate && validPickupLocation && (
//         <MapViewDirections
//           key="pickup-route"
//           origin={validDriverCoordinate}
//           destination={validPickupLocation}
//           apikey={ENV.MAP_API_KEY}
//           strokeWidth={8}
//           strokeColor={COLORS.primary}
//           lineCap="round"
//           lineJoin="round"
//           precision="high"
//           onStart={handleDirectionsStart}
//           onReady={handleDirectionsReady}
//           onError={handleDirectionsError}
//           timePrecision="now"
//           mode="DRIVING"
//         />
//       )}
//     </>
//   );

//   // Render for active state
//   const renderActiveState = () => (
//     <>
//       {/* Pickup Marker */}
//       {validPickupLocation && (
//         <Marker
//           coordinate={validPickupLocation}
//           flat
//           anchor={{ x: 0.5, y: 0.5 }}
//           zIndex={700}
//           tracksViewChanges={false}
//         >
//           <Parcel width={38} height={38} />
//         </Marker>
//       )}

//       {/* Destination Marker */}
//       {validDestinationLocation && (
//         <Marker
//           coordinate={validDestinationLocation}
//           flat
//           anchor={{ x: 0.5, y: 0.5 }}
//           zIndex={700}
//           tracksViewChanges={false}
//         >
//           <DropMarker size={38} />
//         </Marker>
//       )}

//       {/* Live Driver Marker */}
//       {validDriverCoordinate && (
//         <Marker
//           coordinate={validDriverCoordinate}
//           flat
//           anchor={{ x: 0.5, y: 0.5 }}
//           zIndex={900}
//           tracksViewChanges={false}
//         >
//           <View style={{ transform: [{ rotate: `${180}deg` }] }}>
//             <Truck width={50} height={50} />
//           </View>
//         </Marker>
//       )}

//       {/* Main route from Pickup to Destination */}
//       {validPickupLocation && validDestinationLocation && (
//         <MapViewDirections
//           key="delivery-route"
//           origin={validPickupLocation}
//           destination={validDestinationLocation}
//           apikey={ENV.MAP_API_KEY}
//           strokeWidth={6}
//           strokeColor={COLORS.primary}
//           lineCap="round"
//           lineJoin="round"
//           precision="high"
//           onStart={handleDirectionsStart}
//           onReady={handleDirectionsReady}
//           onError={handleDirectionsError}
//           timePrecision="now"
//           mode="DRIVING"
//         />
//       )}

//       {/* Route from Driver to Destination */}
//       {validDriverCoordinate && validDestinationLocation && (
//         <MapViewDirections
//           key="navigation-route"
//           origin={validDriverCoordinate}
//           destination={validDestinationLocation}
//           apikey={ENV.MAP_API_KEY}
//           strokeWidth={4}
//           strokeColor={'#4CD964'}
//           lineDashPattern={[2, 3]}
//           lineCap="round"
//           lineJoin="round"
//           precision="high"
//           onStart={handleDirectionsStart}
//           onReady={handleDirectionsReady}
//           onError={handleDirectionsError}
//           timePrecision="now"
//           mode="DRIVING"
//         />
//       )}

//       {/* Existing route path */}
//       {routePath.length > 1 && (
//         <Polyline
//           coordinates={routePath}
//           strokeWidth={5}
//           strokeColor="#007AFF"
//           lineCap="round"
//           lineJoin="round"
//         />
//       )}
//     </>
//   );

//   return (
//     <View style={styles.mapContainer}>
//       <MapView
//         ref={mapRef}
//         initialRegion={INDIA_REGION}
//         showsUserLocation={false}
//         showsMyLocationButton={false}
//         mapType="standard"
//         zoomControlEnabled={true}
//         zoomEnabled={true}
//         zoomTapEnabled={true}
//         scrollEnabled={true}
//         pitchEnabled={false}
//         rotateEnabled={true}
//         style={{ flex: 1 }}
//         provider={PROVIDER_GOOGLE}
//         showsCompass={true}
//         showsIndoors={false}
//         showsIndoorLevelPicker={false}
//         showsTraffic={false}
//         showsScale={true}
//         showsBuildings={true}
//         customMapStyle={MAP_STYLE}
//         moveOnMarkerPress={false}
//         toolbarEnabled={false}
//         onLayout={fitToMarkersAndRoutes}
//         onMapReady={fitToMarkersAndRoutes}
//         maxZoomLevel={13} // set your max zoom
//         minZoomLevel={5} // optional: set min zoom
//       >
//         {renderMapContent()}
//       </MapView>

//       {/* Loading Indicator */}
//       {calculatingRoutes && (
//         <View style={styles.loadingContainer}>
//           <Button mode="contained" loading disabled>
//             Calculating Routes...
//           </Button>
//         </View>
//       )}
//     </View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   mapContainer: {
//     flex: 1,
//     position: 'relative' as const,
//   },
//   mapControls: {
//     position: 'absolute',
//     top: 16,
//     right: 16,
//   },
//   fitButton: {
//     backgroundColor: 'white',
//     elevation: 8,
//     borderRadius: 25,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   loadingContainer: {
//     position: 'absolute',
//     top: 16,
//     left: 16,
//     right: 16,
//     alignItems: 'center',
//   },
// });

// export default React.memo(MapTab);

import DropMarker from '@assets/map/DropMarker';
import OriginMarker from '@assets/map/OriginMarker';
import Parcel from '@assets/map/parcel';
import Truck from '@assets/map/Truck';
import { ENV } from '@config/env';
import { RootState } from '@store/index';
import { INDIA_REGION, MAP_STYLE } from '@utils/mapHelper';

import React, { FC, useEffect, useRef } from 'react';
import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';

const MapTab: FC = () => {
  const mapRef = useRef<MapView>(null);
  const {
    customerLocations,
    destinationLocation,
    driverLocations,
    liveDriverLocation,
    pickupLocation,
    vendorLocation,
  } = useSelector((state: RootState) => state.map);

  // AUTO FIT MAP TO DRIVER LOCATION
  useEffect(() => {
    if (!mapRef.current) return;

    const coordinates: { latitude: number; longitude: number }[] = [];
    if (pickupLocation?.latitude) {
      coordinates.push({
        latitude: pickupLocation.latitude,
        longitude: pickupLocation.longitude,
      });
    }
    // Driver location
    if (liveDriverLocation?.latitude && liveDriverLocation?.longitude) {
      coordinates.push({
        latitude: liveDriverLocation.latitude,
        longitude: liveDriverLocation.longitude,
      });
    }

    // Load nearby drivers
    if (driverLocations?.length) {
      customerLocations.forEach(item => {
        if (item?.latitude && item?.longitude) {
          coordinates.push({
            latitude: Number(item.latitude),
            longitude: Number(item.longitude),
          });
        }
      });
    }

    if (destinationLocation?.latitude) {
      coordinates.push({
        latitude: destinationLocation.latitude,
        longitude: destinationLocation.longitude,
      });
    }

    // Fit map only if we have at least one coordinate
    if (coordinates.length === 1) {
      // Single marker → normal zoom
      mapRef.current.animateCamera(
        {
          center: coordinates[0],
          zoom: 15,
        },
        { duration: 800 },
      );
    } else if (coordinates.length > 1) {
      // Multiple markers → fit all
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 80,
          right: 80,
          bottom: 200,
          left: 80,
        },
        animated: true,
      });
    }
  }, [
    liveDriverLocation,
    driverLocations,
    pickupLocation,
    destinationLocation,
  ]);

  return (
    <>
      <View style={{ flex: 1, position: 'relative' }}>
        <MapView
          ref={mapRef}
          initialRegion={INDIA_REGION}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          mapType="standard"
          customMapStyle={MAP_STYLE}
          showsUserLocation={false}
          toolbarEnabled={false}
          moveOnMarkerPress={false}
          zoomEnabled
          zoomControlEnabled
          maxZoomLevel={18}
          minZoomLevel={4}
        >
          {liveDriverLocation?.latitude && (
            <Marker
              coordinate={liveDriverLocation || { latitude: 0, longitude: 0 }}
              anchor={{ x: 0.5, y: 0.5 }}
              flat
              tracksViewChanges={false}
              rotation={Number(liveDriverLocation.rotation)}
            >
              <Truck height={50} width={50} />
            </Marker>
          )}
          {liveDriverLocation?.latitude &&
            customerLocations?.length &&
            customerLocations?.map((item, index) => (
              <Marker
                coordinate={{
                  latitude: Number(item?.latitude) || 0,
                  longitude: Number(item?.longitude) || 0,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
                flat
                tracksViewChanges={false}
                key={index}
              >
                <Parcel height={50} width={50} />
                {/* <Truck height={50} width={50} /> */}
              </Marker>
            ))}

          {pickupLocation?.latitude && liveDriverLocation?.latitude && (
            <>
              <Marker
                coordinate={{
                  latitude: pickupLocation?.latitude! || 0,
                  longitude: pickupLocation?.longitude! || 0,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
                flat
                tracksViewChanges={false}
              >
                <OriginMarker size={30} />
              </Marker>
              <MapViewDirections
                origin={{
                  latitude: liveDriverLocation?.latitude! || 0,
                  longitude: liveDriverLocation?.longitude! || 0,
                }}
                destination={{
                  latitude: pickupLocation?.latitude!,
                  longitude: pickupLocation?.longitude!,
                }}
                apikey={ENV.MAP_API_KEY}
                strokeWidth={5}
                strokeColor="hotpink"
                mode="TRANSIT"
                resetOnChange
              />
            </>
          )}

          {destinationLocation?.latitude && pickupLocation?.longitude && (
            <>
              <Marker
                coordinate={{
                  latitude: destinationLocation?.latitude! || 0,
                  longitude: destinationLocation?.longitude! || 0,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
                flat
                tracksViewChanges={false}
              >
                <DropMarker size={20} />
              </Marker>
              <MapViewDirections
                origin={{
                  latitude: pickupLocation?.latitude! || 0,
                  longitude: pickupLocation?.longitude! || 0,
                }}
                destination={{
                  latitude: destinationLocation?.latitude! || 0,
                  longitude: destinationLocation?.longitude! || 0,
                }}
                apikey={ENV.MAP_API_KEY}
                strokeWidth={5}
                strokeColor="hotpink"
              />
            </>
          )}
        </MapView>
      </View>
    </>
  );
};

export default MapTab;
