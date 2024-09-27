// MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ponds from '../pages/ponds';
import ProfileScreen from '../pages/profile';
import Setting from '../pages/setting';
import Icon from 'react-native-vector-icons/Ionicons'; // Import icon library
import Analytics from "../pages/analytics";
import Subscription from "../pages/subscription";
import UserDetails from "../pages/UserDetails";

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Ponds') {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Setting') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // Return the icon component
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hide the header for all screens
      })}
    >
      <Tab.Screen name="Ponds" component={Ponds} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Setting" component={Setting} />
      
      
      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Subscription"
        component={Subscription}
        options={{ tabBarButton: () => null }}
        />
      <Tab.Screen
        name="UserDetails"
        component={UserDetails}
        options={{ tabBarButton: () => null }}
        />
    </Tab.Navigator>
  );
}

export default MainTabs;
