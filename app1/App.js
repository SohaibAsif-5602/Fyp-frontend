import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, StatusBar, View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
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
import logo from './assets/machiro.png';
import Analytics from './pages/analytics';
import Editprofile from './pages/Editprofile';
import FishGuideScreen from './pages/fishguide';
import Fishbot from './pages/fishbot';
import Transaction from './pages/transaction';
import addTransaction  from './pages/addtransaction';
import EditPond from './pages/Editpond';
import Pond from './pages/ponds';
import FarmSetup from './pages/farmSetup';
import CategoriesPage from './pages/categories';

const Stack = createStackNavigator();

// Custom Header Component
function CustomHeader({ navigation, canGoBack }) {
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


export default function App() {
  const [isNewUser, setIsNewUser] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRegistration = async () => {
      try {
        const userRegistered = await AsyncStorage.getItem('userRegistered');
        if (userRegistered) {
          setIsNewUser(false);
        }
      } catch (error) {
        console.error('Error reading user registration status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRegistration();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#04324d' }}>
        {/* StatusBar Configuration */}
        <StatusBar
          barStyle="light-content"
          backgroundColor="#04324d"
          translucent={Platform.OS === 'ios' ? true : false}
        />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#04324d' }}>
          <DarkModeProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName={isNewUser ? 'SplashScreen' : 'Login'}
                screenOptions={({ navigation, route }) => ({
                  header: () =>
                    route.name !== 'Login' && route.name !== 'SplashScreen' &&  route.name !== 'Signup' ? (
                      <CustomHeader
                        navigation={navigation}
                        canGoBack={route.name !== 'MainTabs' && route.name !== 'SplashScreen' && route.name !== 'Login' && route.name !== 'Signup'} 
                      />
                    ) : null,
                })}
              >
                {/* Screens */}
                <Stack.Screen name="MainTabs" component={MainTabs} />
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
                <Stack.Screen name="Analytics" component={Analytics} />
                <Stack.Screen name="EditProfile" component={Editprofile} />
                <Stack.Screen name="Transaction" component={Transaction} />
                <Stack.Screen name="AddTransaction" component={addTransaction} />
                <Stack.Screen name="EditPond" component={EditPond} />
                <Stack.Screen name="Pond" component={Pond} />
                <Stack.Screen name="FarmSetup" component={FarmSetup} />
                <Stack.Screen name="Categories" component={CategoriesPage} />
              </Stack.Navigator>
            </NavigationContainer>
          </DarkModeProvider>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

