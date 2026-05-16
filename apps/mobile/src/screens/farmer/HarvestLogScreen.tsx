import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFarmerStore } from '../../store/farmerStore';
import { ChevronLeft, Calendar, Package, Warehouse, Wind, ThermometerSnowflake, Tag, TrendingUp } from 'lucide-react-native';
import { useCreateListing } from '../../api/listings';

const CROP_TYPES = [
  { name: 'Tomatoes', emoji: '🍅' },
  { name: 'Maize', emoji: '🌽' },
  { name: 'Onions', emoji: '🧅' },
  { name: 'Cassava', emoji: '🥔' },
  { name: 'Yam', emoji: '🍠' },
  { name: 'Plantain', emoji: '🍌' },
  { name: 'Pepper', emoji: '🌶️' },
  { name: 'Cabbage', emoji: '🥬' },
  { name: 'Carrot', emoji: '🥕' },
  { name: 'Beans', emoji: '🫘' },
  { name: 'Mango', emoji: '🥭' },
  { name: 'Orange', emoji: '🍊' },
  { name: 'Pineapple', emoji: '🍍' },
  { name: 'Avocado', emoji: '🥑' },
  { name: 'Watermelon', emoji: '🍉' },
  { name: 'Papaya', emoji: '🥣' }, // Papaya doesn't have a direct emoji, bowl is often used or mango/peach
  { name: 'Banana', emoji: '🍌' },
  { name: 'Okra', emoji: '🥗' },
  { name: 'Cucumber', emoji: '🥒' },
  { name: 'Spinach', emoji: '🌿' },
  { name: 'Ginger', emoji: '🫚' },
  { name: 'Garlic', emoji: '🧄' },
  { name: 'Lettuce', emoji: '🥬' }
];

const STORAGE_METHODS = [
  { label: 'Open Air', value: 'open_air', icon: Wind },
  { label: 'Grain Bag', value: 'grain_bag', icon: Package },
  { label: 'Cold Store', value: 'cold_store', icon: ThermometerSnowflake },
  { label: 'Silo', value: 'silo', icon: Warehouse },
];

export default function HarvestLogScreen({ navigation }: any) {
  const [cropType, setCropType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [askingPrice, setAskingPrice] = useState('');
  const [storageMethod, setStorageMethod] = useState('');
  const { addPendingListing } = useFarmerStore();
  const createListing = useCreateListing();

  const handleSave = async () => {
    if (!cropType || !quantity || !storageMethod) {
      return;
    }

    const payload = {
      cropType: cropType.toLowerCase(),
      quantityKg: parseFloat(quantity),
      harvestDate: new Date().toISOString().split('T')[0],
      storageMethod,
      askingPrice: askingPrice ? parseFloat(askingPrice) : undefined,
      latitude: 0,
      longitude: 0,
    };

    try {
      // 1. Optimistic update in local store
      addPendingListing({
        local_id: Math.random().toString(36).substring(7),
        ...payload
      });

      // 2. Call API (if backend is running)
      await createListing.mutateAsync(payload);
      
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.warn('API Error, saved locally:', error);
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Harvest Log</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.illustrationContainer}>
            <View style={styles.circleBg} />
            <Text style={{ fontSize: 64 }}>🌾</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Select Crop</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cropScroll}>
              {CROP_TYPES.map((crop) => (
                <TouchableOpacity 
                  key={crop.name}
                  style={[
                    styles.cropChip,
                    cropType === crop.name && styles.cropChipActive
                  ]}
                  onPress={() => setCropType(crop.name)}
                >
                  <Text style={styles.cropEmoji}>{crop.emoji}</Text>
                  <Text style={[
                    styles.cropText,
                    cropType === crop.name && styles.cropTextActive
                  ]}>{crop.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Quantity & Date</Text>
            <View style={styles.row}>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Package size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Quantity (kg)"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </View>
              <View style={[styles.inputWrapper, { flex: 1, marginLeft: 12 }]}>
                <Calendar size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Today"
                  editable={false}
                  value={new Date().toLocaleDateString()}
                />
              </View>
            </View>
          </View>

          {/* ── Asking Price ── */}
          <View style={styles.section}>
            <Text style={styles.label}>Initial Asking Price</Text>
            <View style={styles.inputWrapper}>
              <Tag size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Price per kg (GHS)"
                keyboardType="numeric"
                value={askingPrice}
                onChangeText={setAskingPrice}
              />
              <Text style={styles.currencyLabel}>GHS / kg</Text>
            </View>
            {/* Price tip */}
            <View style={styles.priceTipCard}>
              <TrendingUp size={16} color="#3b82f6" />
              <Text style={styles.priceTipText}>
                Tip: Set a competitive price to attract buyers faster. Buyers can make counter-offers.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Storage Method</Text>
            <View style={styles.storageGrid}>
              {STORAGE_METHODS.map((method) => (
                <TouchableOpacity 
                  key={method.value}
                  style={[
                    styles.storageCard,
                    storageMethod === method.value && styles.storageCardActive
                  ]}
                  onPress={() => setStorageMethod(method.value)}
                >
                  <View style={[
                    styles.methodIcon,
                    storageMethod === method.value && styles.methodIconActive
                  ]}>
                    <method.icon size={24} color={storageMethod === method.value ? '#fff' : '#64748b'} />
                  </View>
                  <Text style={[
                    styles.methodText,
                    storageMethod === method.value && styles.methodTextActive
                  ]}>{method.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.saveButton,
              (!cropType || !quantity || !storageMethod) && styles.saveButtonDisabled
            ]} 
            onPress={handleSave}
            disabled={!cropType || !quantity || !storageMethod}
          >
            <Text style={styles.saveButtonText}>Calculate Spoilage Risk</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  scrollContent: {
    padding: 24,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    height: 120,
  },
  circleBg: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0fdf4',
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  cropScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  cropChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cropChipActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  cropEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  cropText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  cropTextActive: {
    color: '#16a34a',
  },
  row: {
    flexDirection: 'row',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  currencyLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
    paddingLeft: 8,
  },
  priceTipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  priceTipText: {
    flex: 1,
    fontSize: 13,
    color: '#3b82f6',
    lineHeight: 20,
    fontWeight: '500',
  },
  storageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  storageCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 16,
    margin: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  storageCardActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  methodIconActive: {
    backgroundColor: '#22c55e',
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  methodTextActive: {
    color: '#16a34a',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
