import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ProfileImage from '../assets/profile.jpeg';
import axios from 'axios'; // Import axios for API calls

const Setting = () => {
  const navigation = useNavigation();

  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const [areAlertsEnabled, setAreAlertsEnabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prevState) => !prevState);
  const toggleAutoAction = () => {
    setIsModalVisible(true); // Show modal when the switch is toggled
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const logout = async () => {
    console.log('Logging out...');
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const logout = async () => {
    console.log('Logging out...');
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], // Replace 'Login' with the name of your login screen
    });
  };

  const EditNav = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={
            userData.imagelink && userData.imagelink.startsWith('http')
              ? { uri: userData.imagelink }
              : require('../assets/profile.jpeg')
          }
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userData.username || 'N/A'}</Text>
        <Text style={styles.profileEmail}>{userData.email || 'N/A'}</Text>

      </View>

      {/* Profile Options */}
      <View style={styles.optionContainer}>
        <View style={styles.divider} />


        <TouchableOpacity style={styles.option} onPress={() => EditNav()}>
          <Icon name="person-outline" size={24} color="#000" />
          <Text style={styles.optionText}>View Profile</Text>
          <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>


        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('fishguide')}>
          <Icon name="book-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Fish Guide</Text>
          <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Fishbot')}>
          <Icon name="help-circle-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Help Center</Text>
          <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={logout}>
          <Icon name="exit-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Log Out</Text>
          <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: '#555',
    marginBottom: 10,
  },
  editProfileButton: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editProfileText: {
    color: '#fff',
  },
  optionContainer: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  appVersion: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  optionContainer: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default Setting;
