import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from '../style';
import DocumentStatusCard from './DocumentStatusCard';
import InfoSection from './InfoSection';

interface VehicleDocumentProps {
  vehicle: any;
}

const VehicleDocument = ({ vehicle }: VehicleDocumentProps) => {
  return (
    <>
      {/* Document Expiry Status */}
      <InfoSection title="Document Expiry Status" icon="calendar-alert">
        <DocumentStatusCard
          title="Fitness Certificate"
          date={vehicle.vehicleDetails.fit_upto}
          icon="certificate"
          type="fitness"
        />
        <DocumentStatusCard
          title="Insurance"
          date={vehicle.vehicleDetails.insurance_upto}
          icon="shield-account"
          type="insurance"
        />
        <DocumentStatusCard
          title="Tax Paid Upto"
          date={vehicle.vehicleDetails.tax_upto}
          icon="cash"
          type="tax"
        />
        <DocumentStatusCard
          title="PUC Certificate"
          date={vehicle.vehicleDetails.pucc_upto}
          icon="file-document"
          type="puc"
        />
        <DocumentStatusCard
          title="Permit Valid Upto"
          date={vehicle.vehicleDetails.permit_valid_upto}
          icon="license"
          type="permit"
        />
      </InfoSection>

      {/* Document Actions */}
      <View style={styles.documentActions}>
        <Button mode="contained" icon="download" style={styles.documentButton}>
          Download All
        </Button>
        <Button mode="outlined" icon="eye" style={styles.documentButton}>
          View Online
        </Button>
      </View>
    </>
  );
};

export default VehicleDocument;
