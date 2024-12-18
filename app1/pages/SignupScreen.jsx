import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    console.log("clicked");

    // Validate inputs
    if (!email || !password || !username || !confirmPassword) {
      setAlertMessage("Please fill in all fields");
      setModalVisible(true);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match");
      setModalVisible(true);
      return;
    }

   try {
       const response = await axios.post(process.env.EXPO_PUBLIC_API_URL+'/api/auth/sendEmail', {
        email: email,
      });

      // Handle success response
      //setAlertMessage("2fa Code Sent successfully");
      //setModalVisible(true);
      navigation.navigate('CodeVerification', { 
        email: email,
        password: password,
        username: username });
      // Navigate to the desired screen upon success
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('CodeVerification', { 
          email: email,
          password: password,
          username: username });
      }, 1500);
      
    } catch (error) {
      // Handle different error scenarios
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
    <View style={styles.container}>
      <View style={styles.con}>
        <View style={styles.txthellocontainer}>
          <Text style={styles.txthello}>Create Account</Text>
        </View>
        <View style={styles.usercontainer}>
          <FontAwesome name="user" size={24} color="#9A9A9A" style={styles.usericon} />
          <TextInput
            style={styles.usertextfield}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#9A9A9A"
          />
        </View>
        <View style={styles.usercontainer}>
          <MaterialCommunityIcons name="email" size={24} color="#9A9A9A" style={styles.usericon} />
          <TextInput
            style={styles.usertextfield}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#9A9A9A"
          />
        </View>
        <View style={styles.usercontainer}>
          <Fontisto name="locked" size={24} color="#9A9A9A" style={styles.usericon} />
          <TextInput
            style={styles.usertextfield}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#9A9A9A"
          />
        </View>
        <View style={styles.usercontainer}>
          <Fontisto name="locked" size={24} color="#9A9A9A" style={styles.usericon} />
          <TextInput
            style={styles.usertextfield}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor="#9A9A9A"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <View style={styles.txtdontcontainer1}>
            <Text style={styles.txtDont1}>Already have an account? </Text>
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

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light background for a clean look
    opacity: 1,
  },
  con: {
    paddingTop: 50,
    alignItems: 'center',
  },
  txthellocontainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  txthello: {
    textAlign: 'center',
    fontSize: 38,
    color: '#0077BE', // Slightly softer purple
    fontWeight: '600',
  },
  usercontainer: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    backgroundColor: 'white',
    height: 60,
    marginHorizontal: 20,
    borderRadius: 30, // More rounded corners
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  usericon: {
    paddingStart: 10,
  },
  usertextfield: {
    paddingStart: 15,
    flex: 1, // Adjust width automatically
    height: 60,
    fontSize: 18,
    color: '#333', // Darker text color
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#0077BE', // Primary button color
    width: 160,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  txtdontcontainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  txtDont: {
    fontSize: 15,
    color: '#6A0DAD',
    fontWeight: '500',
  },
  iconcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    height: 40,
  },
  txtdontcontainer1: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  txtDont1: {
    fontSize: 17,
    color: '#333',
  },
  txtcreate1: {
    fontSize: 17,
    color: '#0077BE',
    fontWeight: '600',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: 320,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#6A0DAD',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

