import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function PurchaseRequestScreen({ navigation }: any) {
  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleRequest = () => {
    alert('Purchase request created! You will be notified of matches.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Place Order</Text>
            <Text style={styles.subtitle}>Tell us what you need and we'll find matches</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>What crop are you looking for?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Tomatoes"
              value={cropType}
              onChangeText={setCropType}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Quantity Needed (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1000"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Maximum Price (per kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleRequest}>
            <Text style={styles.submitButtonText}>Create Standing Order</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  submitButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
