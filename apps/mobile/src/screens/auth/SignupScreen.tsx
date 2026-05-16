import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, User, ArrowRight, Tractor, ShoppingBag, ShieldCheck, Mail } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { API_BASE_URL } from '../../api/config';

const { width, height } = Dimensions.get('window');

export default function SignupScreen({ navigation }: any) {
  const setUser = useAuthStore(state => state.setUser);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');

  const handleSignup = async () => {
    if (!name || phone.length < 9) {
      Alert.alert('Missing Information', 'Please provide your name and a valid phone number.');
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');

      setUser(data.user, data.access_token);

      Alert.alert(
        'Success', 
        `Account created as a ${role}! Welcome to HarvestLink.`,
        [{ text: 'Get Started', onPress: () => navigation.navigate(role === 'farmer' ? 'FarmerStack' : 'BuyerStack') }]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800' }}
        style={styles.heroImage}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.heroContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.heroTitle}>Join HarvestLink</Text>
            <Text style={styles.heroSubtitle}>Start your journey towards a more sustainable and profitable harvest.</Text>
          </SafeAreaView>
        </View>
      </ImageBackground>

      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'farmer' && styles.roleButtonActive]}
              onPress={() => setRole('farmer')}
            >
              <Tractor size={24} color={role === 'farmer' ? '#22c55e' : '#64748b'} />
              <Text style={[styles.roleText, role === 'farmer' && styles.roleTextActive]}>Farmer</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.roleButton, role === 'buyer' && styles.roleButtonActive]}
              onPress={() => setRole('buyer')}
            >
              <ShoppingBag size={24} color={role === 'buyer' ? '#22c55e' : '#64748b'} />
              <Text style={[styles.roleText, role === 'buyer' && styles.roleTextActive]}>Buyer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <User size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Phone size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="024 123 4567"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <Text style={styles.label}>Email (Optional)</Text>
            <View style={styles.inputWrapper}>
              <Mail size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.signupButton} 
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>Create Account</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroImage: {
    width: width,
    height: height * 0.35,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 32,
  },
  heroContent: {
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    lineHeight: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  roleButtonActive: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  roleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  roleTextActive: {
    color: '#16a34a',
  },
  inputSection: {
    gap: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1e293b',
  },
  signupButton: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#64748b',
    fontSize: 14,
  },
  loginLinkBold: {
    color: '#22c55e',
    fontWeight: '700',
  },
});
