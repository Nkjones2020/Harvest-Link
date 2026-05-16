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
import { Bell, AlertTriangle, TrendingUp, ShoppingBag, ChevronLeft, Trash2, Banknote, Clock } from 'lucide-react-native';
import { useNotifications, useMarkNotificationRead, useClearNotifications } from '../../api/notifications';
import { ActivityIndicator, RefreshControl } from 'react-native';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}



export default function NotificationsScreen({ navigation }: any) {
  const { data: notifications = [], isLoading, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const clearAll = useClearNotifications();

  const handlePress = (item: any) => {
    if (!item.is_read) {
      markRead.mutate(item.id);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.notifCard, !item.is_read && styles.unreadCard]}
      onPress={() => handlePress(item)}
    >
      <View style={[styles.iconBox, { 
        backgroundColor: 
          item.type === 'alert' ? '#fee2e2' : 
          item.type === 'match' ? '#dcfce7' : 
          item.type === 'payment' ? '#fef3c7' : '#dbeafe' 
      }]}>
        {item.type === 'alert' && <AlertTriangle size={20} color="#ef4444" />}
        {item.type === 'match' && <TrendingUp size={20} color="#22c55e" />}
        {item.type === 'payment' && <Banknote size={20} color="#f59e0b" />}
        {item.type === 'info' && <Bell size={20} color="#3b82f6" />}
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          <Text style={styles.notifTime}>{timeAgo(item.created_at)}</Text>
        </View>
        <Text style={styles.notifBody} numberOfLines={2}>{item.message}</Text>
      </View>
      {!item.is_read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={28} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={() => clearAll.mutate()}>
          <Trash2 size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Bell size={64} color="#e2e8f0" />
              <Text style={styles.emptyText}>All caught up!</Text>
            </View>
          }
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
