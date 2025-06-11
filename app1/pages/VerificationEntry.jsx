import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import CONFIG from '../config';

const CodeVerificationScreen = ({ route, navigation }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const { email, password, username,role } = route.params;

  const handleVerifyCode = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length < 6) {
      Alert.alert('Validation Error', 'Please enter the full verification code.');
      return;
    }

    try {
      const verifyResponse = await axios.post(CONFIG.AUTH_URL + '/verify-otp', {
        email: email,
        code: verificationCode,
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.status === 200) {
        const signupResponse = await axios.post(CONFIG.AUTH_URL + '/signup', {
          email: email,
          password: password,
          username: username,
          role:role
        });

        if (signupResponse.status === 201) {
          Alert.alert('Success', 'Signup successful!');
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', 'Signup failed. Please try again.');
        }
      } else {
        Alert.alert('Error', verifyData.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again later.');
      console.error('Error:', error);
    }
  };

  const handleInputChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    // Automatically focus next input box
    if (text && index < 5) {
      inputs[index + 1].focus();
    }
  };

  let inputs = [];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter the verification code sent to {email}:</Text>
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(input) => (inputs[index] = input)}
            style={styles.codeInput}
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
        <Text style={styles.buttonText}>Verify Code</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  codeInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0077BE',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 30,
    top: '85%',
    right: '5%',
    alignSelf: 'center',
    elevation: 2,
    position: 'absolute',
    width: '28%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CodeVerificationScreen;