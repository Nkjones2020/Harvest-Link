import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, AlertTriangle, TrendingUp, ShoppingBag, ChevronLeft, Trash2 } from 'lucide-react-native';

const MOCK_NOTIFS = [
  {
    id: '1',
    type: 'alert',
    title: 'Spoilage Warning!',
    body: 'Your Batch #8821 (Tomatoes) is reaching a critical risk level. Consider dropping the price to sell faster.',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    type: 'match',
    title: 'New Buyer Match!',
    body: 'Fresh Mart Accra is looking for 200kg of Maize. They are only 2.4km away from your farm.',
    time: '15m ago',
    read: false,
  },
  {
    id: '3',
    type: 'order',
    title: 'Order Completed',
    body: 'Transaction for 500kg of Onions has been confirmed. Payment is being processed.',
    time: '1h ago',
    read: true,
  },
];

export default function NotificationsScreen({ navigation }: any) {
  const renderItem = ({ item }: { item: typeof MOCK_NOTIFS[0] }) => (
    <TouchableOpacity style={[styles.notifCard, !item.read && styles.unreadCard]}>
      <View style={[styles.iconBox, { backgroundColor: item.type === 'alert' ? '#fee2e2' : item.type === 'match' ? '#dcfce7' : '#dbeafe' }]}>
        {item.type === 'alert' && <AlertTriangle size={20} color="#ef4444" />}
        {item.type === 'match' && <TrendingUp size={20} color="#22c55e" />}
        {item.type === 'order' && <ShoppingBag size={20} color="#3b82f6" />}
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          <Text style={styles.notifTime}>{item.time}</Text>
        </View>
        <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity>
          <Trash2 size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_NOTIFS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Bell size={64} color="#e2e8f0" />
            <Text style={styles.emptyText}>All caught up!</Text>
          </View>
        }
      />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  listContent: {
    padding: 16,
  },
  notifCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
    alignItems: 'center',
  },
  unreadCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  notifTime: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  notifBody: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 16,
    fontWeight: '600',
  },
});
