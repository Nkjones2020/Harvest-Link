import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Alert, Modal, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCircle, XCircle, Clock, RefreshCw,
  Package, Tag, User, ChevronRight, Inbox
} from 'lucide-react-native';
import { useIncomingOffers, useRespondToOffer } from '../../api/offers';

const STATUS_CONFIG = {
  pending:  { color: '#f59e0b', bg: '#fef3c7', label: 'Awaiting Response', icon: Clock },
  accepted: { color: '#22c55e', bg: '#dcfce7', label: 'Accepted',          icon: CheckCircle },
  declined: { color: '#ef4444', bg: '#fee2e2', label: 'Declined',          icon: XCircle },
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

export default function FarmerOffersScreen() {
  const { data: offers = [], isLoading, refetch } = useIncomingOffers();
  const respond = useRespondToOffer();
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [detailModal, setDetailModal] = useState(false);

  const pending = offers.filter((o: any) => o.status === 'pending');
  const past    = offers.filter((o: any) => o.status !== 'pending');

  const handleRespond = (offer: any, status: 'accepted' | 'declined') => {
    const label = status === 'accepted' ? 'Accept' : 'Decline';
    Alert.alert(
      `${label} Offer`,
      `${label} ${offer.buyer_name}'s offer of GHS ${offer.proposed_price}/kg for ${offer.crop_type}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: label,
          style: status === 'declined' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await respond.mutateAsync({ offerId: offer.offer_id, status });
              setDetailModal(false);
            } catch {
              Alert.alert('Error', 'Could not process your response. Please try again.');
            }
          },
        },
      ]
    );
  };

  const openDetail = (offer: any) => {
    setSelectedOffer(offer);
    setDetailModal(true);
  };

  const renderOffer = ({ item }: { item: any }) => {
    const cfg = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
    const Icon = cfg.icon;
    return (
      <TouchableOpacity style={styles.card} onPress={() => openDetail(item)} activeOpacity={0.8}>
        {/* Top row */}
        <View style={styles.cardTop}>
          <View style={styles.buyerAvatarPlaceholder}>
            <User size={20} color="#64748b" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.buyerName}>{item.buyer_name}</Text>
            <Text style={styles.timeAgo}>{timeAgo(item.created_at)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <Icon size={13} color={cfg.color} />
            <Text style={[styles.statusLabel, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>

        {/* Crop info */}
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Package size={15} color="#22c55e" />
            <Text style={styles.infoLabel}>Crop</Text>
            <Text style={styles.infoValue}>{item.crop_type}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Tag size={15} color="#3b82f6" />
            <Text style={styles.infoLabel}>Offered Price</Text>
            <Text style={[styles.infoValue, { color: '#22c55e' }]}>GHS {item.proposed_price}/kg</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Tag size={15} color="#f59e0b" />
            <Text style={styles.infoLabel}>Your Price</Text>
            <Text style={styles.infoValue}>GHS {item.asking_price ?? '—'}/kg</Text>
          </View>
        </View>

        {/* Quick action buttons for pending offers */}
        {item.status === 'pending' && (
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.declineBtn}
              onPress={() => handleRespond(item, 'declined')}
            >
              <XCircle size={16} color="#ef4444" />
              <Text style={styles.declineBtnText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => handleRespond(item, 'accepted')}
            >
              <CheckCircle size={16} color="#fff" />
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Incoming Offers</Text>
          <Text style={styles.subtitle}>
            {pending.length} pending · {past.length} resolved
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={() => refetch()}>
          <RefreshCw size={20} color="#22c55e" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centred}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>Loading offers...</Text>
        </View>
      ) : offers.length === 0 ? (
        <View style={styles.centred}>
          <View style={styles.emptyIcon}><Inbox size={48} color="#cbd5e1" /></View>
          <Text style={styles.emptyTitle}>No offers yet</Text>
          <Text style={styles.emptySubtitle}>When buyers make offers on your harvests, they'll appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={offers}
          renderItem={renderOffer}
          keyExtractor={(item) => item.offer_id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
        />
      )}

      {/* Detail Modal */}
      <Modal visible={detailModal} transparent animationType="slide" onRequestClose={() => setDetailModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            {selectedOffer && (() => {
              const cfg = STATUS_CONFIG[selectedOffer.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
              const Icon = cfg.icon;
              return (
                <>
                  <View style={[styles.detailStatusBanner, { backgroundColor: cfg.bg }]}>
                    <Icon size={22} color={cfg.color} />
                    <Text style={[styles.detailStatusText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>

                  <Text style={styles.detailCrop}>{selectedOffer.crop_type}</Text>
                  <Text style={styles.detailBuyer}>Offer from <Text style={{ fontWeight: '800' }}>{selectedOffer.buyer_name}</Text></Text>
                  <Text style={styles.detailTime}>{timeAgo(selectedOffer.created_at)}</Text>

                  <View style={styles.detailGrid}>
                    <View style={styles.detailCell}>
                      <Text style={styles.detailCellLabel}>Offer Price</Text>
                      <Text style={[styles.detailCellValue, { color: '#22c55e' }]}>GHS {selectedOffer.proposed_price}/kg</Text>
                    </View>
                    <View style={styles.detailCell}>
                      <Text style={styles.detailCellLabel}>Your Listed Price</Text>
                      <Text style={styles.detailCellValue}>GHS {selectedOffer.asking_price ?? '—'}/kg</Text>
                    </View>
                    <View style={styles.detailCell}>
                      <Text style={styles.detailCellLabel}>Your Quantity</Text>
                      <Text style={styles.detailCellValue}>{selectedOffer.listing_qty} kg</Text>
                    </View>
                    {selectedOffer.buyer_phone && (
                      <View style={styles.detailCell}>
                        <Text style={styles.detailCellLabel}>Buyer Phone</Text>
                        <Text style={styles.detailCellValue}>{selectedOffer.buyer_phone}</Text>
                      </View>
                    )}
                  </View>

                  {selectedOffer.status === 'pending' ? (
                    <View style={styles.detailActions}>
                      <TouchableOpacity
                        style={[styles.detailBtn, styles.detailDecline]}
                        onPress={() => handleRespond(selectedOffer, 'declined')}
                      >
                        <XCircle size={18} color="#ef4444" />
                        <Text style={[styles.detailBtnText, { color: '#ef4444' }]}>Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.detailBtn, styles.detailAccept]}
                        onPress={() => handleRespond(selectedOffer, 'accepted')}
                      >
                        <CheckCircle size={18} color="#fff" />
                        <Text style={[styles.detailBtnText, { color: '#fff' }]}>Accept Offer</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.closePill} onPress={() => setDetailModal(false)}>
                      <Text style={styles.closePillText}>Close</Text>
                    </TouchableOpacity>
                  )}
                </>
              );
            })()}
          </View>
        </View>
      </Modal>
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
  loadingText: { color: '#64748b', fontSize: 15 },
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
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  buyerAvatarPlaceholder: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center',
  },
  buyerName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  timeAgo: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  statusLabel: { fontSize: 11, fontWeight: '700' },
  infoGrid: {
    flexDirection: 'row', backgroundColor: '#f8fafc',
    borderRadius: 16, padding: 14, marginBottom: 16,
  },
  infoItem: { flex: 1, alignItems: 'center', gap: 4 },
  infoDivider: { width: 1, backgroundColor: '#e2e8f0', marginHorizontal: 4 },
  infoLabel: { fontSize: 10, color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  quickActions: { flexDirection: 'row', gap: 12 },
  declineBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 13, borderRadius: 16,
    borderWidth: 1.5, borderColor: '#fecaca', backgroundColor: '#fff5f5',
  },
  declineBtnText: { fontSize: 15, fontWeight: '700', color: '#ef4444' },
  acceptBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 13, borderRadius: 16,
    backgroundColor: '#22c55e', elevation: 4,
    shadowColor: '#22c55e', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8,
  },
  acceptBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 32,
    borderTopRightRadius: 32, padding: 28, paddingTop: 16,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#e2e8f0', alignSelf: 'center', marginBottom: 20,
  },
  detailStatusBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 14, borderRadius: 16, marginBottom: 20,
  },
  detailStatusText: { fontSize: 15, fontWeight: '700' },
  detailCrop: { fontSize: 26, fontWeight: '800', color: '#1e293b' },
  detailBuyer: { fontSize: 15, color: '#64748b', marginTop: 4 },
  detailTime: { fontSize: 13, color: '#94a3b8', marginTop: 2, marginBottom: 20 },
  detailGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 12, marginBottom: 24,
  },
  detailCell: {
    flex: 1, minWidth: '45%', backgroundColor: '#f8fafc',
    borderRadius: 16, padding: 14,
  },
  detailCellLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600', marginBottom: 4 },
  detailCellValue: { fontSize: 17, fontWeight: '800', color: '#1e293b' },
  detailActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  detailBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 18,
  },
  detailDecline: { borderWidth: 1.5, borderColor: '#fecaca', backgroundColor: '#fff5f5' },
  detailAccept: {
    backgroundColor: '#22c55e', elevation: 6,
    shadowColor: '#22c55e', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 10,
  },
  detailBtnText: { fontSize: 16, fontWeight: '800' },
  closePill: {
    alignSelf: 'center', marginTop: 8,
    backgroundColor: '#f1f5f9', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 20,
  },
  closePillText: { fontSize: 16, fontWeight: '700', color: '#64748b' },
});
