import {
  avialbleVehicle,
  getDriverInfoByMobile,
} from '@api/endpoints/avilable.api';
import {
  useGetDistrictQuery,
  useGetStateQuery,
  useGetTalukaQuery,
} from '@api/hooks_api';
import { Item } from '@components/common/Dropdown';
import FormikDropdown from '@components/common/FormikDropdown';
import { useNavigation } from '@react-navigation/native';
import { emitVenderIdDriverId } from '@socket/socket.emitters';
import { RootState } from '@store/index';
import { Formik } from 'formik';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Appbar, Avatar, Badge, Icon, Surface, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { VEHICLE_STATUS_OPTIONS } from './helper';
import { RouteType } from './type';

interface Errors {
  reportingTime: string;
  state: string;
  vehicleStatus: string;
}

const AvailabileVehicle = () => {
  const navigation = useNavigation();
  const vendorid = useSelector((state: RootState) => state.auth?.token);
  const [routes, setRoutes] = useState<any[]>([]);
  const [origin, setOrigin] = useState<any>(null);
  const [region, setRegion] = useState<string>('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [state, setState] = useState<string>('');
  const [reportingTime, setReportingTime] = useState('');
  const [driverData, setDriverData] = useState<any>([]);
  const { data: states } = useGetStateQuery();
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState<Errors>({
    reportingTime: '',
    state: '',
    vehicleStatus: '',
  });

  const { data: regions } = useGetDistrictQuery({ state: state });
  const [open, setOpen] = useState(false);

  // Fixed: Added dependency check to prevent unnecessary re-renders
  const excludedDistricts = useMemo(
    () => routes.flatMap(route => route.districts),
    [routes],
  );

  const { data: districts } = useGetTalukaQuery({
    state: state,
    region: region,
    excludeDistricts: excludedDistricts,
  });

  const fetchDriver = async () => {
    try {
      const response = await getDriverInfoByMobile({
        MobileNo: '',
        vendorid: vendorid || '',
      });
      if (response?.status === '00') {
        setDriverData(response?.data || []);
      }
    } catch (error) {
      console.error('Error fetching driver:', error);
    }
  };

  useEffect(() => {
    fetchDriver();
  }, []);

  // Initialize form values
  const handleFormSubmit = async (values: any) => {
    try {
      const apiRoutes = routes.map(route => ({
        state: route.state,
        region: route.region,
        districts: route.districts,
      }));

      const payload = {
        driverID: values.driverID,
        vendorid: values.vendorid,
        origin: origin || values.origin,
        routes: apiRoutes,
        vehicleType: values.vehicleType,
        vehicleNumber: values.vehicleNumber,
        reportingTime: reportingTime,
        vehicleStatus: values.vehicleStatus,
        driverMobile: values.driverMobile,
      };

      const response = await avialbleVehicle(payload);

      if (response?.status === '00') {
        emitVenderIdDriverId({
          VendorID: values.vendorid,
          DriverID: values.driverID,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Vehicle availability posted successfully',
        });
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Submission Failed',
          text2: response?.message || 'Something went wrong',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to submit form',
      });
    }
  };

  const removeRoute = useCallback((index: number) => {
    setRoutes(prev => prev.filter((_, i) => i !== index));
  }, []);

  const renderRouteItem = useCallback(
    ({ item, index }: { item: RouteType; index: number }) => (
      <RouteCard
        route={item}
        index={index}
        origin={origin}
        onRemove={removeRoute}
      />
    ),
    [origin, removeRoute],
  );

  const driverOptions: Item[] = useMemo(
    () =>
      driverData?.map((driver: any, index: number) => ({
        value: driver.MobileNo,
        label: `${driver.full_name} (${driver.DriverID})`,
      })) || [],
    [driverData],
  );

  const renderDriverInfo = (driverInfo: any[]) => {
    const driver = driverInfo?.[0];
    return (
      <Surface style={styles.driverInfoSurface}>
        <View style={styles.driverDetails}>
          <Avatar.Icon size={40} icon="account" style={styles.avatar} />
          <View style={styles.driverText}>
            <Text variant="bodyLarge" style={styles.driverName}>
              {driver?.full_name || 'N/A'}
            </Text>
            <Text variant="bodyMedium" style={styles.driverVehicle}>
              {driver?.registration_no
                ? `${driver.registration_no} • ${driver?.VehicleType}`
                : 'No vehicle info'}
            </Text>
            <Text variant="bodySmall" style={styles.driverLocation}>
              {driver?.Address || 'No address available'}
            </Text>
          </View>
        </View>
      </Surface>
    );
  };

  const renderVehicleStatusOptions = (
    setFieldValue: (field: string, value: any) => void,
    values: any,
  ) => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statusContainer}
      >
        {VEHICLE_STATUS_OPTIONS.map(status => (
          <TouchableOpacity
            key={status.value}
            style={[
              styles.statusButton,
              {
                backgroundColor:
                  values.vehicleStatus === status.value
                    ? status.color
                    : '#F8F9FA',
                borderColor: status.color,
              },
            ]}
            onPress={() => setFieldValue('vehicleStatus', status.value)}
          >
            <Text style={styles.statusIcon}>
              <Icon source={status?.icon} size={24} />
            </Text>
            <Text
              style={[
                styles.statusButtonText,
                {
                  color:
                    values.vehicleStatus === status.value
                      ? 'white'
                      : status.color,
                },
              ]}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const resetRouteSelection = useCallback(() => {
    setRegion('');
    setSelectedDistricts([]);
    if (driverData?.data?.[0]?.VehicleType !== 'Mini') {
      setState('');
    }
  }, [driverData]);

  const addRoute = useCallback(() => {
    const currentState =
      driverData?.data?.[0]?.VehicleType === 'Mini'
        ? driverData.data[0].State
        : state;

    if (!currentState || !region || selectedDistricts.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Route',
        text2: 'Please select state, region, and at least one district',
      });
      return;
    }

    const newRoute: RouteType = {
      state: currentState,
      region,
      districts: [...selectedDistricts],
      timestamp: Date.now(),
      displayText: `${currentState} → ${region} → ${selectedDistricts.join(
        ', ',
      )}`,
    };

    setRoutes(prev => [newRoute, ...prev]);
    resetRouteSelection();
  }, [state, region, selectedDistricts, driverData, resetRouteSelection]);

  // Initial form values
  const initialValues = useMemo(
    () => ({
      driverMobile: '',
      driverID: '',
      vendorid: vendorid,
      origin: {
        address: '',
        coordinates: { lat: 0, lng: 0 },
        components: {
          place: '',
          dist: '',
          tal: '',
          state: '',
          pincode: '',
        },
      },
      routes: [],
      vehicleType: '',
      vehicleNumber: '',
      reportingTime: '',
      vehicleStatus: '',
    }),
    [vendorid],
  );

  return (
    <View style={styles.container}>
      <Appbar.Header
        style={{
          backgroundColor: '#fff',
          elevation: 2,
        }}
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Availabile Vehicle"
          titleStyle={{
            fontWeight: '700',
            fontSize: 18,
          }}
        />
      </Appbar.Header>
      <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
        {({ setFieldValue, values, handleSubmit }) => {
          const driverInfo = useMemo(
            () =>
              driverData?.filter(
                (item: any) => item?.MobileNo === values?.driverMobile,
              ) || [],
            [driverData, values.driverMobile],
          );

          // FIXED: Moved setFieldValue to useEffect to prevent infinite re-renders
          useEffect(() => {
            if (driverInfo?.[0]) {
              const driver = driverInfo[0];
              setFieldValue('driverID', driver?.DriverID || '');
              setFieldValue('vendorid', vendorid || '');
              setFieldValue('origin', {
                address: driver?.Address || '',
                coordinates: {
                  lat: driver?.Lat || 0,
                  lng: driver?.Lng || 0,
                },
                components: {
                  place: driver?.City || '',
                  dist: driver?.District || '',
                  tal: driver?.Taluka || '',
                  state: driver?.State || '',
                  pincode: driver?.Pincode || '',
                },
              });
              setFieldValue('vehicleNumber', driver?.registration_no || '');
              setFieldValue('vehicleType', driver?.VehicleType || '');
            }
          }, [driverInfo, setFieldValue, vendorid]);
          return (
            <View style={styles.modalBody}>
              <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.headerContainer}>
                  {/* Driver Selection */}
                  <View style={styles.formCard}>
                    <FormikDropdown
                      name="driverMobile"
                      label="Select Driver"
                      data={driverOptions || []}
                      placeholder="Choose a driver"
                    />
                    {driverInfo.length > 0 && renderDriverInfo(driverInfo)}
                  </View>

                  {/* Vehicle Status */}
                  <View style={styles.formCard}>
                    <Text style={styles.sectionTitle}>Vehicle Status</Text>
                    {renderVehicleStatusOptions(setFieldValue, values)}
                  </View>

                  {/* Add Route Form */}
                  <View style={styles.formCard}>
                    <View style={styles.routeHeader}>
                      <Text style={styles.sectionTitle}>
                        Add Destination Route
                      </Text>
                      {routes.length > 0 && (
                        <Badge size={24} style={styles.badge}>
                          {routes.length}
                        </Badge>
                      )}
                    </View>

                    {driverInfo?.[0]?.VehicleType !== 'Mini' && (
                      <View style={styles.selectSection}>
                        <FormikDropdown
                          name="state"
                          label="Select State"
                          data={states?.data || []}
                          onSelect={(text: any) => setState(text)}
                          placeholder="Choose a state"
                        />
                      </View>
                    )}

                    <View style={styles.selectSection}>
                      <FormikDropdown
                        name="region"
                        label="Select Region"
                        data={regions?.data || []}
                        onSelect={setRegion as any}
                        placeholder="Choose a region"
                        disabled={
                          !state && driverInfo?.[0]?.VehicleType !== 'Mini'
                        }
                      />
                    </View>

                    <View style={styles.selectSection}>
                      <FormikDropdown
                        name="dist"
                        label="Select Districts"
                        data={districts?.data || []}
                        onSelect={setSelectedDistricts as any}
                        placeholder="Choose districts"
                        multi={true}
                        disabled={!region}
                      />
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.addRouteButton,
                        (!region || selectedDistricts.length === 0) &&
                          styles.addRouteButtonDisabled,
                      ]}
                      onPress={addRoute}
                      disabled={!region || selectedDistricts.length === 0}
                    >
                      <Text style={styles.addRouteButtonIcon}>+</Text>
                      <Text style={styles.addRouteButtonText}>Add Route</Text>
                    </TouchableOpacity>
                  </View>

                  {routes.length > 0 && (
                    <>
                      <Text style={styles.sectionTitle}>
                        Your Routes ({routes.length})
                      </Text>
                      <View style={styles.divider} />
                    </>
                  )}
                </View>

                <FlatList
                  data={routes}
                  renderItem={renderRouteItem}
                  keyExtractor={item => `route-${item.timestamp}`}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                />

                <View style={styles.footerContainer}>
                  {routes.length > 0 && (
                    <>
                      <Text style={styles.label}>Reporting Time *</Text>
                      <TouchableOpacity
                        style={styles.timeInput}
                        onPress={() => setOpen(true)}
                      >
                        <Text
                          style={[
                            styles.timeInputText,
                            !reportingTime && styles.placeholderText,
                          ]}
                        >
                          {reportingTime || 'Select Reporting Time'}
                        </Text>
                        <Text style={styles.timeInputIcon}>🕒</Text>
                      </TouchableOpacity>
                      {errors.reportingTime ? (
                        <Text style={styles.errorText}>
                          {errors.reportingTime}
                        </Text>
                      ) : null}
                    </>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      routes.length === 0 && styles.submitButtonDisabled,
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={routes.length === 0}
                  >
                    <Text style={styles.submitButtonText}>
                      Post Vehicle Availability
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePickerModal
                  open={open}
                  setOpen={setOpen}
                  date={date}
                  setDate={setDate}
                  setReportingTime={setReportingTime}
                  errors={errors}
                  setErrors={setErrors}
                />
              </ScrollView>
            </View>
          );
        }}
      </Formik>

      <Toast />
    </View>
  );
};

export default AvailabileVehicle;

const RouteCard = memo(
  ({
    route,
    index,
    origin,
    onRemove,
  }: {
    route: RouteType;
    index: number;
    origin: any;
    onRemove: (index: number) => void;
  }) => {
    return (
      <View style={styles.routeCard}>
        <View style={styles.routeHeader}>
          <View style={styles.routeIndex}>
            <Text style={styles.routeIndexText}>{index + 1}</Text>
          </View>
          <Text style={styles.routeTitle}>Route {index + 1}</Text>
          <TouchableOpacity
            onPress={() => onRemove(index)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Route Visualization */}
        <View style={styles.routeVisualization}>
          {/* Origin */}
          <View style={styles.routePoint}>
            <View style={[styles.pointIcon, styles.originIcon]}>
              <Text style={styles.pointIconText}>📍</Text>
            </View>
            <View style={styles.pointContent}>
              <Text style={styles.pointLabel}>Origin</Text>
              <Text style={styles.pointAddress} numberOfLines={2}>
                {origin?.address || 'Not specified'}
              </Text>
            </View>
          </View>

          {/* Arrow Connector */}
          <View style={styles.arrowConnector}>
            <View style={styles.verticalLine} />
            <View style={styles.arrowDown}>
              <Text style={styles.arrowIcon}>↓</Text>
            </View>
            <View style={styles.verticalLine} />
          </View>

          {/* Destination */}
          <View style={styles.routePoint}>
            <View style={[styles.pointIcon, styles.destinationIcon]}>
              <Text style={styles.pointIconText}>🏁</Text>
            </View>
            <View style={styles.pointContent}>
              <Text style={styles.pointLabel}>Destination</Text>
              <View style={styles.destinationDetails}>
                <Text style={styles.destinationText}>
                  <Text style={styles.destinationHighlight}>{route.state}</Text>
                  {route.region && ` → ${route.region}`}
                  {route.districts.length > 0 &&
                    ` → ${route.districts.join(', ')}`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  },
);

const DateTimePickerModal = memo(
  ({
    open,
    setOpen,
    date,
    setDate,
    setReportingTime,
    errors,
    setErrors,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    date: Date;
    setDate: (date: Date) => void;
    setReportingTime: (time: string) => void;
    errors: Errors;
    setErrors: (errors: Errors) => void;
  }) => {
    const [tempDate, setTempDate] = useState(date);

    const handleConfirm = useCallback(() => {
      setDate(tempDate);
      const formatted = tempDate.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      setReportingTime(formatted);

      setOpen(false);
    }, [tempDate, setDate, setReportingTime, setErrors, setOpen]);

    const handleCancel = useCallback(() => {
      setOpen(false);
    }, [setOpen]);

    const timeOptions = useMemo(
      () =>
        Array.from({ length: 24 }, (_, i) => {
          const hour = i % 12 || 12;
          const ampm = i < 12 ? 'AM' : 'PM';
          return { hour: i, label: `${hour}:00 ${ampm}` };
        }),
      [],
    );

    return (
      <Modal visible={open} transparent={true} animationType="slide">
        <View style={styles.datePickerModal}>
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>Select Reporting Time</Text>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeContainer}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateSectionTitle}>Date</Text>
                <View style={styles.dateRow}>
                  {[0, 1, 2].map(days => {
                    const newDate = new Date();
                    newDate.setDate(newDate.getDate() + days);
                    const isSelected =
                      tempDate.getDate() === newDate.getDate() &&
                      tempDate.getMonth() === newDate.getMonth() &&
                      tempDate.getFullYear() === newDate.getFullYear();

                    return (
                      <TouchableOpacity
                        key={days}
                        style={[
                          styles.dateOption,
                          isSelected && styles.dateOptionSelected,
                        ]}
                        onPress={() => setTempDate(newDate)}
                      >
                        <Text
                          style={[
                            styles.dateOptionText,
                            isSelected && styles.dateOptionTextSelected,
                          ]}
                        >
                          {days === 0
                            ? 'Today'
                            : days === 1
                            ? 'Tomorrow'
                            : newDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                              })}
                        </Text>
                        <Text
                          style={[
                            styles.dateOptionDay,
                            isSelected && styles.dateOptionDaySelected,
                          ]}
                        >
                          {newDate.getDate()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.timeContainer}>
                <Text style={styles.dateSectionTitle}>Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.timeOptions}>
                    {timeOptions.map(({ hour, label }) => {
                      const timeDate = new Date(tempDate);
                      timeDate.setHours(hour, 0, 0, 0);
                      const isSelected =
                        tempDate.getHours() === hour &&
                        tempDate.getMinutes() === 0;

                      return (
                        <TouchableOpacity
                          key={hour}
                          style={[
                            styles.timeOption,
                            isSelected && styles.timeOptionSelected,
                          ]}
                          onPress={() => setTempDate(timeDate)}
                        >
                          <Text
                            style={[
                              styles.timeOptionText,
                              isSelected && styles.timeOptionTextSelected,
                            ]}
                          >
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </View>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  },
);

// Updated Professional Styles with Route Visualization
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalBody: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    padding: 16,
  },
  vehicleInfoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#6366F1',
  },
  selectSection: {
    marginBottom: 16,
  },
  selectLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusButton: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  statusIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  statusButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  addRouteButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addRouteButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  addRouteButtonIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  addRouteButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },

  // Route Card Styles
  routeCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  routeIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  routeIndexText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  routeTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: 'bold',
  },

  // Route Visualization Styles
  routeVisualization: {
    marginLeft: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  pointIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  originIcon: {
    backgroundColor: '#D1FAE5',
  },
  destinationIcon: {
    backgroundColor: '#DBEAFE',
  },
  pointIconText: {
    fontSize: 14,
  },
  pointContent: {
    flex: 1,
    paddingTop: 4,
  },
  pointLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  pointAddress: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    lineHeight: 18,
  },
  destinationDetails: {
    marginTop: 2,
  },
  destinationText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  destinationHighlight: {
    color: '#3B82F6',
    fontWeight: '600',
  },

  // Arrow Connector Styles
  arrowConnector: {
    alignItems: 'center',
    marginLeft: 16,
    marginVertical: 4,
  },
  verticalLine: {
    width: 2,
    height: 8,
    backgroundColor: '#E5E7EB',
  },
  arrowDown: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  arrowIcon: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'bold',
  },

  // Footer and Form Styles
  footerContainer: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  timeInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  timeInputText: {
    fontSize: 14,
    color: '#111827',
  },
  timeInputIcon: {
    fontSize: 16,
    color: '#6B7280',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonIcon: {
    color: 'white',
    fontSize: 18,
    marginRight: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },

  // Driver Info Styles
  driverInfoSurface: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  driverDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#10B981',
    marginRight: 12,
  },
  driverText: {
    flex: 1,
  },
  driverName: {
    fontWeight: 'bold',
    color: '#065F46',
    fontSize: 16,
  },
  driverVehicle: {
    color: '#047857',
    marginTop: 2,
    fontSize: 14,
  },
  driverLocation: {
    color: '#059669',
    marginTop: 2,
    fontSize: 12,
  },
  loader: {
    marginVertical: 8,
  },

  // Date Picker Styles
  datePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '90%',
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dateTimeContainer: {
    marginVertical: 12,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  dateOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dateOptionText: {
    fontSize: 13,
    color: '#374151',
  },
  dateOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  dateOptionDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dateOptionDaySelected: {
    color: 'white',
  },
  timeContainer: {
    marginTop: 8,
  },
  timeOptions: {
    flexDirection: 'row',
  },
  timeOption: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  timeOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  timeOptionText: {
    fontSize: 13,
    color: '#374151',
  },
  timeOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  closeButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },

  // Snackbar Styles
  snackbar: {
    borderRadius: 12,
    margin: 16,
  },
  snackbarSuccess: {
    backgroundColor: '#10B981',
  },
  snackbarError: {
    backgroundColor: '#EF4444',
  },
});
