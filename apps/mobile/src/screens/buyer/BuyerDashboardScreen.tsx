import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Image,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag, MapPin, Scan, TrendingDown, Clock, Search, Bell, ChevronRight, Star } from 'lucide-react-native';
import { useMarketplaceListings } from '../../api/listings';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Purchases', value: '12', icon: ShoppingBag, color: '#3b82f6' },
  { label: 'Active Bids', value: '4', icon: TrendingDown, color: '#22c55e' },
  { label: 'Crops Saved', value: '450kg', icon: Clock, color: '#f59e0b' },
];

export default function BuyerDashboardScreen({ navigation }: any) {
  const { data: listings } = useMarketplaceListings();

  // Highlight urgent harvests nearby
  const urgentHarvests = listings?.filter((l: any) => l.spoilage_risk === 'red').slice(0, 3) || [];

  const renderStatCard = (item: typeof STATS[0]) => (
    <View style={[styles.statCard, { backgroundColor: item.color + '10' }]}>
      <View style={[styles.statIcon, { backgroundColor: item.color }]}>
        <item.icon size={20} color="#fff" />
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Fresh Mart Accra</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell size={24} color="#1e293b" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Action Grid */}
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#1e293b' }]}
            onPress={() => navigation.navigate('Map')}
          >
            <MapPin size={32} color="#fff" />
            <Text style={styles.actionText}>Find Near Me</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: '#22c55e' }]}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Scan size={32} color="#fff" />
            <Text style={styles.actionText}>Scan Batch</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          {STATS.map((s, idx) => (
            <React.Fragment key={s.label}>
              {renderStatCard(s)}
            </React.Fragment>
          ))}
        </View>

        {/* Urgent Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Flash Deals ⚡️</Text>
            <Text style={styles.sectionSubtitle}>High spoilage risk - Buy now & save 20%</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Marketplace')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={urgentHarvests}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.urgentScroll}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.urgentCard} onPress={() => navigation.navigate('Marketplace')}>
              <View style={styles.urgentImageContainer}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=200' }} 
                  style={styles.urgentImage} 
                />
                <View style={styles.urgentBadge}>
                  <Text style={styles.urgentBadgeText}>URGENT</Text>
                </View>
              </View>
              <View style={styles.urgentContent}>
                <Text style={styles.urgentTitle}>{item.crop_type}</Text>
                <View style={styles.farmerRow}>
                  <Text style={styles.urgentFarmer}>{item.farmer_name || 'Farmer'}</Text>
                  <View style={styles.ratingBox}>
                    <Star size={10} color="#f59e0b" fill="#f59e0b" />
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                </View>
                <Text style={styles.urgentPrice}>GHS {item.asking_price}/kg</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyUrgent}>
              <Text style={styles.emptyText}>No urgent deals nearby right now.</Text>
            </View>
          }
        />

        {/* Recent Purchases */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Orders</Text>
        </View>
        
        <View style={styles.orderCard}>
          <View style={styles.orderIcon}>
            <ShoppingBag size={24} color="#3b82f6" />
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>Tomatoes (200kg)</Text>
            <Text style={styles.orderDate}>Ordered 2 hours ago • In Transit</Text>
          </View>
          <ChevronRight size={20} color="#cbd5e1" />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 2,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  notifDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  actionGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    height: 130,
    borderRadius: 28,
    padding: 20,
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  actionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    width: (width - 48 - 32) / 3,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  seeAll: {
    color: '#22c55e',
    fontWeight: '700',
    fontSize: 14,
  },
  urgentScroll: {
    paddingLeft: 24,
    paddingRight: 8,
    paddingBottom: 32,
  },
  urgentCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  urgentImageContainer: {
    height: 120,
    width: '100%',
  },
  urgentImage: {
    width: '100%',
    height: '100%',
  },
  urgentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgentBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  urgentContent: {
    padding: 16,
  },
  urgentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  farmerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  urgentFarmer: {
    fontSize: 12,
    color: '#64748b',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  urgentPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#22c55e',
    marginTop: 8,
  },
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 24,
    gap: 16,
  },
  orderIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  orderDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  emptyUrgent: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});
