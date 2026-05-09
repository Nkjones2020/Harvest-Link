import React from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useMarketplaceListings } from '../../api/listings';
import { ChevronLeft, Filter, MapPin } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function MapScreen({ navigation }: any) {
  const { data: listings } = useMarketplaceListings();

  // Create Leaflet HTML
  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
        .custom-marker {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border-radius: 20px;
          border: 3px solid white;
          font-size: 20px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map', { zoomControl: false }).setView([5.6037, -0.1870], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(map);

        const listings = ${JSON.stringify(listings || [])};
        
        listings.forEach(l => {
          const color = l.spoilage_risk === 'red' ? '#ef4444' : l.spoilage_risk === 'amber' ? '#f59e0b' : '#22c55e';
          const emoji = l.crop_type === 'Tomatoes' ? '🍅' : '🌽';
          
          const icon = L.divIcon({
            className: 'custom-div-icon',
            html: \`<div class="custom-marker" style="background-color: \${color}">\${emoji}</div>\`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });

          L.marker([l.latitude || 5.6037, l.longitude || -0.1870], { icon })
            .addTo(map)
            .bindPopup(\`<b>\${l.crop_type}</b><br>\${l.quantity_kg}kg available\`);
        });

        // Communication to React Native
        map.on('click', function() {
          window.ReactNativeWebView.postMessage('map_clicked');
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView 
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
      />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <ChevronLeft size={24} color="#1e293b" />
          </TouchableOpacity>
          <View style={styles.searchPrompt}>
            <Text style={styles.searchPromptText}>Live Harvest Map</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Filter size={20} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSection} pointerEvents="box-none">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
            {listings?.map((listing: any) => (
              <TouchableOpacity 
                key={listing.id} 
                style={styles.horizontalCard}
                onPress={() => {}} // Could inject JS to move map
              >
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{listing.crop_type}</Text>
                  <Text style={styles.cardFarmer}>by {listing.farmer_name || 'Farmer'}</Text>
                  <Text style={styles.cardPrice}>GHS {listing.asking_price}/kg</Text>
                </View>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: listing.spoilage_risk === 'red' ? '#ef4444' : '#22c55e' }
                ]} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 12,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchPrompt: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchPromptText: {
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  cardScroll: {
    paddingLeft: 20,
  },
  horizontalCard: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginRight: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  cardFarmer: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22c55e',
    marginTop: 4,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
