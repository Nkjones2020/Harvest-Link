import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, 
  TextInput, ScrollView, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CreditCard, Smartphone, ShieldCheck, 
  ChevronLeft, CheckCircle2, Lock
} from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../../api/config';
import { useAuthStore } from '../../store/authStore';

export default function PaymentScreen({ route, navigation }: any) {
  const { offer } = route.params;
  const token = useAuthStore(state => state.token);
  const queryClient = useQueryClient();
  
  const [method, setMethod] = useState<'card' | 'momo'>('momo');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalAmount = offer.proposed_price * (offer.quantity_kg || offer.listing_qty);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const res = await fetch(`${API_BASE_URL}/offers/${offer.offer_id}/pay`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          method,
          amount: totalAmount,
          listing_id: offer.listing_id
        })
      });

      if (!res.ok) throw new Error('Payment failed');

      // Invalidate queries to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ['my-offers'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      setSuccess(true);
    } catch (error: any) {
      Alert.alert('Payment Error', `Reason: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <CheckCircle2 size={80} color="#22c55e" />
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successText}>
            GHS {totalAmount.toLocaleString()} has been secured in escrow. 
            The farmer has been notified and will prepare your harvest for collection.
          </Text>
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => navigation.navigate('BuyerMain')}
          >
            <Text style={styles.doneButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.title}>Secure Payment</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total to Pay</Text>
            <Text style={styles.summaryAmount}>GHS {totalAmount.toLocaleString()}</Text>
            <View style={styles.summaryDetails}>
              <Text style={styles.summaryRow}>
                {offer.crop_type} ({offer.quantity_kg || offer.listing_qty}kg) @ GHS {offer.proposed_price}/kg
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.methodContainer}>
            <TouchableOpacity 
              style={[styles.methodBtn, method === 'momo' && styles.methodBtnActive]}
              onPress={() => setMethod('momo')}
            >
              <Smartphone size={24} color={method === 'momo' ? '#22c55e' : '#64748b'} />
              <Text style={[styles.methodText, method === 'momo' && styles.methodTextActive]}>Mobile Money</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.methodBtn, method === 'card' && styles.methodBtnActive]}
              onPress={() => setMethod('card')}
            >
              <CreditCard size={24} color={method === 'card' ? '#22c55e' : '#64748b'} />
              <Text style={[styles.methodText, method === 'card' && styles.methodTextActive]}>Bank Card</Text>
            </TouchableOpacity>
          </View>

          {method === 'momo' ? (
            <View style={styles.form}>
              <Text style={styles.label}>Mobile Money Number</Text>
              <TextInput 
                style={styles.input}
                placeholder="024 000 0000"
                keyboardType="phone-pad"
              />
              <Text style={styles.hint}>You will receive a prompt on your phone to authorize payment.</Text>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.label}>Card Number</Text>
              <TextInput 
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                keyboardType="number-pad"
              />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Expiry Date</Text>
                  <TextInput style={styles.input} placeholder="MM/YY" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>CVV</Text>
                  <TextInput style={styles.input} placeholder="123" secureTextEntry />
                </View>
              </View>
            </View>
          )}

          <View style={styles.securityNote}>
            <Lock size={14} color="#64748b" />
            <Text style={styles.securityText}>Your payment is secured with bank-grade encryption.</Text>
          </View>

          <TouchableOpacity 
            style={[styles.payBtn, loading && styles.payBtnDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <ShieldCheck size={20} color="#fff" />
                <Text style={styles.payBtnText}>Approve Payment</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  scrollContent: { padding: 24 },
  summaryCard: {
    backgroundColor: '#1e293b', borderRadius: 24, padding: 28,
    marginBottom: 32, elevation: 8, shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15,
  },
  summaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 8 },
  summaryAmount: { color: '#fff', fontSize: 36, fontWeight: '800' },
  summaryDetails: { marginTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16 },
  summaryRow: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
  methodContainer: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  methodBtn: {
    flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 16,
    alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: '#e2e8f0',
  },
  methodBtnActive: { borderColor: '#22c55e', backgroundColor: '#f0fdf4' },
  methodText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  methodTextActive: { color: '#16a34a' },
  form: { gap: 20, marginBottom: 32 },
  label: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    fontSize: 16, borderWidth: 1, borderColor: '#e2e8f0', color: '#1e293b',
  },
  hint: { fontSize: 12, color: '#64748b', lineHeight: 18 },
  securityNote: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 24 },
  securityText: { fontSize: 12, color: '#64748b' },
  payBtn: {
    backgroundColor: '#22c55e', borderRadius: 20, paddingVertical: 18,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12,
    elevation: 4, shadowColor: '#22c55e', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  payBtnDisabled: { backgroundColor: '#cbd5e1', shadowOpacity: 0 },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, gap: 24 },
  successTitle: { fontSize: 28, fontWeight: '800', color: '#1e293b', textAlign: 'center' },
  successText: { fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 24 },
  doneButton: {
    backgroundColor: '#1e293b', paddingHorizontal: 32, paddingVertical: 16,
    borderRadius: 20, marginTop: 12,
  },
  doneButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
