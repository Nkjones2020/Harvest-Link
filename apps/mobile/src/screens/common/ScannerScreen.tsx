import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions,
  Modal,
  Image
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X, Zap, ShieldCheck, ChevronRight, AlertTriangle } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';

const { width, height } = Dimensions.get('window');

const API_BASE_URL = 'http://localhost:3005/api';

export default function ScannerScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [torch, setTorch] = useState(false);

  // Fetch listing details when scanned
  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', scannedId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/listings/${scannedId}`);
      if (!res.ok) throw new Error('Not found');
      return res.json();
    },
    enabled: !!scannedId,
  });

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!scannedId) {
      setScannedId(data);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={StyleSheet.absoluteFill} 
        onBarcodeScanned={handleBarcodeScanned}
        enableTorch={torch}
      >
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
              <X size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTorch(!torch)} style={styles.torchBtn}>
              <Zap size={24} color={torch ? '#facc15' : '#fff'} />
            </TouchableOpacity>
          </View>

          <View style={styles.scanFrameContainer}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.scanText}>Scan the QR on the harvest crate</Text>
          </View>

          <View style={styles.bottomBar}>
            <View style={styles.infoBadge}>
              <ShieldCheck size={16} color="#22c55e" />
              <Text style={styles.infoText}>HarvestLink Verified Traceability</Text>
            </View>
          </View>
        </View>
      </CameraView>

      {/* Result Modal */}
      <Modal
        visible={!!scannedId}
        transparent
        animationType="slide"
        onRequestClose={() => setScannedId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Batch Identified</Text>
              <TouchableOpacity onPress={() => setScannedId(null)} style={styles.modalClose}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <Text style={styles.loadingText}>Fetching live spoilage data...</Text>
            ) : listing ? (
              <View>
                <View style={styles.listingHeader}>
                  <View style={[styles.riskCircle, { borderColor: listing.spoilage_risk === 'red' ? '#ef4444' : '#22c55e' }]}>
                    <Text style={styles.cropEmoji}>{listing.crop_type === 'Tomatoes' ? '🍅' : '🌽'}</Text>
                  </View>
                  <View style={styles.listingInfo}>
                    <Text style={styles.cropName}>{listing.crop_type}</Text>
                    <Text style={styles.farmerName}>by {listing.farmer_name || 'John Farmer'}</Text>
                  </View>
                </View>

                <View style={styles.riskRow}>
                  <View style={styles.riskInfo}>
                    <Text style={styles.riskLabel}>SPOILAGE RISK</Text>
                    <Text style={[styles.riskValue, { color: listing.spoilage_risk === 'red' ? '#ef4444' : '#22c55e' }]}>
                      {listing.spoilage_risk.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.riskInfo}>
                    <Text style={styles.riskLabel}>SHELF LIFE</Text>
                    <Text style={styles.riskValue}>{listing.spoilage_days} Days Left</Text>
                  </View>
                </View>

                {listing.spoilage_risk === 'red' && (
                  <View style={styles.urgentAlert}>
                    <AlertTriangle size={18} color="#991b1b" />
                    <Text style={styles.urgentText}>Urgent: Buy now to prevent waste!</Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={styles.actionBtn}
                  onPress={() => {
                    setScannedId(null);
                    navigation.navigate('Marketplace');
                  }}
                >
                  <Text style={styles.actionBtnText}>Make an Offer</Text>
                  <ChevronRight size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Invalid QR Code or Harvest ID</Text>
                <TouchableOpacity onPress={() => setScannedId(null)} style={styles.retryBtn}>
                  <Text style={styles.retryBtnText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
  },
  button: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    padding: 24,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  torchBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrameContainer: {
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 0,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#22c55e',
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 20 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 20 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 20 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 20 },
  scanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 32,
    textAlign: 'center',
  },
  bottomBar: {
    alignItems: 'center',
    marginBottom: 40,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  modalClose: {
    padding: 4,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748b',
    marginTop: 40,
  },
  listingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  riskCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cropEmoji: {
    fontSize: 32,
  },
  cropName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
  },
  farmerName: {
    fontSize: 14,
    color: '#64748b',
  },
  riskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 24,
    marginBottom: 20,
  },
  riskLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 4,
  },
  riskValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  urgentAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
  },
  urgentText: {
    color: '#991b1b',
    fontWeight: '700',
    fontSize: 14,
  },
  actionBtn: {
    backgroundColor: '#22c55e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 20,
    gap: 12,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#1e293b',
    fontWeight: '700',
  },
});
