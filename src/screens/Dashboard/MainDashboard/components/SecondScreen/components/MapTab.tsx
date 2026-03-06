// components/MapTab.tsx

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';

import DropMarker from '@assets/map/DropMarker';
import OriginMarker from '@assets/map/OriginMarker';
import Parcel from '@assets/map/parcel';
import Truck from '@assets/map/Truck';
import { ENV } from '@config/env';
import { useDashboard } from '@screens/Dashboard/Layout/DashboardContext';
import { RootState } from '@store/index';
import { INDIA_REGION, MAP_STYLE } from '@utils/mapHelper';
import MapViewDirections from 'react-native-maps-directions';
type Coord = {
  latitude: number;
  longitude: number;
};

const isValid = (c?: Coord | null) =>
  !!c && typeof c.latitude === 'number' && typeof c.longitude === 'number';

const MapTab: FC = () => {
  const mapRef = useRef<MapView>(null);

  /** ✅ Separate route states (IMPORTANT) */
  const [routeOrigin, setRouteOrigin] = useState<Coord | null>(null);

  const [driverToPickup, setDriverToPickup] = useState<Coord[]>([]);
  const [pickupToDrop, setPickupToDrop] = useState<Coord[]>([]);
  const { selectedTab } = useDashboard();
  const {
    liveDriverLocation,
    customerLocations,
    pickupLocation,
    destinationLocation,
  } = useSelector((state: RootState) => state.map);

  useEffect(() => {
    setPickupToDrop([]);
  }, [pickupLocation?.latitude, pickupLocation?.longitude]);

  /** 📍 Fit all points perfectly */
  const fitAll = useCallback(() => {
    if (!mapRef.current) return;

    const coords: Coord[] = [];

    if (isValid(liveDriverLocation)) coords.push(liveDriverLocation!);
    if (isValid(pickupLocation)) coords.push(pickupLocation!);
    if (isValid(destinationLocation)) coords.push(destinationLocation!);

    customerLocations?.forEach(c => {
      if (isValid(c)) coords.push(c);
    });

    driverToPickup.forEach(c => coords.push(c));
    pickupToDrop.forEach(c => coords.push(c));

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
      edgePadding: { top: 120, right: 100, bottom: 260, left: 100 },
      animated: true,
    });
  }, [
    liveDriverLocation,
    pickupLocation,
    destinationLocation,
    customerLocations,
    driverToPickup,
    pickupToDrop,
  ]);

  useEffect(() => {
    const t = setTimeout(fitAll, 600);
    return () => clearTimeout(t);
  }, [fitAll]);

  useEffect(() => {
    if (!isValid(liveDriverLocation)) return;

    setRouteOrigin({
      latitude: liveDriverLocation?.latitude || 0,
      longitude: liveDriverLocation?.longitude || 0,
    });
  }, [liveDriverLocation?.latitude, liveDriverLocation?.longitude]);

  return (
    <View style={styles.container}>
      <MapView
        userInterfaceStyle="light"
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
        {/* 🚚 DRIVER */}
        {isValid(liveDriverLocation) && (
          <Marker
            key={`driver-${liveDriverLocation?.latitude}-${liveDriverLocation?.longitude}`}
            coordinate={liveDriverLocation!}
            rotation={liveDriverLocation?.rotation ?? 0}
            flat
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Truck width={50} height={50} />
          </Marker>
        )}

        {/* 📦 CUSTOMERS */}
        {selectedTab === 'idle' &&
          customerLocations?.map(
            (c, i) =>
              isValid(c) && (
                <Marker
                  key={`customer-${i}-${c.latitude}-${c.longitude}`}
                  coordinate={c}
                >
                  <Parcel width={36} height={36} />
                </Marker>
              ),
          )}

        {/* 📍 PICKUP */}
        {selectedTab !== 'idle' && isValid(pickupLocation) && (
          <Marker coordinate={pickupLocation!}>
            <OriginMarker size={34} />
          </Marker>
        )}

        {/* 🎯 DESTINATION */}
        {selectedTab !== 'idle' && isValid(destinationLocation) && (
          <Marker coordinate={destinationLocation!}>
            <DropMarker size={34} />
          </Marker>
        )}

        {/* 🧭 DRIVER → PICKUP */}
        {selectedTab === 'process' &&
          isValid(routeOrigin) &&
          isValid(pickupLocation) && (
            <MapViewDirections
              origin={{
                latitude: liveDriverLocation!.latitude,
                longitude: liveDriverLocation!.longitude,
              }}
              destination={{
                latitude: pickupLocation!.latitude,
                longitude: pickupLocation!.longitude,
              }}
              apikey={ENV.MAP_API_KEY}
              strokeWidth={5}
              strokeColor="#FF9500"
              mode="DRIVING"
            />
          )}

        {/* 🚚 PICKUP → DROP */}
        {selectedTab === 'active' &&
          isValid(pickupLocation) &&
          isValid(destinationLocation) && (
            <MapViewDirections
              key={`p2d-${liveDriverLocation!.latitude}-${
                liveDriverLocation!.longitude
              }`}
              origin={liveDriverLocation!}
              destination={destinationLocation!}
              apikey={ENV.MAP_API_KEY}
              strokeWidth={6}
              strokeColor="#007AFF"
              mode="DRIVING"
              optimizeWaypoints={false}
              resetOnChange={true}
              onReady={r => setPickupToDrop(r.coordinates)}
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
