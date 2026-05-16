import React from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, XCircle, Clock, RefreshCw, Package, Tag, Inbox } from 'lucide-react-native';
import { useMyOffers } from '../../api/offers';

const STATUS_CONFIG = {
  pending:  { color: '#f59e0b', bg: '#fef3c7', label: 'Awaiting Farmer',   icon: Clock },
  accepted: { color: '#22c55e', bg: '#dcfce7', label: '✅ Offer Accepted!', icon: CheckCircle },
  paid:     { color: '#16a34a', bg: '#f0fdf4', label: '🎉 Payment Complete', icon: CheckCircle },
  declined: { color: '#ef4444', bg: '#fee2e2', label: 'Offer Declined',    icon: XCircle },
  countered:{ color: '#3b82f6', bg: '#dbeafe', label: 'Counter Offered',   icon: RefreshCw },
  expired:  { color: '#94a3b8', bg: '#f1f5f9', label: 'Expired',           icon: Clock },
} as const;

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function BuyerOffersScreen({ navigation }: any) {
  const { data: offers = [], isLoading, refetch } = useMyOffers();

  const renderItem = ({ item }: { item: any }) => {
    const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
      <View style={styles.card}>
        {/* Status banner */}
        <View style={[styles.statusBanner, { backgroundColor: cfg.bg }]}>
          <Icon size={16} color={cfg.color} />
          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>

        <Text style={styles.cropType}>{item.crop_type}</Text>
        <Text style={styles.farmerLine}>from <Text style={{ fontWeight: '700' }}>{item.farmer_name}</Text> · {timeAgo(item.created_at)}</Text>

        <View style={styles.priceRow}>
          <View style={styles.priceCell}>
            <Tag size={14} color="#3b82f6" />
            <Text style={styles.priceLabel}>Your Offer</Text>
            <Text style={[styles.priceValue, { color: '#22c55e' }]}>GHS {item.proposed_price}/kg</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceCell}>
            <Package size={14} color="#f59e0b" />
            <Text style={styles.priceLabel}>Listed Price</Text>
            <Text style={styles.priceValue}>GHS {item.asking_price ?? '—'}/kg</Text>
          </View>
        </View>

        {item.status === 'accepted' && (
          <View style={styles.successNote}>
            <Text style={styles.successNoteText}>🎉 The farmer accepted your offer! Proceed to payment to secure your harvest.</Text>
            <TouchableOpacity 
              style={styles.payButton} 
              onPress={() => navigation.navigate('Payment', { offer: item })}
            >
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.status === 'paid' && (
          <View style={[styles.successNote, { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }]}>
            <Text style={[styles.successNoteText, { color: '#16a34a' }]}>
              Transaction Complete! Your payment is secured. You can now coordinate collection with the farmer.
            </Text>
          </View>
        )}
        {item.status === 'declined' && (
          <View style={styles.declinedNote}>
            <Text style={styles.declinedNoteText}>The farmer declined this offer. You can browse other listings in the Marketplace.</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Offers</Text>
          <Text style={styles.subtitle}>Track your purchase offers</Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => refetch()}>
          <RefreshCw size={20} color="#22c55e" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centred}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : offers.length === 0 ? (
        <View style={styles.centred}>
          <View style={styles.emptyIcon}><Inbox size={48} color="#cbd5e1" /></View>
          <Text style={styles.emptyTitle}>No offers yet</Text>
          <Text style={styles.emptySubtitle}>Make an offer on a harvest from the Marketplace tab.</Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          renderItem={renderItem}
          keyExtractor={(item) => item.offer_id}
          contentContainerStyle={styles.list}
          onRefresh={refetch}
          refreshing={isLoading}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', paddingHorizontal: 24,
    paddingTop: 20, paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 2 },
  refreshBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#bbf7d0',
  },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  centred: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  emptyIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  emptySubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', paddingHorizontal: 40 },
  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 20,
    marginBottom: 16, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8,
  },
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    alignSelf: 'flex-start', marginBottom: 14,
  },
  statusText: { fontSize: 13, fontWeight: '700' },
  cropType: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  farmerLine: { fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 16 },
  priceRow: {
    flexDirection: 'row', backgroundColor: '#f8fafc',
    borderRadius: 16, padding: 14, marginBottom: 14,
  },
  priceCell: { flex: 1, alignItems: 'center', gap: 4 },
  priceDivider: { width: 1, backgroundColor: '#e2e8f0', marginHorizontal: 8 },
  priceLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },
  priceValue: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  successNote: {
    backgroundColor: '#f0fdf4', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#bbf7d0',
  },
  successNoteText: { fontSize: 14, color: '#16a34a', lineHeight: 20 },
  declinedNote: {
    backgroundColor: '#fff5f5', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#fecaca',
  },
  declinedNoteText: { fontSize: 14, color: '#dc2626', lineHeight: 20 },
  payButton: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
