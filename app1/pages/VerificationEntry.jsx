import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios'; // Make sure axios is imported

const CodeVerificationScreen = ({ route, navigation }) => {
  const [code, setCode] = useState('');
  const { email, password, username } = route.params; // Passed data from previous screen

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert("Validation Error", "Please enter the verification code.");
      return;
    }

    try {
      // First, verify the email and code
      const verifyResponse = await fetch(process.env.EXPO_PUBLIC_API_URL+'/verifyCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyResponse.ok) {
        const signupResponse = await axios.post(process.env.EXPO_PUBLIC_API_URL+'/signup', {
          email: email,
          password: password,
          username: username
        });

        if (signupResponse.status === 201) {
          Alert.alert("Success", "Signup successful!");
          navigation.navigate('Login'); // Navigate to login screen after successful signup
        } else {
          Alert.alert("Error", "Signup failed. Please try again.");
        }
      } else {
        Alert.alert("Error", verifyData.message);
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again later.");
      console.error("Error:", error); // Log the error for debugging purposes
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter the verification code sent to {email}:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
        autoCapitalize="none"
      />
      <Button title="Verify Code" onPress={handleVerifyCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default CodeVerificationScreen;
