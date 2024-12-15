import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const EditProfileScreen = () => {
  const [UserName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birth, setBirth] = useState(new Date());
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null); // To store the image file
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
const [pickedImage, setPickedImage] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'You must be logged in to view your profile.');
          return;
        }

        const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/users`, {
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access media library is required!');
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
  

    if (!result.canceled) {
      const fixImage = result.assets[0];
        setPickedImage(fixImage)  // Ensure this is correct
        console.log('Picked Image:', pickedImage);
        setProfileImage(fixImage.uri);
        setImageFile({
          base64: pickedImage.base64,
            uri: pickedImage.uri,
            name: pickedImage.fileName || 'profile.jpg', // Default name if fileName is missing
            type: pickedImage.type || 'image/jpeg', // Default type if missing
        });
        
    }
};


  const updateProfile = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'You must be logged in to update your profile.');
            return;
        }

        const formData = new FormData();
        formData.append('username', UserName);
        formData.append('email', email);
        formData.append('D_O_B', birth.toISOString().split('T')[0]);
        formData.append('contact_no', phoneNumber.trim() || null); // Handle empty phone number
        formData.append('gender', gender);
        formData.append('imageBase64', pickedImage.base64);

  
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        console.log('API URL:', apiUrl);
        //console.log('Form Data:', formData);
        formData.forEach((value, key) => {
        //console.log(`${key}: ${value}`);
      });
      
        const response = await axios.post(`${apiUrl}/api/users`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
        });

        if (response.status === 200) {
            Alert.alert('Success', 'Profile updated successfully.');
        }
    } catch (error) {
        console.error('Error updating profile:', error.response || error.message);
        Alert.alert('Error', 'Failed to update profile. Please check your network or contact support.');
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
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={profileImage ? { uri: profileImage } : require('../assets/profile.jpeg')} style={styles.profileImage} />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Icon name="camera-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Edit Profile</Text>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="User Name" value={UserName} onChangeText={setUserName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <View style={styles.phoneContainer}>
          <Text style={styles.countryCode}>+92</Text>
          <TextInput style={styles.phoneInput} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
        </View>
        <TouchableOpacity style={styles.input} onPress={showDatePicker}>
          <Text>{birth ? birth.toDateString() : 'Select Date of Birth'}</Text>
        </TouchableOpacity>
        <DateTimePickerModal isVisible={isDatePickerVisible} mode="date" onConfirm={handleConfirm} onCancel={hideDatePicker} date={birth} />
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
