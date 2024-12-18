import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';


import Setting from './setting';
import NotificationScreen from './notifications';
import Dashboard from './dashboard';

const Tab = createBottomTabNavigator();


function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;


     

          
            if (route.name === 'Dashboard') {

            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4584a8',
        tabBarInactiveTintColor: '#E0E0E0',
        tabBarStyle: {
          backgroundColor: '#04324d',
          paddingBottom: 15,
          height: 60,
          
        },
        tabBarHideOnKeyboard: true,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />

      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Settings" component={Setting} />
      
    </Tab.Navigator>
  );
}

export default MainTabs;
