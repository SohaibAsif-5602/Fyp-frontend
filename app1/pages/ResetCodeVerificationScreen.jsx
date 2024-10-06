import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const ResetCodeVerificationScreen = ({ route, navigation }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const { email } = route.params;

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
    <View style={styles.container}>
      <Text style={styles.title}>Verify Reset Code</Text>
      <View style={styles.inputContainer}>
        {code.map((_, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={code[index]}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(input) => inputs[index] = input}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'purple',
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
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ResetCodeVerificationScreen;
