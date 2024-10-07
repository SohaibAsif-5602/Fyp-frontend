import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { DarkModeContext } from '../contexts/DarkModeContext'; // Import DarkModeContext

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const { isDarkMode } = useContext(DarkModeContext); // Access dark mode state

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      const response = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/sendResetCode', { email });
      if (response.status === 200) {
        navigation.navigate('ResetCodeVerification', { email });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Please Enter your Email Address</Text>
      <TextInput
        style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
        placeholder="Enter your email"
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Reset Code</Text>
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
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
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
    width: '100%',
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

export default ForgotPasswordScreen;
