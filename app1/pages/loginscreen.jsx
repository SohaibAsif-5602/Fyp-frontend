
import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Platform } from 'react-native';
import React, { useState, useRef, useEffect,useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Fontisto } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeContext } from '../contexts/DarkModeContext'; // Import DarkModeContext
import logo from '../assets/logo.png';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

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

  const { isDarkMode } = useContext(DarkModeContext); // Access dark mode state

  const Login = async () => {
    if (!email || !password) {
      setAlertMessage("Please fill in all fields.");
      setModalVisible(true);
      return;
    }

    try {
      const response = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/login', {
        email,
        password,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem('token', response.data.token);
        setAlertMessage("Login successful!");

        // Get the latest push token
        const token = expoPushToken || await AsyncStorage.getItem('pushToken');

        if (token) {
          // Store the push token in the database
          const authToken = response.data.token;
          await axios.post(
            process.env.EXPO_PUBLIC_API_URL + '/api/store-notification-token',
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
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.imgcontainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.txtsignincontainer}>
        <Text style={[styles.txtsignin, isDarkMode ? styles.darkText : styles.lightText]}>Sign in to your account</Text>
      </View>
      <View style={[styles.usercontainer, isDarkMode ? styles.darkInput : styles.lightInput]}>
        <MaterialCommunityIcons name="email" size={24} color="#9A9A9A" style={styles.usericon} />
        <TextInput
          style={[styles.usertextfield, isDarkMode ? styles.darkText : styles.lightText]}
          placeholder="Email"
          placeholderTextColor={isDarkMode ? '#ccc' : '#9A9A9A'}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={[styles.usercontainer, isDarkMode ? styles.darkInput : styles.lightInput]}>
        <Fontisto name="locked" size={24} color="#9A9A9A" style={styles.usericon} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={isDarkMode ? '#ccc' : '#9A9A9A'}
          style={[styles.usertextfield, isDarkMode ? styles.darkText : styles.lightText]}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <View style={styles.txtdontcontainer}>
          <Text style={[styles.txtDont, isDarkMode ? styles.darkText : styles.lightText]}>Forgot Password </Text>
          <Text style={styles.txtcreate}>Click here</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={Login}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <View style={styles.txtdontcontainer}>
          <Text style={[styles.txtDont, isDarkMode ? styles.darkText : styles.lightText]}>Don't have an account? </Text>
          <Text style={styles.txtcreate}>Create now</Text>
        </View>
      </TouchableOpacity>

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, isDarkMode ? styles.darkModal : styles.lightModal]}>
            <Text style={[styles.modalText, isDarkMode ? styles.darkText : styles.lightText]}>{alertMessage}</Text>
            <TouchableOpacity
              style={[styles.modalButton, isDarkMode ? styles.darkButton : styles.lightButton]}
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
    paddingTop: 50,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  logo: {
    width: 280,
    height: 280,
    alignSelf: 'center',
  },
  txtsignincontainer: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  txtsignin: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  usercontainer: {
    paddingStart: 20,
    alignItems: 'center',
    elevation: 10,
    flexDirection: 'row',
    height: 50,
    borderRadius: 20,
    marginHorizontal: 40,
    marginVertical: 20,
  },
  lightInput: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  darkInput: {
    backgroundColor: '#1e1e1e',
    borderColor: '#555',
    borderWidth: 1,
  },
  usertextfield: {
    paddingStart: 20,
    width: '80%',
    height: 50,
    fontSize: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    width: 150,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightButton: {
    backgroundColor: '#00bcd5',
  },
  darkButton: {
    backgroundColor: '#444',
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
    marginHorizontal: 40,
    height: 20,
  },
  txtDont: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500',
  },
  txtcreate: {
    textAlign: 'center',
    fontSize: 19,
    color: '#00bcd5',
    fontWeight: '500',
  },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContainer: {
//     width: 300,
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   lightModal: {
//     backgroundColor: 'white',
//   },
//   darkModal: {
//     backgroundColor: '#333',
//   },
//   modalText: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   modalButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   modalButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
});
