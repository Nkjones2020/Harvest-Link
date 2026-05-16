import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Truck, FileText, Share2, Home } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function OrderSuccessScreen({ route, navigation }: any) {
  const { orderId, cropType, amount } = route.params || { orderId: 'ORD-7721', cropType: 'Tomatoes', amount: '200kg' };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.successHeader}>
          <View style={styles.iconCircle}>
            <CheckCircle size={64} color="#22c55e" />
          </View>
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.subtitle}>Your transaction for {amount} of {cropType} has been successfully processed.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            <Text style={styles.orderId}>{orderId}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.infoBox}>
              <Text style={styles.label}>EST. DELIVERY</Text>
              <Text style={styles.value}>Today, 4:00 PM</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.label}>STATUS</Text>
              <View style={styles.statusBadge}>
                <Truck size={14} color="#3b82f6" />
                <Text style={styles.statusText}>In Transit</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.impactBox}>
            <Text style={styles.impactTitle}>🌍 Social Impact</Text>
            <Text style={styles.impactText}>You just prevented 12.4kg of CO2 emissions by saving this harvest from spoilage!</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <FileText size={20} color="#1e293b" />
            <Text style={styles.secondaryBtnText}>View Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Share2 size={20} color="#1e293b" />
            <Text style={styles.secondaryBtnText}>Share Details</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('BuyerMain')}
        >
          <Home size={20} color="#fff" />
          <Text style={styles.primaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  successHeader: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 32,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  orderId: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBox: {
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3b82f6',
  },
  impactBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  impactTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  impactText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  primaryBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    backgroundColor: '#1e293b',
    borderRadius: 20,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
