import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import Screens
import Ponds from '../pages/ponds';
import ProfileScreen from '../pages/profile';
import Setting from '../pages/setting';
import Analytics from '../pages/analytics';
import Subscription from '../pages/subscription';
import UserDetails from '../pages/UserDetails';
import AddPond from '../pages/AddPond';
import AlertHistory from '../pages/alerthistory';
import EditProfileScreen from './Editprofile';
import NotificationScreen from './notifications';
import logo from '../assets/machiro.png';

const Tab = createBottomTabNavigator();

function CustomHeader({ title, canGoBack }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#04324d',
        paddingHorizontal: 5,
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {canGoBack && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: [{ translateY: -14 }],
            justifyContent: 'center',
            alignItems: 'center',
            width: 50,
            height: 50,
            zIndex: 10,
          }}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" color="#fff" size={30} />
        </TouchableOpacity>
      )}
      <Image
        style={{
          height: 30,
          width: 'auto',
          resizeMode: 'contain',
          flex: 1,
        }}
        source={logo}
      />
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
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4584a8',
        tabBarInactiveTintColor: '#E0E0E0',
        tabBarStyle: {
          backgroundColor: '#04324d',
          paddingBottom: 10,
          height: 60,
          
        },
        tabBarHideOnKeyboard: true,
        header: ({ navigation, route, options }) => (
          <CustomHeader
            title={options.title}
            canGoBack={route.name !== 'Ponds' && route.name !== 'Profile' && route.name !== 'Settings'}
          />
        ),
      })}
    >
      <Tab.Screen name="Ponds" component={Ponds} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Settings" component={Setting} />
      <Tab.Screen
        name="AddPond"
        component={AddPond}
        options={{
          tabBarStyle:{display:'none'}
        }}
      />
      {/* <Tab.Screen
        name="Analytics"
        component={Analytics}
        options={{tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Subscription"
        component={Subscription}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="UserDetails"
        component={UserDetails}
        options={{
          tabBarButton: () => null,
        }}
      />
      
      <Tab.Screen
        name="AlertHistory"
        component={AlertHistory}
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Edit Profile"
        component={EditProfileScreen}
        options={{
          tabBarButton: () => null,
        }}
      /> */}
    </Tab.Navigator>
  );
}

export default MainTabs;
