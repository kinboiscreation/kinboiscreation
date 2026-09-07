import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 4,
  },
});

export default function ActivitiesScreen() {
  const activities = [
    {
      id: 1,
      type: 'Matinaux de Prière',
      date: '2024-09-06',
      participants: 85,
    },
    {
      id: 2,
      type: 'Nocturnes de Prière',
      date: '2024-09-05',
      participants: 120,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Activités</Text>
          <Text style={styles.subtitle}>Gestion des activités de prière</Text>
        </View>

        {activities.map((activity) => (
          <View key={activity.id} style={styles.card}>
            <Text style={styles.cardTitle}>{activity.type}</Text>
            <Text style={styles.cardText}>Date: {activity.date}</Text>
            <Text style={styles.cardText}>Participants: {activity.participants}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
