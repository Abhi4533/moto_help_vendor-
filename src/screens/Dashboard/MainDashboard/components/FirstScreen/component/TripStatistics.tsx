import { SummaryData } from '@api/api.type';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Card, Chip, Paragraph, Title } from 'react-native-paper';
import { styles } from '../style';

interface TripStatisticsProps {
  countData: SummaryData;
}

const TripStatistics: FC<TripStatisticsProps> = ({ countData }) => {
  const tripSummary = countData?.TripSummary || {};

  return (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>Trip Analytics</Title>
          <Chip icon="chart-line" mode="outlined">
            Real-time
          </Chip>
        </View>
        <View style={styles.tripStats}>
          <View style={styles.tripStat}>
            <View style={[styles.tripIcon, { backgroundColor: '#E3F2FD' }]}>
              <Paragraph style={[styles.tripIconText, { color: '#2196F3' }]}>
                📊
              </Paragraph>
            </View>
            <View style={styles.tripText}>
              <Title style={styles.tripCount}>{tripSummary.Total}</Title>
              <Paragraph style={styles.tripLabel}>Total Trips</Paragraph>
            </View>
          </View>
          <View style={styles.tripStat}>
            <View style={[styles.tripIcon, { backgroundColor: '#FFF3E0' }]}>
              <Paragraph style={[styles.tripIconText, { color: '#FF9800' }]}>
                ⏳
              </Paragraph>
            </View>
            <View style={styles.tripText}>
              <Title style={styles.tripCount}>{tripSummary.Pending}</Title>
              <Paragraph style={styles.tripLabel}>Pending</Paragraph>
            </View>
          </View>
          <View style={styles.tripStat}>
            <View style={[styles.tripIcon, { backgroundColor: '#E8F5E8' }]}>
              <Paragraph style={[styles.tripIconText, { color: '#4CAF50' }]}>
                ✅
              </Paragraph>
            </View>
            <View style={styles.tripText}>
              <Title style={styles.tripCount}>{tripSummary.Closed}</Title>
              <Paragraph style={styles.tripLabel}>Completed</Paragraph>
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default TripStatistics;
