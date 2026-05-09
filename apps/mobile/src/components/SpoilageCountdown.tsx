import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  spoilageDays: number;
  spoilageRisk: 'green' | 'amber' | 'red';
}

export function SpoilageCountdown({ spoilageDays, spoilageRisk }: Props) {
  const colors = { green: '#22c55e', amber: '#f59e0b', red: '#ef4444' };
  const color = colors[spoilageRisk] ?? colors.green;

  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <View style={styles.content}>
        <Text style={styles.days}>{spoilageDays}</Text>
        <Text style={styles.label}>days remaining</Text>
      </View>
      {spoilageRisk === 'red' && (
        <Text style={styles.urgent}>⚠ Sell urgently</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    alignItems: 'center',
  },
  days: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  urgent: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
});
