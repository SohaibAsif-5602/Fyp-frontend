import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import { DarkModeContext } from '../contexts/DarkModeContext'; // Import DarkModeContext

import logo from '../assets/logo.png';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkModeContext); // Access dark mode state

  const handleSubmit = async () => {
    console.log("clicked");

    if (!email || !password || !username || !confirmPassword) {
      setAlertMessage("Please fill in all fields");
      setModalVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match");
      setModalVisible(true);
      return;
    }

    try {
      const response = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/sendEmail', {
        email: email,
      });

      navigation.navigate('CodeVerification', {
        email: email,
        password: password,
        username: username
      });

      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('CodeVerification', {
          email: email,
          password: password,
          username: username
        });
      }, 1500);

    } catch (error) {
      if (error.response) {
        setAlertMessage(`Signup failed: ${error.response.data.message || error.response.data}`);
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
      <View style={styles.con}>
        <View style={styles.imgcontainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.txthellocontainer}>
          <Text style={[styles.txthello, isDarkMode ? styles.darkText : styles.lightText]}>Create Account</Text>
        </View>
        <View style={[styles.usercontainer, isDarkMode ? styles.darkInput : styles.lightInput]}>
          <FontAwesome name="user" size={24} color="#9A9A9A" style={styles.usericon} />
          <TextInput
            style={[styles.usertextfield, isDarkMode ? styles.darkText : styles.lightText]}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor={isDarkMode ? '#ccc' : '#9A9A9A'}
          />
        </View>
        <View style={[styles.usercontainer, isDarkMode ? styles.darkInput : styles.lightInput]}>
          <MaterialCommunityIcons name="email" size={24} color="#9A9A9A" style={styles.usericon} />
          <TextInput
            style={[styles.usertextfield, isDarkMode ? styles.darkText : styles.lightText]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={isDarkMode ? '#ccc' : '#9A9A9A'}
          />
        </View>
        <View style={[styles.usercontainer, isDarkMode ? styles.darkInput : styles.lightInput]}>
          <Fontisto name="locked" size={24} color="#9A9A9A" style={styles.usericon} />
          <TextInput
            style={[styles.usertextfield, isDarkMode ? styles.darkText : styles.lightText]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={isDarkMode ? '#ccc' : '#9A9A9A'}
          />
        </View>
        <View style={[styles.usercontainer, isDarkMode ? styles.darkInput : styles.lightInput]}>
          <Fontisto name="locked" size={24} color="#9A9A9A" style={styles.usericon} />
          <TextInput
            style={[styles.usertextfield, isDarkMode ? styles.darkText : styles.lightText]}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor={isDarkMode ? '#ccc' : '#9A9A9A'}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSubmit} style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <View style={styles.txtdontcontainer1}>
            <Text style={[styles.txtDont1, isDarkMode ? styles.darkText : styles.lightText]}>Already have an account? </Text>
            <Text style={styles.txtcreate1}>Login now</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Custom Alert Modal */}
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

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    opacity: 1,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
  },
  con: {
    paddingTop: 20,
  },
  txthellocontainer: {
    marginTop: 20,
    width: '100%',
    marginBottom: 20,
  },
  txthello: {
    textAlign: 'center',
    fontSize: 35,
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
    marginVertical: 15,
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
  txtdontcontainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 40,
    height: 30,
  },
  txtDont1: {
    fontSize: 16,
    fontWeight: '500',
  },
  txtcreate1: {
    fontSize: 19,
    color: '#00bcd5',
    fontWeight: '500',
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
    borderRadius: 10,
    alignItems: 'center',
  },
  lightModal: {
    backgroundColor: 'white',
  },
  darkModal: {
    backgroundColor: '#333',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
