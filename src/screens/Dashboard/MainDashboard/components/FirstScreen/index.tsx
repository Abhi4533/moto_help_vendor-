import { getNearbyCustomerPosts } from '@api/endpoints/dashboard.api';
import OriginMarker from '@assets/map/OriginMarker';
import Parcel from '@assets/map/parcel';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@store/index';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Card, Icon, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { quickActions } from './helper';
import { styles } from './style';
import { CustomerPost, DEFAULT_INDIA_REGION } from './types';

const FirstScreen = () => {
  const vendorId = useSelector((state: RootState) => state?.auth?.token);
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);

  const { vendorLocation } = useSelector((state: RootState) => state.map);
  const [customerPosts, setCustomerPosts] = useState<CustomerPost[]>([]);

  /* ---------- FIT FUNCTION ---------- */
  const fitToAllMarkers = () => {
    if (!mapRef.current || !vendorLocation) return;
    const coords: any[] = [];
    coords.push({
      latitude: vendorLocation.latitude,
      longitude: vendorLocation.longitude,
    });
    customerPosts.forEach(post => {
      coords.push({
        latitude: post?.PickupLat,
        longitude: post?.PickupLng,
      });
    });
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  };

  const fetchNearbyCustomers = async () => {
    console.log({ vendorId, vendorLocation });
    if (!vendorId || !vendorLocation) return;

    try {
      const resp = await getNearbyCustomerPosts({
        VendorID: vendorId,
        vendorLat: vendorLocation.latitude,
        vendorLng: vendorLocation.longitude,
      });
      console.log({ resp });
      if (resp?.status === '00' && Array.isArray(resp.data)) {
        setCustomerPosts(resp.data);
      }
    } catch (error) {}
  };

  /* ---------- Fetch customers when vendor changes ---------- */
  useEffect(() => {
    if (vendorLocation) {
      fetchNearbyCustomers();
    }
  }, [vendorLocation]);

  /* ---------- Auto-zoom on vendor location ---------- */
  useEffect(() => {
    if (vendorLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: vendorLocation.latitude,
          longitude: vendorLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        600,
      );
    }
  }, [vendorLocation]);

  /* ---------- Fit map whenever vendor or customers change ---------- */
  useEffect(() => {
    if (vendorLocation) {
      setTimeout(() => fitToAllMarkers(), 500);
    }
  }, [vendorLocation, customerPosts]);

  const renderQuickActionsRow = (startIndex: number) => (
    <View style={styles.quickActionsRow}>
      {quickActions.slice(startIndex, startIndex + 3).map(action => (
        <TouchableOpacity
          key={action.label}
          style={styles.quickActionItem}
          onPress={() => navigation.navigate(action.route)}
        >
          <View style={styles.quickActionIcon}>
            <Icon source={action.icon} size={24} color="#6366F1" />
          </View>
          <Text style={styles.quickActionText}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.scrollView}>
      {/* TOP BUTTONS */}
      <View style={styles.topButtonsContainer}>
        <Button
          mode="contained"
          icon="car-key"
          style={styles.topButton}
          labelStyle={styles.topButtonLabel}
          onPress={() => navigation.navigate('Assign')}
        >
          Assign Vehicle
        </Button>

        <Button
          mode="contained"
          icon="car"
          style={[styles.topButton, styles.availableButton]}
          labelStyle={styles.topButtonLabel}
          onPress={() => navigation.navigate('Available')}
        >
          Available Vehicles
        </Button>
      </View>

      {/* MAP */}
      <Card style={styles.sectionCard} mode="elevated">
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={DEFAULT_INDIA_REGION}
          maxZoomLevel={13} // set your max zoom
          minZoomLevel={5} // optional: set min zoom
        >
          {/* Vendor Marker */}
          {vendorLocation && (
            <Marker
              coordinate={vendorLocation}
              anchor={{ x: 0.5, y: 0.5 }}
              flat
              tracksViewChanges={false}
              zIndex={99999}
            >
              <OriginMarker size={25} />
            </Marker>
          )}

          {/* Customer Posts */}
          {customerPosts?.map(post => (
            <Marker
              key={post?.Customer_LoadPostID}
              coordinate={{
                latitude: post?.PickupLat,
                longitude: post?.PickupLng,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              flat
              tracksViewChanges={false}
            >
              <Parcel width={60} height={60} />
            </Marker>
          ))}
        </MapView>
      </Card>

      {/* QUICK ACTIONS */}
      <Card style={styles.sectionCard} mode="elevated">
        <Card.Content>
          <View style={styles.quickActionsContainer}>
            {renderQuickActionsRow(0)}
            {renderQuickActionsRow(3)}
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default FirstScreen;
