import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, TouchableOpacity } from 'react-native';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import DashboardScreen from '../screens/farmer/DashboardScreen';
import HarvestLogScreen from '../screens/farmer/HarvestLogScreen';
import FarmerOffersScreen from '../screens/farmer/FarmerOffersScreen';
import MatchesScreen from '../screens/farmer/MatchesScreen';
import MapScreen from '../screens/common/MapScreen';
import ScannerScreen from '../screens/common/ScannerScreen';
import OrderSuccessScreen from '../screens/common/OrderSuccessScreen';
import NotificationsScreen from '../screens/common/NotificationsScreen';
import BuyerDashboardScreen from '../screens/buyer/BuyerDashboardScreen';
import MarketplaceScreen from '../screens/buyer/MarketplaceScreen';
import BuyerOffersScreen from '../screens/buyer/BuyerOffersScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import PaymentScreen from '../screens/buyer/PaymentScreen';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ShoppingBag, Map as MapIcon, User, PlusCircle, Handshake } from 'lucide-react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BuyerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') return <Home size={size} color={color} />;
          if (route.name === 'Marketplace') return <ShoppingBag size={size} color={color} />;
          if (route.name === 'MyOffers') return <Handshake size={size} color={color} />;
          if (route.name === 'Profile') return <User size={size} color={color} />;
          return null;
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
        tabBarStyle: { 
          paddingBottom: Platform.OS === 'ios' ? 25 : 10, 
          height: Platform.OS === 'ios' ? 90 : 70,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarButton: (props: any) => (
          <TouchableOpacity 
            {...props} 
            activeOpacity={0.7} 
            style={[props.style, Platform.OS === 'web' && { cursor: 'pointer' }]} 
          />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={BuyerDashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
      <Tab.Screen name="MyOffers" component={BuyerOffersScreen} options={{ title: 'My Offers' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function BuyerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BuyerMain" 
        component={BuyerTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Scanner" 
        component={ScannerScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="OrderSuccess" 
        component={OrderSuccessScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function FarmerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Dashboard') return <Home size={size} color={color} />;
          if (route.name === 'HarvestLog') return <PlusCircle size={size} color={color} />;
          if (route.name === 'FarmerOffers') return <Handshake size={size} color={color} />;
          if (route.name === 'Profile') return <User size={size} color={color} />;
          return null;
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
        tabBarStyle: { 
          paddingBottom: Platform.OS === 'ios' ? 25 : 10, 
          height: Platform.OS === 'ios' ? 90 : 70,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
         },
        tabBarButton: (props: any) => (
          <TouchableOpacity 
            {...props} 
            activeOpacity={0.7} 
            style={[props.style, Platform.OS === 'web' && { cursor: 'pointer' }]} 
          />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="HarvestLog" component={HarvestLogScreen} options={{ title: 'Post Harvest' }} />
      <Tab.Screen name="FarmerOffers" component={FarmerOffersScreen} options={{ title: 'Offers' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function FarmerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FarmerMain" 
        component={FarmerTabs} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Matches" 
        component={MatchesScreen} 
        options={{ title: 'Buyer Matches' }}
      />
      <Stack.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="FarmerStack" 
          component={FarmerStack} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="BuyerStack" 
          component={BuyerStack} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
