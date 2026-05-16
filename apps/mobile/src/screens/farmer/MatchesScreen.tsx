import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  Linking,
  Dimensions,
  Image
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Phone, MessageSquare, MapPin, TrendingDown, ChevronLeft, Star, Info, Search } from 'lucide-react-native';

const { width } = Dimensions.get('window');

import { API_BASE_URL } from '../../api/config';

export default function MatchesScreen({ route, navigation }: any) {
  const { listingId, cropType, spoilageRisk } = route.params || { listingId: '1', cropType: 'Tomatoes', spoilageRisk: 'red' };

  const { data: matches, isLoading } = useQuery({
    queryKey: ['matches', listingId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/listings/${listingId}/matches`);
      if (!res.ok) throw new Error('Failed to fetch matches');
      return res.json();
    },
    enabled: !!listingId,
  });

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.buyerInfo}>
          <Image 
            source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.buyer_name}` }} 
            style={styles.buyerAvatar} 
          />
          <View>
            <Text style={styles.buyerName}>{item.buyer_name}</Text>
            <View style={styles.ratingRow}>
              <Star size={12} color="#f59e0b" fill="#f59e0b" />
              <Text style={styles.ratingText}>4.9 • Verified Buyer</Text>
            </View>
          </View>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>{Math.round(item.score * 100)}% Match</Text>
        </View>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Buying Volume</Text>
          <Text style={styles.detailValue}>{item.quantity_kg}kg</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Max Price</Text>
          <Text style={styles.detailValue}>GHS {item.max_price}/kg</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Distance</Text>
          <Text style={styles.detailValue}>{item.distance_km?.toFixed(1) || '1.2'}km</Text>
        </View>
      </View>

      {spoilageRisk === 'red' && (
        <View style={styles.adviceBanner}>
          <Info size={16} color="#991b1b" />
          <Text style={styles.adviceText}>
            Smart Advice: High spoilage risk. Accepting this offer now prevents 100% loss.
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => handleCall(item.buyer_phone)}
        >
          <Phone size={20} color="#1e293b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <MessageSquare size={20} color="#1e293b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton}>
          <Text style={styles.acceptButtonText}>Accept Offer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1e293b" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Buyer Matches</Text>
          <Text style={styles.subtitle}>{cropType} • {matches?.length || 0} found</Text>
        </View>
      </View>

      <FlatList
        data={matches}
        renderItem={renderItem}
        keyExtractor={(item) => item.match_id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Search size={48} color="#94a3b8" />
            </View>
            <Text style={styles.emptyText}>Finding the best buyers for you...</Text>
            <Text style={styles.emptySubtext}>We're scanning the marketplace for the best proximity and price matches.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    gap: 16,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  listContent: {
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  buyerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buyerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f1f5f9',
  },
  buyerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  scoreBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16a34a',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  detailBox: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  adviceBanner: {
    flexDirection: 'row',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 16,
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  adviceText: {
    flex: 1,
    fontSize: 12,
    color: '#991b1b',
    fontWeight: '600',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
});
