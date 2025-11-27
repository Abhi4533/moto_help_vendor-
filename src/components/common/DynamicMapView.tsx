// src/components/map/DynamicMapView.tsx
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const DynamicMapView = () => {
  const mapRef = useRef<MapView>(null);

  const {
    vendorLocation,
    driverLocations,
    customerLocations,
    pickupLocation,
    destinationLocation,
    routePath,
  } = useSelector((state: RootState) => state.map);

  // 🚀 Auto-Fit whenever coordinates change
  useEffect(() => {
    const allCoordinates: any = [
      vendorLocation,
      pickupLocation,
      destinationLocation,
      ...driverLocations,
      ...customerLocations,
      ...routePath,
    ].filter(Boolean); // remove null

    if (allCoordinates?.length > 0 && mapRef.current) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(allCoordinates, {
          edgePadding: { top: 120, right: 120, bottom: 120, left: 120 },
          animated: true,
        });
      }, 500);
    }
  }, [
    vendorLocation,
    driverLocations,
    customerLocations,
    pickupLocation,
    destinationLocation,
    routePath,
  ]);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={styles.map}>
        {/* Vendor */}
        {vendorLocation && (
          <Marker coordinate={vendorLocation} pinColor="blue" title="Vendor" />
        )}

        {/* Drivers */}
        {driverLocations.map((d, i) => (
          <Marker
            key={i}
            coordinate={d}
            pinColor="green"
            title={`Driver ${i + 1}`}
          />
        ))}

        {/* Customers */}
        {customerLocations.map((c, i) => (
          <Marker
            key={`c-${i}`}
            coordinate={c}
            pinColor="orange"
            title="Customer"
          />
        ))}

        {/* Pickup */}
        {pickupLocation && (
          <Marker
            coordinate={pickupLocation}
            pinColor="purple"
            title="Pickup"
          />
        )}

        {/* Destination */}
        {destinationLocation && (
          <Marker
            coordinate={destinationLocation}
            pinColor="red"
            title="Destination"
          />
        )}

        {/* Route Path */}
        {routePath.length > 0 && (
          <Polyline coordinates={routePath} strokeWidth={4} />
        )}
      </MapView>
    </View>
  );
};

export default DynamicMapView;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
