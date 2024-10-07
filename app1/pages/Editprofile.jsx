import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { DarkModeContext } from '../contexts/DarkModeContext';

const EditProfileScreen = () => {
  const [UserName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birth, setBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const { isDarkMode } = useContext(DarkModeContext); // Access dark mode state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          Alert.alert('Error', 'You must be logged in to view your profile.');
          return;
        }

        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const userData = response.data;
          setUserName(userData.username);
          setEmail(userData.email);
          setPhoneNumber(userData.contact_no ? userData.contact_no.toString() : '');
          setBirth(userData.D_O_B ? new Date(userData.D_O_B) : new Date());
          setGender(userData.gender);
          setProfileImage(userData.imagelink || '../assets/me.jpg');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    fetchUserData();
  }, []);

  const updateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'You must be logged in to update your profile.');
        return;
      }

      const data = {
        username: UserName,
        email: email,
        imagelink: profileImage,
        D_O_B: birth.toISOString().split('T')[0],
        contact_no: phoneNumber,
        gender: gender,
      };

      const response = await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/api/user`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setBirth(date);
    hideDatePicker();
  };

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.imageContainer}>
        <Image source={profileImage ? { uri: profileImage } : require('../assets/me.jpg')} style={styles.profileImage} />
        <TouchableOpacity style={[styles.editIcon, isDarkMode ? styles.darkEditIcon : styles.lightEditIcon]}>
        </TouchableOpacity>
      </View>

      <Text style={[styles.header, isDarkMode ? styles.darkText : styles.lightText]}>Edit Profile</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="User Name"
          placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
          value={UserName}
          onChangeText={setUserName}
        />
        <TextInput
          style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
          placeholder="Email"
          placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
          value={email}
          onChangeText={setEmail}
        />
        <View style={[styles.phoneContainer, isDarkMode ? styles.darkInput : styles.lightInput]}>
          <Text style={[styles.countryCode, isDarkMode ? styles.darkText : styles.lightText]}>+92</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Phone Number"
            placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]} onPress={showDatePicker}>
          <Text style={isDarkMode ? styles.darkText : styles.lightText}>{birth ? birth.toDateString() : 'Select Date of Birth'}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={birth}
        />

        <RNPickerSelect
          onValueChange={(value) => setGender(value)}
          items={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
          placeholder={{ label: 'Gender', value: null }}
          value={gender}
          style={pickerSelectStyles(isDarkMode)}
        />
      </View>

      <TouchableOpacity style={[styles.saveChangesButton, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={updateProfile}>
        <Text style={styles.saveChangesText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  lightEditIcon: {
    backgroundColor: '#007bff',
  },
  darkEditIcon: {
    backgroundColor: '#444',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  inputContainer: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  lightInput: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  darkInput: {
    color: '#fff',
    borderColor: '#555',
    backgroundColor: '#1e1e1e',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
  },
  countryCode: {
    paddingHorizontal: 10,
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    padding: 10,
    color: '#000',
  },
  saveChangesButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  lightButton: {
    backgroundColor: '#00bcd5',
  },
  darkButton: {
    backgroundColor: '#00bcd5',
  },
  saveChangesText: {
    color: '#fff',
    fontSize: 16,
  },
});

const pickerSelectStyles = (isDarkMode) => ({
  inputIOS: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#555' : '#ccc',
    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: isDarkMode ? '#fff' : '#000',
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: isDarkMode ? '#555' : '#ccc',
    backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: isDarkMode ? '#fff' : '#000',
  },
});

export default EditProfileScreen;
