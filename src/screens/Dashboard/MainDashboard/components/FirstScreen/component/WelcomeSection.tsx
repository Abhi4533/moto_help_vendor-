import React from 'react';
import { View } from 'react-native';
import { Card, Paragraph, Title } from 'react-native-paper';
import { styles } from '../style';

const WelcomeSection = () => {
  return (
    <Card style={styles.welcomeCard}>
      <Card.Content style={styles.welcomeCardContent}>
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeTextContainer}>
            <Title style={styles.welcomeTitle}>Vendor Dashboard 👋</Title>
            <Paragraph style={styles.welcomeSubtitle}>
              Complete overview of your logistics operations
            </Paragraph>
          </View>
          <View style={styles.dateBadge}>
            <Paragraph style={styles.dateText} numberOfLines={1}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Paragraph>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export default WelcomeSection;
