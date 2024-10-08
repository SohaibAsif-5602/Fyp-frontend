import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { DarkModeContext } from '../contexts/DarkModeContext'; // Import DarkModeContext

const ResetCodeVerificationScreen = ({ route, navigation }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const { email } = route.params;
  const { isDarkMode } = useContext(DarkModeContext); // Access dark mode state

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit verification code');
      return;
    }

    try {
      const response = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/verifyResetCode', { email, code: verificationCode });
      if (response.status === 200) {
        navigation.navigate('ResetPassword', { email, code: verificationCode });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid code. Please try again.');
    }
  };

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Automatically focus on the next input if current input is filled
    if (text && index < 5) {
      inputs[index + 1].focus();
    }
  };

  // Create refs for each input field
  const inputs = [];

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Verify Reset Code</Text>
      <View style={styles.inputContainer}>
        {code.map((_, index) => (
          <TextInput
            key={index}
            style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
            value={code[index]}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(input) => inputs[index] = input}
            placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
          />
        ))}
      </View>
      <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={handleVerify}>
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
  },
  lightContainer: {
    backgroundColor: '#f2f2f2',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  lightText: {
    color: '#00bcd5',
  },
  darkText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '80%',
  },
  input: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 24,
  },
  lightInput: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  darkInput: {
    backgroundColor: '#1e1e1e',
    borderColor: '#555',
    color: '#fff',
  },
  button: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  lightButton: {
    backgroundColor: '#00bcd5',
  },
  darkButton: {
    backgroundColor: '#00bcd5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ResetCodeVerificationScreen;
