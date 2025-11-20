import { getDrivers } from '@api/endpoints/driver.api';
import { getVehicles } from '@api/endpoints/vehicle.api';
import { RootState } from '@store/index';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSelector } from 'react-redux';
import TemporaryDashboardLayout from '../Layout/Layout';
import { styles } from './style';

const TemporaryDashboard = () => {
  const venderId = useSelector((state: RootState) => state?.auth?.token);

  const [vehiclesCount, setVehicleCount] = useState(0);
  const [driversCount, setDriverCount] = useState(0);

  const vehicleDone = vehiclesCount > 0;
  const driverDone = driversCount > 0;
  const kycEnabled = vehicleDone && driverDone;

  const steps = [
    { key: 'registration', label: 'Registration', completed: true },
    { key: 'vehicle', label: 'Vehicle', completed: vehicleDone },
    { key: 'driver', label: 'Driver', completed: driverDone },
    { key: 'kyc', label: 'KYC', completed: false },
  ];
  // API fetch
  const fetchData = useCallback(async () => {
    try {
      if (!venderId) {
        return;
      }

      const response = await getDrivers({ vendorid: venderId });
      if (response?.status === '00') {
        setDriverCount(response?.data?.length || 0);
      }
      const response1 = await getVehicles({ vendorid: venderId });
      if (response1?.status === '00') {
        setVehicleCount(response1?.data?.length || 0);
      }
    } catch (err: any) {}
  }, [venderId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <TemporaryDashboardLayout>
      <View style={styles.container}>
        {/* ---- TOP STEP INDICATOR ---- */}
        <View style={styles.stepRow}>
          {steps.map((item, index) => {
            const stepNumber = index + 1;
            return (
              <View key={item.key} style={styles.stepBlock}>
                <View
                  style={[
                    styles.circle,
                    { backgroundColor: item.completed ? '#28a745' : '#c8c8c8' },
                  ]}
                >
                  {item.completed ? (
                    <Icon source="check" size={20} color="#fff" />
                  ) : (
                    <Text style={styles.circleText}>{stepNumber}</Text>
                  )}
                </View>
                <Text style={styles.stepLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>

        {/* ---- STEP INSTRUCTIONS ---- */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionHeader}>Next Steps</Text>

          <View style={styles.instructionBox}>
            <Text style={styles.instructionTitle}>1. Registration</Text>
            <Text style={styles.instructionDesc}>
              ✔ Registration completed successfully.
            </Text>
          </View>

          <View style={styles.instructionBox}>
            <Text style={styles.instructionTitle}>2. Validate Vehicle</Text>
            <Text style={styles.instructionDesc}>
              Validate <Text style={styles.bold}>at least 1 vehicle</Text> to
              proceed.
            </Text>
          </View>

          <View style={styles.instructionBox}>
            <Text style={styles.instructionTitle}>3. Add Driver</Text>
            <Text style={styles.instructionDesc}>
              Add <Text style={styles.bold}>at least 1 driver</Text> for
              completing profile.
            </Text>
          </View>

          <View style={styles.instructionBox}>
            <Text style={styles.instructionTitle}>4. KYC Verification</Text>
            {kycEnabled ? (
              <Text style={styles.instructionDesc}>
                KYC is now unlocked. Complete your verification to access the
                main application features.
              </Text>
            ) : (
              <Text style={styles.instructionDesc}>
                KYC will unlock after adding at least 1 vehicle and 1 driver.
              </Text>
            )}
          </View>
        </View>

        {/* ---- MAIN ACTION BUTTONS ---- */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.box}>
            <Icon source="car" size={38} />
            <Text style={styles.boxText}>Validate Vehicle</Text>
            <Text style={styles.subInfo}>{vehiclesCount} Added</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.box}>
            <Icon source="account-plus" size={38} />
            <Text style={styles.boxText}>Add Driver</Text>
            <Text style={styles.subInfo}>{driversCount} Added</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.box, !kycEnabled && styles.disabledBox]}
            disabled={!kycEnabled}
          >
            <Icon
              source="shield-account"
              size={38}
              color={kycEnabled ? '#000' : '#999'}
            />
            <Text style={[styles.boxText, !kycEnabled && styles.disabledText]}>
              Start KYC
            </Text>
            {!kycEnabled && <Text style={styles.lockText}>Locked</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </TemporaryDashboardLayout>
  );
};

export default TemporaryDashboard;
