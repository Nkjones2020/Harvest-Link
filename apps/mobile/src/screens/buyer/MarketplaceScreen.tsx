import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Dimensions,
  Image,
  Modal,
  Animated,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Filter, Star, Clock, ArrowRight, X, CheckCircle, Package, Tag } from 'lucide-react-native';
import { useMarketplaceListings } from '../../api/listings';
import { useAuthStore } from '../../store/authStore';
import { API_BASE_URL } from '../../api/config';

const { width, height } = Dimensions.get('window');

const CATEGORIES = ['All', 'Vegetables', 'Grains', 'Roots & Tubers', 'Fruits'];

const CROP_IMAGES: Record<string, string> = {
  tomatoes: 'https://images.unsplash.com/photo-1546097759-47d34da24411?auto=format&fit=crop&q=80&w=400',
  maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400',
  onions: 'https://images.unsplash.com/photo-1508747703725-7197771375a0?auto=format&fit=crop&q=80&w=400',
  cassava: 'https://images.unsplash.com/photo-1593500872560-0de73f1b9a06?auto=format&fit=crop&q=80&w=400',
  yam: 'https://images.unsplash.com/photo-1593500872560-0de73f1b9a06?auto=format&fit=crop&q=80&w=400',
  plantain: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80&w=400',
  pepper: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&q=80&w=400',
  mango: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=400',
  orange: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=400',
  pineapple: 'https://images.unsplash.com/photo-1550258114-b864e4c32958?auto=format&fit=crop&q=80&w=400',
  avocado: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=400',
  watermelon: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400',
  banana: 'https://images.unsplash.com/photo-1571771894821-ad9b5886439b?auto=format&fit=crop&q=80&w=400',
  cucumber: 'https://images.unsplash.com/photo-1449333256643-bc27a23ef31d?auto=format&fit=crop&q=80&w=400',
  ginger: 'https://images.unsplash.com/photo-1615484477778-ca3b77942c23?auto=format&fit=crop&q=80&w=400',
  garlic: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=400',
  default: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=400',
};

function getImageForCrop(cropType: string) {
  const key = cropType?.toLowerCase();
  return CROP_IMAGES[key] || CROP_IMAGES.default;
}

const MOCK_MARKETPLACE = [
  {
    id: '1',
    crop_type: 'Tomatoes',
    quantity_kg: 500,
    asking_price: 15,
    currency: 'GHS',
    distance_km: 1.2,
    spoilage_risk: 'red' as const,
    farmer_name: 'Kwame A.',
    rating: 4.8,
  },
  {
    id: '2',
    crop_type: 'Onions',
    quantity_kg: 1200,
    asking_price: 8,
    currency: 'GHS',
    distance_km: 4.5,
    spoilage_risk: 'amber' as const,
    farmer_name: 'Sarah M.',
    rating: 4.5,
  },
  {
    id: '3',
    crop_type: 'Maize',
    quantity_kg: 5000,
    asking_price: 12,
    currency: 'GHS',
    distance_km: 12.0,
    spoilage_risk: 'green' as const,
    farmer_name: 'Osei T.',
    rating: 4.9,
  },
];

export default function MarketplaceScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: serverListings, isLoading, refetch, isFetching } = useMarketplaceListings();
  const token = useAuthStore(state => state.token);

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  // Offer modal state
  const [offerModal, setOfferModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [offerQty, setOfferQty] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const listings = serverListings?.length ? serverListings : MOCK_MARKETPLACE;

  const openOffer = (item: any) => {
    setSelectedListing(item);
    setOfferQty('');
    setOfferPrice(item.asking_price?.toString() || '');
    setSuccess(false);
    setOfferModal(true);
  };

  const closeOffer = () => {
    setOfferModal(false);
    setSelectedListing(null);
    setSuccess(false);
  };

  const submitOffer = async () => {
    if (!offerQty || !offerPrice) {
      Alert.alert('Missing Info', 'Please enter a quantity and price.');
      return;
    }
    setSubmitting(true);
    try {
      // Submit offer to API
      const res = await fetch(`${API_BASE_URL}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          listing_id: selectedListing.id,
          quantity_kg: parseFloat(offerQty),
          max_price: parseFloat(offerPrice),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit offer');
      }

      setSuccess(true);
    } catch (e: any) {
      Alert.alert('Offer Failed', e.message || 'Could not submit your offer. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const qty = parseFloat(item.quantity_kg || '0');
    const isSoldOut = (item.status?.toLowerCase() === 'sold') || (qty <= 0);

    return (
      <TouchableOpacity 
        style={[styles.card, isSoldOut && styles.cardDisabled]} 
        activeOpacity={0.9}
        disabled={isSoldOut}
      >
        <Image 
          source={{ uri: getImageForCrop(item.crop_type) }} 
          style={[styles.cardImage, isSoldOut && styles.imageDisabled]} 
        />
        
        {isSoldOut && (
          <View style={styles.soldOutOverlay}>
            <View style={styles.soldOutBadge}>
              <Text style={styles.soldOutText}>SOLD OUT</Text>
            </View>
          </View>
        )}

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cropTitle}>{item.crop_type}</Text>
              <View style={styles.farmerRow}>
                <Text style={styles.farmerName}>by {item.farmer_name || 'Farmer'}</Text>
                <View style={styles.ratingBox}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.ratingText}>{item.rating || '5.0'}</Text>
                </View>
              </View>
            </View>
            <View style={[
              styles.riskBadge, 
              { backgroundColor: item.spoilage_risk === 'red' ? '#fee2e2' : item.spoilage_risk === 'amber' ? '#fef3c7' : '#dcfce7' }
            ]}>
              <Text style={[
                styles.riskText, 
                { color: item.spoilage_risk === 'red' ? '#ef4444' : item.spoilage_risk === 'amber' ? '#f59e0b' : '#16a34a' }
              ]}>
                {(item.spoilage_risk || 'green').toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Package size={14} color="#64748b" />
              <Text style={styles.statText}>
                {isSoldOut ? 'No stock remaining' : `${item.quantity_kg}kg available`}
              </Text>
            </View>
            {item.distance_km != null && (
              <View style={styles.statItem}>
                <MapPin size={14} color="#64748b" />
                <Text style={styles.statText}>{item.distance_km}km away</Text>
              </View>
            )}
          </View>
  
          <View style={styles.footerRow}>
            <View>
              <Text style={styles.priceLabel}>Price / kg</Text>
              <Text style={styles.priceValue}>{item.currency || 'GHS'} {item.asking_price || '—'}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.offerButton, isSoldOut && styles.offerButtonDisabled]}
              onPress={() => !isSoldOut && openOffer(item)}
              activeOpacity={0.8}
              disabled={isSoldOut}
            >
              <Text style={styles.offerButtonText}>{isSoldOut ? 'Sold Out' : 'Make Offer'}</Text>
              {!isSoldOut && <ArrowRight size={16} color="#fff" />}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Marketplace</Text>
            <Text style={styles.subtitle}>Find fresh produce nearby</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={20} color="#94a3b8" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search for crops, farmers..."
            placeholderTextColor="#94a3b8"
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextActive
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>Loading harvests...</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={onRefresh}
              colors={['#22c55e']} // Android
              tintColor="#22c55e" // iOS
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No harvests available right now.</Text>
            </View>
          }
        />
      )}

      {/* Make Offer Modal */}
      <Modal
        visible={offerModal}
        transparent
        animationType="slide"
        onRequestClose={closeOffer}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />

              {success ? (
                <View style={styles.successContainer}>
                  <View style={styles.successIcon}>
                    <CheckCircle size={56} color="#22c55e" />
                  </View>
                  <Text style={styles.successTitle}>Offer Sent! 🎉</Text>
                  <Text style={styles.successSubtitle}>
                    Your offer for {selectedListing?.crop_type} has been submitted. The farmer will be notified shortly.
                  </Text>
                  <TouchableOpacity style={styles.doneButton} onPress={closeOffer}>
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={styles.modalHeader}>
                    <View>
                      <Text style={styles.modalTitle}>Make an Offer</Text>
                      <Text style={styles.modalSubtitle}>{selectedListing?.crop_type} · {selectedListing?.farmer_name}</Text>
                    </View>
                    <TouchableOpacity style={styles.closeBtn} onPress={closeOffer}>
                      <X size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.listingSnapshot}>
                    <Image source={{ uri: getImageForCrop(selectedListing?.crop_type || '') }} style={styles.snapshotImage} />
                    <View style={styles.snapshotInfo}>
                      <Text style={styles.snapshotLabel}>Available</Text>
                      <Text style={styles.snapshotValue}>{selectedListing?.quantity_kg}kg</Text>
                      <Text style={styles.snapshotLabel}>Listed At</Text>
                      <Text style={styles.snapshotValue}>{selectedListing?.currency || 'GHS'} {selectedListing?.asking_price}/kg</Text>
                    </View>
                  </View>

                  <Text style={styles.inputLabel}>Your Quantity (kg)</Text>
                  <View style={styles.inputRow}>
                    <Package size={18} color="#64748b" style={{ marginRight: 10 }} />
                    <TextInput
                      style={styles.modalInput}
                      placeholder="e.g. 200"
                      keyboardType="numeric"
                      value={offerQty}
                      onChangeText={setOfferQty}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <Text style={styles.inputLabel}>Your Price / kg ({selectedListing?.currency || 'GHS'})</Text>
                  <View style={styles.inputRow}>
                    <Tag size={18} color="#64748b" style={{ marginRight: 10 }} />
                    <TextInput
                      style={styles.modalInput}
                      placeholder="e.g. 13"
                      keyboardType="numeric"
                      value={offerPrice}
                      onChangeText={setOfferPrice}
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  {offerQty && offerPrice ? (
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Estimated Total</Text>
                      <Text style={styles.totalValue}>
                        {selectedListing?.currency || 'GHS'} {(parseFloat(offerQty) * parseFloat(offerPrice)).toFixed(2)}
                      </Text>
                    </View>
                  ) : null}

                  <TouchableOpacity 
                    style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                    onPress={submitOffer}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Submit Offer</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  topSection: {
    backgroundColor: '#fff',
    paddingBottom: 16,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 2 },
  filterButton: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center', alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8fafc',
    marginHorizontal: 24, paddingHorizontal: 16,
    borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1, paddingVertical: 12, marginLeft: 10,
    fontSize: 16, color: '#1e293b',
  },
  categoryScroll: { paddingLeft: 24 },
  categoryContent: { paddingRight: 40 },
  categoryChip: {
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 12, backgroundColor: '#f1f5f9', marginRight: 10,
  },
  categoryChipActive: { backgroundColor: '#22c55e' },
  categoryText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  categoryTextActive: { color: '#fff' },
  listContent: { padding: 24, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: '#64748b', fontSize: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyText: { color: '#94a3b8', fontSize: 15 },
  card: {
    backgroundColor: '#fff', borderRadius: 24, marginBottom: 24,
    overflow: 'hidden', elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12,
  },
  cardDisabled: { opacity: 0.8 },
  cardImage: { width: '100%', height: 160, backgroundColor: '#f1f5f9' },
  imageDisabled: { opacity: 0.5 },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 10,
  },
  soldOutBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 12, transform: [{ rotate: '-12deg' }],
    elevation: 8, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  soldOutText: {
    color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 1,
  },
  cardContent: { padding: 20 },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 12,
  },
  cropTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  farmerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  farmerName: { fontSize: 14, color: '#64748b' },
  ratingBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fffbeb', paddingHorizontal: 6,
    paddingVertical: 2, borderRadius: 6, gap: 4,
  },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#b45309' },
  riskBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  riskText: { fontSize: 10, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  footerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  priceLabel: { fontSize: 12, color: '#94a3b8', marginBottom: 2 },
  priceValue: { fontSize: 20, fontWeight: '800', color: '#22c55e' },
  offerButton: {
    backgroundColor: '#1e293b', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, gap: 8,
  },
  offerButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  offerButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  // Modal styles
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end', alignItems: 'center',
  },
  modalSheet: {
    width: '100%', backgroundColor: '#fff',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 28, paddingTop: 16,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#e2e8f0', alignSelf: 'center', marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b' },
  modalSubtitle: { fontSize: 14, color: '#64748b', marginTop: 2 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center',
  },
  listingSnapshot: {
    flexDirection: 'row', backgroundColor: '#f8fafc',
    borderRadius: 20, overflow: 'hidden', marginBottom: 24,
  },
  snapshotImage: { width: 90, height: 90 },
  snapshotInfo: { flex: 1, padding: 14, gap: 2 },
  snapshotLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  snapshotValue: { fontSize: 16, color: '#1e293b', fontWeight: '700', marginBottom: 4 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8fafc', borderRadius: 16,
    borderWidth: 1, borderColor: '#e2e8f0',
    paddingHorizontal: 16, paddingVertical: 4,
    marginBottom: 16,
  },
  modalInput: { flex: 1, fontSize: 16, color: '#1e293b', paddingVertical: 12 },
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', backgroundColor: '#f0fdf4',
    padding: 16, borderRadius: 16, marginBottom: 20,
  },
  totalLabel: { fontSize: 14, fontWeight: '600', color: '#16a34a' },
  totalValue: { fontSize: 20, fontWeight: '800', color: '#16a34a' },
  submitButton: {
    backgroundColor: '#22c55e', paddingVertical: 18,
    borderRadius: 20, alignItems: 'center',
    shadowColor: '#22c55e', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  submitButtonDisabled: { backgroundColor: '#94a3b8', shadowOpacity: 0, elevation: 0 },
  submitButtonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  successContainer: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  successIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  successTitle: { fontSize: 26, fontWeight: '800', color: '#1e293b' },
  successSubtitle: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22 },
  doneButton: {
    marginTop: 12, backgroundColor: '#22c55e',
    paddingVertical: 16, paddingHorizontal: 48, borderRadius: 20,
  },
  doneButtonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
