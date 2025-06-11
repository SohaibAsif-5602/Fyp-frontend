import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Platform } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Fontisto } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import CONFIG from '../config';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permission not granted to get push token for push notification!');
      return;
    }

    const storedPushToken = await AsyncStorage.getItem('pushToken');
    if (storedPushToken) {
      return storedPushToken;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      alert('Project ID not found');
      return;
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      await AsyncStorage.setItem('pushToken', pushTokenString);

      return pushTokenString;
    } catch (e) {
      alert(`Error: ${e}`);
    }
  } else {
    alert('Must use physical device for push notifications');
  }
}

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const initializeNotifications = async () => {
      const storedPushToken = await AsyncStorage.getItem('pushToken');
      console.log('Stored push token:', storedPushToken);

      if (!storedPushToken) {
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setExpoPushToken(token);
          console.log('Push token:', token);
        } else {
          console.log('Failed to get push token');
        }
      } else {
        setExpoPushToken(storedPushToken);
      }

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setAlertMessage('Notification received!');
        setModalVisible(true);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
    };

    initializeNotifications();

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const Login = async () => {
    console.log('Logging in...');
    if (!email || !password) {
      setAlertMessage("Please fill in all fields.");
      setModalVisible(true);
      return;
    }

    try {
      const response = await axios.post(
        CONFIG.AUTH_URL + '/login',
        JSON.stringify({ email, password }), // Stringify the data here
        {
          headers: {
            'Content-Type': 'application/json', // Ensure proper content type is set
          },
        }
      );


      if (response.status === 200) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.setItem('role', response.data.role_name);
        
        setAlertMessage("Login successful!");

        // Get the latest push token
        const token = expoPushToken || await AsyncStorage.getItem('pushToken');

        if (token) {
          // Store the push token in the database
          const authToken = response.data.token;
          await axios.post(
            CONFIG.AUTH_URL + '/store-notification-token',
            { notification_token: token },
            {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
        }

        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('MainTabs');
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        setAlertMessage(`Error: ${error.response.data.message || error.response.data}`);
      } else if (error.request) {
        setAlertMessage("Network error: Please check your internet connection and try again.");
      } else {
        setAlertMessage(`Unexpected error: ${error.message}`);
      }
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.imgcontainer}>
      {/* Top Half (Blue) */}
      <View style={styles.topHalf}>
        <Image
          source={require('../assets/machiro.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Half (White) */}
      <View style={styles.bottomHalf}>
        <Text style={styles.txtsignin}>Sign in to your account</Text>
        <View style={styles.usercontainer}>
          <MaterialCommunityIcons
            name="email"
            size={24}
            color="#9A9A9A"
            style={styles.usericon}
          />
          <TextInput
            style={styles.usertextfield}
            placeholder="Email"
            placeholderTextColor="#9A9A9A"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.usercontainer}>
          <Fontisto name="locked" size={24} color="#9A9A9A" style={styles.usericon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9A9A9A"
            style={styles.usertextfield}
          />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <View style={styles.txtdontcontainer}>
            <Text style={styles.txtDont}>Forgot Password? </Text>
            <Text style={styles.txtcreate}>Click here</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={Login}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <View style={styles.txtdontcontainer}>
            <Text style={styles.txtDont}>Don't have an account? </Text>
            <Text style={styles.txtcreate}>Create now</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 150,
    backgroundColor: '#F8F9FA',
  },
  topHalf: {
    flex: 1,
    backgroundColor: '#04324d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomHalf: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 400,
  },
  logo: {
    width: 280,              // Slightly wider for a balanced look
    height: 60,
    padding: 35,
    marginBottom: 15,              // Maintain a slim height
    alignSelf: 'center',     // Center horizontally
    borderRadius: 25,        // More rounded corners for a smooth look
  },  
  imgcontainer: {
    flex: 1,
  },
  txthellocontainer: {
    width: '100%',
  },
  txtsignincontainer: {
    width: '100%',
    height: 40,
    marginBottom: 15
  },
  txtsignin: {
    paddingTop: 100,
    textAlign: 'center',
    fontSize: 28,
    color: 'black',
    fontWeight: '500',
    color: '#0077BE',
  },
  usercontainer: {
    flexDirection: 'row',
    paddingStart: 20,
    alignItems: 'center',
    elevation: 10,
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'white',
    marginHorizontal: 10,
    borderRadius: 20,
    marginVertical: 20,
  },
  usericon: {
    paddingStart: 10,
  },
  usertextfield: {
    paddingStart: 20,
    width: '80%',
    height: 50,
    fontSize: 20,
    color: 'black',
  },
  txtforgot: {
    fontSize: 20,
    color: '#0077BE',
    fontWeight: '500',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#0077BE',
    width: 150,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  txtdontcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  txtDont: {
    fontSize: 17,
  },
  txtcreate: {
    fontSize: 17,
    color: '#0077BE',
    fontWeight: '600',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  modalButton: {
    backgroundColor: '#0077BE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
