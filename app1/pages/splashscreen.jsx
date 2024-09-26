import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../assets/background.jpg'; 

const SplashScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('userRegistered', 'true');
      navigation.replace('Signup');
    } catch (error) {
      console.error('Error saving user registration status:', error);
    }
  };

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#00ADEF', // Adjust color to your theme
    marginTop: 640,
    paddingVertical: 20,
    paddingHorizontal: 70,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
