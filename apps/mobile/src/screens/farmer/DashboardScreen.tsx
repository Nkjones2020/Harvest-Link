import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SpoilageCountdown } from '../../components/SpoilageCountdown';
import { useFarmerStore } from '../../store/farmerStore';
import { useMyListings } from '../../api/listings';
import { Tractor, Users, AlertTriangle, TrendingUp, Bell, Search, Plus, MapPin } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const MOCK_LISTINGS = [
  {
    id: '1',
    crop_type: 'Tomatoes',
    quantity_kg: 500,
    harvest_date: '2026-05-01',
    storage_method: 'Open Air',
    spoilage_days: 2,
    spoilage_risk: 'red' as const,
    status: 'active',
  },
  {
    id: '2',
    crop_type: 'Maize',
    quantity_kg: 2000,
    harvest_date: '2026-04-20',
    storage_method: 'Silo',
    spoilage_days: 45,
    spoilage_risk: 'green' as const,
    status: 'active',
  },
  {
    id: '3',
    crop_type: 'Onions',
    quantity_kg: 800,
    harvest_date: '2026-04-28',
    storage_method: 'Grain Bag',
    spoilage_days: 4,
    spoilage_risk: 'amber' as const,
    status: 'active',
  },
];

export default function DashboardScreen({ navigation }: any) {
  const { listings: localListings } = useFarmerStore();
  const { data: serverListings, isLoading } = useMyListings();

  // Prefer server data, fallback to local (optimistic) then mock
  const listings = serverListings || (localListings.length > 0 ? localListings : MOCK_LISTINGS);

  const totalQuantity = listings.reduce((acc: number, curr: any) => acc + (curr.quantity_kg || 0), 0);
  const highRiskCount = listings.filter((l: any) => l.spoilage_risk === 'red').length;
  const matchesCount = 12; // Mock for now

  const renderStatCard = (label: string, value: string, icon: any, color: string) => (
    <View style={[styles.statCard, { backgroundColor: color + '15' }]}>
      <View style={[styles.statIconContainer, { backgroundColor: color }]}>
        {React.createElement(icon, { size: 20, color: '#fff' })}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: typeof MOCK_LISTINGS[0] }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Matches', { listingId: item.id, cropType: item.crop_type })}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cropInfo}>
          <Text style={styles.cropTitle}>{item.crop_type}</Text>
          <Text style={styles.quantityText}>{item.quantity_kg}kg</Text>
        </View>
        <SpoilageCountdown 
          spoilageDays={item.spoilage_days} 
          spoilageRisk={item.spoilage_risk} 
        />
      </View>
      
      <View style={styles.progressBarBg}>
        <View style={[
          styles.progressBarFill, 
          { 
            width: `${Math.max(10, 100 - (item.spoilage_days * 2))}%`, 
            backgroundColor: item.spoilage_risk === 'red' ? '#ef4444' : item.spoilage_risk === 'amber' ? '#f59e0b' : '#22c55e' 
          }
        ]} />
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Harvested: {item.harvest_date}</Text>
          <Text style={styles.infoText}>Storage: {item.storage_method}</Text>
        </View>
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>3 Matches</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' }} 
              style={styles.avatar}
            />
            <View>
              <Text style={styles.welcomeText}>Hello,</Text>
              <Text style={styles.userName}>John Farmer</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#64748b" />
            <Text style={styles.searchText}>Search harvests, buyers...</Text>
          </View>
          <TouchableOpacity 
            style={styles.mapToggleButton}
            onPress={() => navigation.navigate('Map')}
          >
            <MapPin size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Overview</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.statsScroll}
        >
          {renderStatCard('Total Crops', `${totalQuantity.toLocaleString()}kg`, Tractor, '#22c55e')}
          {renderStatCard('Matches', matchesCount.toString(), TrendingUp, '#3b82f6')}
          {renderStatCard('Spoilage Alerts', highRiskCount.toString(), AlertTriangle, '#f59e0b')}
          {renderStatCard('Active Buyers', '124', Users, '#8b5cf6')}
        </ScrollView>

        {/* Listings Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Harvests</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active listings found.</Text>
            </View>
          }
        />
      </ScrollView>

      {/* Action FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('HarvestLog')}
      >
        <Plus size={32} color="#fff" />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e2e8f0',
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mapToggleButton: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchText: {
    color: '#94a3b8',
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  seeAll: {
    color: '#22c55e',
    fontWeight: '600',
  },
  statsScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 20,
  },
  statCard: {
    width: 130,
    padding: 16,
    borderRadius: 24,
    marginRight: 12,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cropInfo: {
    flex: 1,
  },
  cropTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  quantityText: {
    fontSize: 15,
    color: '#22c55e',
    fontWeight: '600',
    marginTop: 2,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  infoRow: {
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  matchBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  matchText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
});
