import { SummaryData } from '@api/api.type';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { Button, Card, Chip, DataTable, Title } from 'react-native-paper';
import { generateMockData, getPaymentStatusColor } from '../helper';
import { styles } from '../style';
interface QuickStatsGridProps {
  countData: SummaryData;
}
const RecentPayments: FC<QuickStatsGridProps> = () => {
  const navigation = useNavigation();
  const { drivers, vehicles, trips, payments } = useMemo(
    () => generateMockData(),
    [],
  );
  return (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>Recent Payments</Title>
          <Button
            mode="text"
            compact
            onPress={() => navigation.navigate('Payments' as never)}
          >
            View All
          </Button>
        </View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Invoice</DataTable.Title>
            <DataTable.Title>Customer</DataTable.Title>
            <DataTable.Title>Amount</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
          </DataTable.Header>

          {payments.slice(0, 3).map(payment => (
            <DataTable.Row key={payment.id}>
              <DataTable.Cell>{payment.invoiceNumber}</DataTable.Cell>
              <DataTable.Cell>{payment.customerName}</DataTable.Cell>
              <DataTable.Cell>${payment.amount}</DataTable.Cell>
              <DataTable.Cell>
                <Chip
                  mode="outlined"
                  textStyle={{
                    color: getPaymentStatusColor(payment.status),
                    fontSize: 12,
                  }}
                >
                  {payment.status}
                </Chip>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card.Content>
    </Card>
  );
};

export default RecentPayments;
