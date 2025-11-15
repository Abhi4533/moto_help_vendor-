import { SummaryData } from '@api/api.type';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import { styles } from '../style';

interface DocumentStatusProps {
  countData: SummaryData;
}

const DocumentStatus: FC<DocumentStatusProps> = ({ countData }) => {
  const vehicleSummary = countData?.VehicleSummary || {};

  const documentStats = [
    {
      title: 'Insurance Expired',
      count: vehicleSummary.ExpiredInsurance,
      color: '#F44336',
      icon: '📄',
    },
    {
      title: 'Permit Expired',
      count: vehicleSummary.ExpiredPermit,
      color: '#FF9800',
      icon: '📑',
    },
    {
      title: 'Fitness Expired',
      count: vehicleSummary.ExpiredFitness,
      color: '#FFC107',
      icon: '🏥',
    },
    {
      title: 'PUCC Expired',
      count: vehicleSummary.ExpiredPUCC,
      color: '#9C27B0',
      icon: '🌫️',
    },
  ];

  return (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Title style={styles.sectionTitle}>Document Alerts</Title>
        <View style={styles.documentsGrid}>
          {documentStats.map((doc, index) => (
            <View key={index} style={styles.documentItem}>
              <View
                style={[
                  styles.documentIcon,
                  { backgroundColor: `${doc.color}20` },
                ]}
              >
                <Paragraph
                  style={[styles.documentIconText, { color: doc.color }]}
                >
                  {doc.icon}
                </Paragraph>
              </View>
              <View style={styles.documentText}>
                <Title style={styles.documentCount}>{doc.count}</Title>
                <Paragraph style={styles.documentLabel}>{doc.title}</Paragraph>
              </View>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};

export default DocumentStatus;
