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
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, ArrowRight, Tractor, ShoppingBag, ShieldCheck } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { API_BASE_URL } from '../../api/config';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }: any) {
  const setUser = useAuthStore(state => state.setUser);
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (phone.length < 9) return;
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      const contentType = res.headers.get('content-type');
      let data: any;
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || 'Server returned an error');
      }

      if (!res.ok) throw new Error(data?.error || 'Login failed');

      setUser(data.user, data.access_token);

      // Navigate based on the selected role, provided the user has that role
      const targetRole = data.user.roles?.includes(role) ? role : data.user.role;

      if (targetRole === 'farmer') {
        navigation.navigate('FarmerStack');
      } else {
        navigation.navigate('BuyerStack');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        Alert.alert('Timeout', 'The server took too long to respond. Please check if your API Gateway is running and your IP is correct.');
      } else {
        Alert.alert('Connection Error', err.message || 'Could not connect to the server. Please check your internet or API IP.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800' }}
        style={styles.heroImage}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.heroContent}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>HL</Text>
            </View>
            <Text style={styles.heroTitle}>HarvestLink</Text>
            <Text style={styles.heroSubtitle}>Connecting the roots of agriculture to the heart of the market.</Text>
          </SafeAreaView>
        </View>
      </ImageBackground>

      <View style={styles.loginCard}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Welcome Back</Text>
          <Text style={styles.sectionSubtitle}>Please select your role and sign in.</Text>

          <View style={styles.roleContainer}>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'farmer' && styles.roleButtonActive]}
              onPress={() => setRole('farmer')}
            >
              <View style={[styles.roleIcon, role === 'farmer' && styles.roleIconActive]}>
                <Tractor size={24} color={role === 'farmer' ? '#fff' : '#64748b'} />
              </View>
              <Text style={[styles.roleText, role === 'farmer' && styles.roleTextActive]}>Farmer</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.roleButton, role === 'buyer' && styles.roleButtonActive]}
              onPress={() => setRole('buyer')}
            >
              <View style={[styles.roleIcon, role === 'buyer' && styles.roleIconActive]}>
                <ShoppingBag size={24} color={role === 'buyer' ? '#fff' : '#64748b'} />
              </View>
              <Text style={[styles.roleText, role === 'buyer' && styles.roleTextActive]}>Buyer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
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
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, (phone.length < 9 || loading) && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={phone.length < 9 || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Sign In</Text>
                <ArrowRight size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <View style={styles.secureBadge}>
              <ShieldCheck size={14} color="#16a34a" />
              <Text style={styles.secureText}>Secure Verification</Text>
            </View>
            <TouchableOpacity 
              style={styles.registerLink}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.noAccountText}>Don't have an account? </Text>
              <Text style={styles.registerText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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
    height: height * 0.45,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 32,
  },
  heroContent: {
    marginBottom: 40,
  },
  logoBadge: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    lineHeight: 24,
  },
  loginCard: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 32,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#22c55e',
    borderWidth: 2,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
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
  roleIconActive: {
    backgroundColor: '#22c55e',
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
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 18,
    color: '#1e293b',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 24,
    gap: 12,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 20,
  },
  secureText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '700',
  },
  registerLink: {
    flexDirection: 'row',
  },
  noAccountText: {
    color: '#64748b',
    fontSize: 15,
  },
  registerText: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: '700',
  },
});
