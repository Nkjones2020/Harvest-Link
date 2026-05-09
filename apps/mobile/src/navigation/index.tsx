import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/auth/LoginScreen';
import DashboardScreen from '../screens/farmer/DashboardScreen';
import HarvestLogScreen from '../screens/farmer/HarvestLogScreen';
import MatchesScreen from '../screens/farmer/MatchesScreen';
import MapScreen from '../screens/common/MapScreen';
import ScannerScreen from '../screens/common/ScannerScreen';
import OrderSuccessScreen from '../screens/common/OrderSuccessScreen';
import NotificationsScreen from '../screens/common/NotificationsScreen';
import BuyerDashboardScreen from '../screens/buyer/BuyerDashboardScreen';
import MarketplaceScreen from '../screens/buyer/MarketplaceScreen';

const Stack = createNativeStackNavigator();

function BuyerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BuyerDashboard" 
        component={BuyerDashboardScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Marketplace" 
        component={MarketplaceScreen} 
        options={{ title: 'Marketplace' }}
      />
      <Stack.Screen 
        name="Map" 
        component={MapScreen} 
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
    </Stack.Navigator>
  );
}

function FarmerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="HarvestLog" 
        component={HarvestLogScreen} 
        options={{ title: 'New Harvest' }}
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
