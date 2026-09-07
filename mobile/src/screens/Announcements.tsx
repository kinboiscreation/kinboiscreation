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
    color: '#f59e0b',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
});

export default function AnnouncementsScreen() {
  const announcements = [
    {
      id: 1,
      title: 'Nouvelle Annonce',
      content: 'Les annonces seront affichées ici',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Annonces</Text>
          <Text style={styles.subtitle}>Communications officielles du MIDP</Text>
        </View>

        {announcements.map((announcement) => (
          <View key={announcement.id} style={styles.card}>
            <Text style={styles.cardTitle}>{announcement.title}</Text>
            <Text style={styles.cardText}>{announcement.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
