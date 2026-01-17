// components/MapTab.tsx

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { useSelector } from 'react-redux';

import DropMarker from '@assets/map/DropMarker';
import OriginMarker from '@assets/map/OriginMarker';
import Truck from '@assets/map/Truck';
import Parcel from '@assets/map/parcel';

import { ENV } from '@config/env';
import { RootState } from '@store/index';
import { INDIA_REGION, MAP_STYLE } from '@utils/mapHelper';

type Coord = { latitude: number; longitude: number };

const isValid = (c?: Coord | null) =>
  !!c && typeof c.latitude === 'number' && typeof c.longitude === 'number';

const MapTab: FC = () => {
  const mapRef = useRef<MapView>(null);
  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);

  const {
    liveDriverLocation,
    customerLocations,
    pickupLocation,
    destinationLocation,
  } = useSelector((state: RootState) => state.map);

  /** 🔹 Collect ALL coordinates for perfect fit */
  const fitAll = useCallback(() => {
    if (!mapRef.current) return;

    const coords: Coord[] = [];

    if (isValid(liveDriverLocation)) coords.push(liveDriverLocation!);
    if (isValid(pickupLocation)) coords.push(pickupLocation!);
    if (isValid(destinationLocation)) coords.push(destinationLocation!);

    customerLocations?.forEach(c => {
      if (isValid(c)) coords.push(c);
    });

    routeCoords.forEach(c => coords.push(c));

    if (coords.length === 0) {
      mapRef.current.animateToRegion(INDIA_REGION, 800);
      return;
    }

    if (coords.length === 1) {
      mapRef.current.animateCamera(
        { center: coords[0], zoom: 16 },
        { duration: 700 },
      );
      return;
    }

    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 100, right: 100, bottom: 250, left: 100 },
      animated: true,
    });
  }, [
    liveDriverLocation,
    pickupLocation,
    destinationLocation,
    customerLocations,
    routeCoords,
  ]);

  /** 🔹 Refocus when data changes */
  useEffect(() => {
    const t = setTimeout(fitAll, 600);
    return () => clearTimeout(t);
  }, [fitAll]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={INDIA_REGION}
        customMapStyle={MAP_STYLE}
        zoomEnabled
        rotateEnabled
        pitchEnabled={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        onMapReady={fitAll}
      >
        {/* 🚚 Driver */}
        {isValid(liveDriverLocation) && (

          <Marker coordinate={liveDriverLocation!} rotation={liveDriverLocation?.rotation} flat>
            <Truck width={50} height={50} />
          </Marker>
        )}

        {/* 📦 Customers */}
        {customerLocations?.map(
          (c, i) =>
            isValid(c) && (
              <Marker key={`c-${i}`} coordinate={c}>
                <Parcel width={36} height={36} />
              </Marker>
            ),
        )}

        {/* 📍 Pickup */}
        {isValid(pickupLocation) && (
          <Marker coordinate={pickupLocation!}>
            <OriginMarker size={34} />
          </Marker>
        )}

        {/* 🎯 Destination */}
        {isValid(destinationLocation) && (
          <Marker coordinate={destinationLocation!}>
            <DropMarker size={34} />
          </Marker>
        )}

        {/* 🧭 Driver → Pickup */}
        {isValid(liveDriverLocation) && isValid(pickupLocation) && (
          <MapViewDirections
            origin={liveDriverLocation!}
            destination={pickupLocation!}
            apikey={ENV.MAP_API_KEY}
            strokeWidth={5}
            strokeColor="#FF9500"
            mode="DRIVING"
            onReady={r => setRouteCoords(r.coordinates)}
          />
        )}

        {/* 🚚 Pickup → Destination */}
        {isValid(pickupLocation) && isValid(destinationLocation) && (
          <MapViewDirections
            origin={pickupLocation!}
            destination={destinationLocation!}
            apikey={ENV.MAP_API_KEY}
            strokeWidth={6}
            strokeColor="#007AFF"
            mode="DRIVING"
            onReady={r => setRouteCoords(r.coordinates)}
          />
        )}

        {/* 🔵 Optional route polyline (backup) */}
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="#34C759"
          />
        )}
      </MapView>
    </View>
  );
};

export default MapTab;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
