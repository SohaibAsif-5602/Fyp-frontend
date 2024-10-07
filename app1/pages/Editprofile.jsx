import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Import the modal date picker

const EditProfileScreen = () => {
  const [UserName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birth, setBirth] = useState(new Date()); // State for date of birth
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false); // State to show/hide date picker

  // Function to fetch user data when the component mounts
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

  // Function to handle updating the profile
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
        D_O_B: birth.toISOString().split('T')[0], // Format the date to YYYY-MM-DD
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

  // Show date picker
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  // Hide date picker
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  // Handle date picked
  const handleConfirm = (date) => {
    setBirth(date);
    hideDatePicker();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image source={profileImage ? { uri: profileImage } : require('../assets/me.jpg')} style={styles.profileImage} />
        <TouchableOpacity style={styles.editIcon}>
          <Icon name="camera-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Edit Profile Header */}
      <Text style={styles.header}>Edit Profile</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          value={UserName}
          onChangeText={setUserName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.phoneContainer}>
          <Text style={styles.countryCode}>+92</Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Date of Birth Picker */}
        <TouchableOpacity style={styles.input} onPress={showDatePicker}>
          <Text>{birth ? birth.toDateString() : 'Select Date of Birth'}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={birth}
        />

        {/* Gender Picker */}
        <RNPickerSelect
          onValueChange={(value) => setGender(value)}
          items={[
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
          placeholder={{ label: 'Gender', value: null }}
          value={gender}
          style={pickerSelectStyles}
        />
      </View>

      {/* Save Changes Button */}
      <TouchableOpacity style={styles.saveChangesButton} onPress={updateProfile}>
        <Text style={styles.saveChangesText}>Save Changes</Text>
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
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 120,
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
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
  },
  saveChangesButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveChangesText: {
    color: '#fff',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: '#000',
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: '#000',
  },
});

export default EditProfileScreen;
