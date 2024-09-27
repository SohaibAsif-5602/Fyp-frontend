// MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ponds from '../pages/ponds';
import ProfileScreen from '../pages/profile';
import Setting from '../pages/setting';
import Analytics from '../pages/analytics';
import AddPond from '../pages/AddPond';
import AlertHistory from "../pages/alerthistory";



const Tab = createBottomTabNavigator();

function CustomHeader({ title, canGoBack }) {
    const navigation = useNavigation();
  
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', height: 80, backgroundColor: '#00bcd4', paddingHorizontal: 5 }}>
        {canGoBack && (
          <TouchableOpacity 
            onPress={() => { console.log("clicked"); navigation.goBack(); }} 
            style={{ marginLeft: 0, padding: 10 }} // Added padding to ensure touchable area
          >
            <Icon name="arrow-back" size={28} color="#fff" paddingTop={35} />
          </TouchableOpacity>
        )}
        <Text 
          style={{ 
            fontSize: 28, 
            color: '#fff', 
            flex: 1, 
            paddingTop: 30, 
            textAlign: 'center', 
            marginLeft: canGoBack ? -20 : 0 
          }}
        >
          {title}
        </Text>
      </View>
    );
  }
  
  

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
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        header: ({ route }) => (
          <CustomHeader 
            title={route.name} 
            canGoBack={route.name !== 'Ponds' && route.name !== 'Profile' && route.name !== 'Settings'} 
          />
        ),
      })}
    >
      <Tab.Screen name="Ponds" component={Ponds} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={Setting} />
      
      <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="AddPond"
        component={AddPond}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="AlertHistory"
        component={AlertHistory}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}

export default MainTabs;
