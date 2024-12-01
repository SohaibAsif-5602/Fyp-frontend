import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, StatusBar, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AddPond from './pages/AddPond';
import LoginScreen from './pages/loginscreen';
import SignupScreen from "./pages/SignupScreen";
import ForgotPassword from './pages/ForgotPasswordScreen';
import ResetCodeVerificationScreen from './pages/ResetCodeVerificationScreen';
import ResetPasswordScreen from "./pages/ResetPasswordScreen";
import Subscription from "./pages/subscription";
import UserDetails from "./pages/UserDetails";
import AlertSettingsPage from './pages/alertsettingspage';
import PondSetting from './pages/pondsetting';
import SplashScreen from './pages/splashscreen';
import MainTabs from './pages/Maintabs';
import CodeVerificationScreen from './pages/VerificationEntry';
if (Platform.OS === 'android' || Platform.OS === 'ios') {
  StatusBar.setBarStyle('light-content'); // Optional: change the bar style if needed
  StatusBar.setHidden(false); // Ensure it's visible
  StatusBar.setTranslucent(true); // Make it translucent if needed
  StatusBar.setBackgroundColor('#04324d'); // Optional: set a background color for status bar
}
if (Platform.OS === 'ios' || Platform.OS === 'android') {
  StatusBar.setBarStyle('dark-content'); // Optional: change the bar style if needed
  StatusBar.setHidden(false); // Ensure it's visible
 }
const Stack = createStackNavigator();

export default function App() {
  const [isNewUser, setIsNewUser] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Check AsyncStorage for user registration status
  useEffect(() => {
    const checkUserRegistration = async () => {
      try {
        const userRegistered = await AsyncStorage.getItem('userRegistered');
        if (userRegistered) {
          setIsNewUser(false);  // Skip splash screen if user is already registered
        }
      } catch (error) {
        console.error('Error reading user registration status:', error);
      } finally {
        setIsLoading(false);  // Stop loading regardless of result
      }
    };

    checkUserRegistration();
  }, []);

  if (isLoading) {
    // You can show a loading spinner here while checking registration status
    return null;
  }

  return (
    <SafeAreaProvider>

    <SafeAreaView style={{ flex: 1 }}>

    <DarkModeProvider>
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isNewUser ? 'SplashScreen' : 'Login'}  // Show SplashScreen for new users, Login for returning users
        // initialRouteName='MainTabs'
        screenOptions={{
          headerShown: false,
          
          
          // Customize based on your needs
        }}
        
      >
        {/* Screens */}
        <Stack.Screen name="MainTabs" component={MainTabs}  />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetCodeVerification" component={ResetCodeVerificationScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Subscription" component={Subscription} />
        <Stack.Screen name="PondSetting" component={PondSetting} />
        <Stack.Screen name="AlertSettingsPage" component={AlertSettingsPage} />
        <Stack.Screen name="UserDetails" component={UserDetails} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="CodeVerification" component={CodeVerificationScreen} />
        <Stack.Screen name="AddPond" component={AddPond} />

      </Stack.Navigator>
    </NavigationContainer>
    </DarkModeProvider>
    </SafeAreaView>
    </SafeAreaProvider>

  );
}
