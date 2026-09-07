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
  statsGrid: {
    gap: 12,
  },
  statBox: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statTrend: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 8,
  },
});

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Tableau de Bord</Text>
          <Text style={styles.subtitle}>Bienvenue sur MIDP</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Participants</Text>
            <Text style={styles.statValue}>1250</Text>
            <Text style={styles.statTrend}>↑ 12% cette semaine</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Séances</Text>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statTrend}>Tous en cours</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Hommes (moy)</Text>
            <Text style={styles.statValue}>42</Text>
            <Text style={styles.statTrend}>par séance</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Femmes (moy)</Text>
            <Text style={styles.statValue}>38</Text>
            <Text style={styles.statTrend}>par séance</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
