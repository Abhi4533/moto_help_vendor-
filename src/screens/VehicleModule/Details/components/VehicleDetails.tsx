import React from 'react';
import { View } from 'react-native';
import { styles } from '../style';
import InfoRow from './InfoRow';
import InfoSection from './InfoSection';

interface VehicleDetailsProps {
  vehicle: any;
  setSnackbarMessage: any;
  setSnackbarVisible: any;
}

const VehicleDetails = ({
  vehicle,
  setSnackbarMessage,
  setSnackbarVisible,
}: VehicleDetailsProps) => {
  return (
    <>
      {/* Vehicle Specifications */}
      <InfoSection title="Vehicle Specifications" icon="car-info">
        <View style={styles.specsGrid}>
          <View style={styles.specColumn}>
            <InfoRow
              label="Chassis No"
              value={vehicle.vehicleDetails.chassis_number}
              copyable
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarVisible={setSnackbarVisible}
            />
            <InfoRow
              label="Engine No"
              value={vehicle.vehicleDetails.engine_number}
              copyable
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarVisible={setSnackbarVisible}
            />
            <InfoRow
              label="Body Type"
              value={vehicle.vehicleDetails.body_type}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarVisible={setSnackbarVisible}
            />
            <InfoRow
              label="Cubic Capacity"
              value={`${vehicle.vehicleDetails.cubic_capacity} cc`}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarVisible={setSnackbarVisible}
            />
          </View>
          <View style={styles.specColumn}>
            <InfoRow
              label="Gross Weight"
              value={`${vehicle.vehicleDetails.vehicle_gross_weight} kg`}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarVisible={setSnackbarVisible}
            />
            <InfoRow
              label="Unladen Weight"
              value={`${vehicle.vehicleDetails.unladen_weight} kg`}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarVisible={setSnackbarVisible}
            />
            <InfoRow
              label="Cylinders"
              value={vehicle.vehicleDetails.no_cylinders.toString()}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarVisible={setSnackbarVisible}
            />
            <InfoRow
              label="Seating Capacity"
              value={vehicle.vehicleDetails.seat_capacity.toString()}
              setSnackbarMessage={setSnackbarMessage}
              setSnackbarVisible={setSnackbarVisible}
            />
          </View>
        </View>
      </InfoSection>

      {/* Owner Information */}
      <InfoSection title="Owner Information" icon="account">
        <InfoRow
          label="Owner Name"
          value={vehicle.vehicleDetails.owner_name}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarVisible={setSnackbarVisible}
        />
        <InfoRow
          label="Father's Name"
          value={vehicle.vehicleDetails.father_name}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarVisible={setSnackbarVisible}
        />
        <InfoRow
          label="Mobile"
          value={vehicle.vehicleDetails.mobile_number}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarVisible={setSnackbarVisible}
          copyable
        />
        <InfoRow
          label="Registered At"
          value={vehicle.vehicleDetails.registered_at}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarVisible={setSnackbarVisible}
        />
      </InfoSection>

      {/* Address Information */}
      <InfoSection title="Address" icon="map-marker">
        <InfoRow
          label="Present Address"
          value={vehicle.vehicleDetails.present_address}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarVisible={setSnackbarVisible}
        />
        <InfoRow
          label="Permanent Address"
          value={vehicle.vehicleDetails.permanent_address}
          setSnackbarMessage={setSnackbarMessage}
          setSnackbarVisible={setSnackbarVisible}
        />
      </InfoSection>
    </>
  );
};

export default VehicleDetails;
