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
       const response = await axios.post(process.env.EXPO_PUBLIC_API_URL+'/sendEmail', {
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
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.txtdontcontainer}>
          <Text style={styles.txtDont}>Or sign in with</Text>
        </View>
        <View style={styles.iconcontainer}>
          <Entypo name="facebook" size={24} color="blue" style={styles.signinicon} />
          <Fontisto name="google" size={24} color="orange" style={styles.signinicon} />
          <AntDesign name="twitter" size={24} color="blue" style={styles.signinicon} />
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
    opacity: 1,
  },
  con: {
    paddingTop: 100,
  },
  txthellocontainer: {
    marginTop: 20,
    width: '100%',
    marginBottom: 20,
  },
  txthello: {
    textAlign: 'center',
    fontSize: 35,
    color: 'purple',
    fontWeight: '500',
  },
  usercontainer: {
    paddingStart: 20,
    alignItems: 'center',
    elevation: 10,
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'white',
    marginHorizontal: 40,
    borderRadius: 20,
    marginVertical: 15,
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
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'purple',
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 40,
    height: 30,
  },
  txtDont: {
    textAlign: 'center',
    fontSize: 14,
    color: 'purple',
    fontWeight: '500',
  },
  iconcontainer: {
    paddingLeft: 60,
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 40,
    height: 40,
  },
  signinicon: {
    backgroundColor: '#f0f0f0',
    height: 30,
    marginLeft: 10,
    width: 30,
    marginHorizontal: 10,
    elevation: 20,
    borderRadius: 25,
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
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  txtcreate1: {
    textAlign: 'center',
    fontSize: 19,
    color: 'purple',
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
    backgroundColor: 'purple',
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
