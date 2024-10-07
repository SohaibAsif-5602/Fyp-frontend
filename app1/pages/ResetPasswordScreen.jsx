import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { DarkModeContext } from '../contexts/DarkModeContext'; // Import DarkModeContext

const ResetPasswordScreen = ({ route, navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { email, code } = route.params;
  const { isDarkMode } = useContext(DarkModeContext); // Access dark mode state

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await axios.post(process.env.EXPO_PUBLIC_API_URL + '/resetPassword', {
        email,
        code,
        newPassword,
      });
      if (response.status === 200) {
        Alert.alert('Success', 'Your password has been reset successfully');
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Reset Password</Text>
      <TextInput
        style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
        placeholder="New Password"
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
        placeholder="Confirm New Password"
        placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
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

export default ResetPasswordScreen;
