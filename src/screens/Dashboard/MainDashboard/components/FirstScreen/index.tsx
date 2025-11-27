import { getNearbyCustomerPosts } from '@api/endpoints/dashboard.api';
import OriginMarker from '@assets/map/OriginMarker';
import Parcel from '@assets/map/parcel';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@store/index';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Button, Card, Icon, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { quickActions } from './helper';

const { width, height } = Dimensions.get('window');

interface CustomerPost {
  Customer_LoadPostID: string;
  Origin_Lat: number;
  Origin_Lng: number;
}

interface VendorLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const DEFAULT_INDIA_REGION = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 15,
  longitudeDelta: 15,
};

const FirstScreen = () => {
  const vendorId = useSelector((state: RootState) => state?.auth?.token);
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);

  const [vendorLocation, setVendorLocation] = useState<VendorLocation | null>(
    null,
  );
  const [customerPosts, setCustomerPosts] = useState<CustomerPost[]>([]);

  /* ---------- FIT FUNCTION ---------- */
  const fitToAllMarkers = () => {
    if (!mapRef.current || !vendorLocation) return;

    const coords: any[] = [];

    // Vendor location
    coords.push({
      latitude: vendorLocation.latitude,
      longitude: vendorLocation.longitude,
    });

    // Customers
    customerPosts.forEach(post => {
      coords.push({
        latitude: post.Origin_Lat,
        longitude: post.Origin_Lng,
      });
    });

    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
      animated: true,
    });
  };

  const fetchNearbyCustomers = async () => {
    if (!vendorId || !vendorLocation) return;

    try {
      const resp = await getNearbyCustomerPosts({
        VendorID: vendorId,
        vendorLat: vendorLocation.latitude,
        vendorLng: vendorLocation.longitude,
      });

      if (resp?.status === '00' && Array.isArray(resp.data)) {
        setCustomerPosts(resp.data);
      }
    } catch (error) {
      console.log('Fetch error: ', error);
    }
  };

  /* ---------- Load vendor location ---------- */
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
              key={post.Customer_LoadPostID}
              coordinate={{
                latitude: post.Origin_Lat,
                longitude: post.Origin_Lng,
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

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#f5f5f5' },

  topButtonsContainer: {
    flexDirection: 'row',
    padding: 16,
    marginTop: 8,
    gap: 12,
  },
  topButton: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 12,
  },
  availableButton: { backgroundColor: '#10B981' },
  topButtonLabel: { fontSize: 13, fontWeight: '600' },

  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },

  map: { height: height * 0.45, width: '100%' },

  quickActionsContainer: { gap: 12 },

  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickActionIcon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e293b',
  },
});

export default FirstScreen;
