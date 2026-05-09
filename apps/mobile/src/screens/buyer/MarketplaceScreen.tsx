import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Dimensions,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Filter, Star, Clock, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Vegetables', 'Grains', 'Roots & Tubers', 'Fruits'];

const MOCK_MARKETPLACE = [
  {
    id: '1',
    crop_type: 'Premium Tomatoes',
    quantity_kg: 500,
    asking_price: 15,
    currency: 'GHS',
    distance_km: 1.2,
    spoilage_risk: 'red' as const,
    farmer: 'Kwame A.',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1546097759-47d34da24411?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '2',
    crop_type: 'Red Onions',
    quantity_kg: 1200,
    asking_price: 8,
    currency: 'GHS',
    distance_km: 4.5,
    spoilage_risk: 'amber' as const,
    farmer: 'Sarah M.',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1508747703725-7197771375a0?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: '3',
    crop_type: 'White Maize',
    quantity_kg: 5000,
    asking_price: 12,
    currency: 'GHS',
    distance_km: 12.0,
    spoilage_risk: 'green' as const,
    farmer: 'Osei T.',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=200'
  },
];

import { useMarketplaceListings } from '../../api/listings';

export default function MarketplaceScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: serverListings, isLoading } = useMarketplaceListings();

  const listings = serverListings || MOCK_MARKETPLACE;

  const renderItem = ({ item }: { item: typeof MOCK_MARKETPLACE[0] }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cropTitle}>{item.crop_type}</Text>
            <View style={styles.farmerRow}>
              <Text style={styles.farmerName}>by {item.farmer_name || item.farmer || 'Unknown Farmer'}</Text>
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
              {item.spoilage_risk.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Clock size={14} color="#64748b" />
            <Text style={styles.statText}>{item.quantity_kg}kg</Text>
          </View>
          <View style={styles.statItem}>
            <MapPin size={14} color="#64748b" />
            <Text style={styles.statText}>{item.distance_km}km</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.priceLabel}>Price / kg</Text>
            <Text style={styles.priceValue}>{item.currency} {item.asking_price}</Text>
          </View>
          <TouchableOpacity style={styles.offerButton}>
            <Text style={styles.offerButtonText}>Make Offer</Text>
            <ArrowRight size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

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

      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    fontSize: 16,
    color: '#1e293b',
  },
  categoryScroll: {
    paddingLeft: 24,
  },
  categoryContent: {
    paddingRight: 40,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#22c55e',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f1f5f9',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cropTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  farmerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  farmerName: {
    fontSize: 14,
    color: '#64748b',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  riskText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  priceLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#22c55e',
  },
  offerButton: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  offerButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
