import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Image,
  TouchableOpacity, ScrollView, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import CONFIG from '../config';

const EditProfileScreen = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return Alert.alert('Error', 'Please log in to view your profile.');

      const res = await axios.get(`${CONFIG.AUTH_URL}/getuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        const data = res.data;
        setUserName(data.user_name || '');
        setEmail(data.email || '');
        setPhoneNumber(data.contact_no?.toString() || '');
        setBirthDate(data.D_O_B ? new Date(data.D_O_B) : new Date());
        setGender(data.gender || '');
        setProfileImage(data.image || null);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      Alert.alert('Error', 'Unable to load profile data.');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission Denied', 'Media library permission is required.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      setProfileImage(selected.uri);
      setImageFile({
        uri: selected.uri,
        base64: selected.base64,
        name: selected.fileName || 'profile.jpg',
        type: selected.type || 'image/jpeg',
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return Alert.alert('Error', 'You must be logged in.');

      const formData = new FormData();
      formData.append('user_name', userName);
      formData.append('email', email);
      formData.append('D_O_B', birthDate.toISOString().split('T')[0]);
      formData.append('contact_no', phoneNumber || '');
      formData.append('gender', gender);

      if (imageFile?.base64) {
        formData.append('imageBase64', imageFile.base64);
      }

      const res = await axios.post(`${CONFIG.AUTH_URL}/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.status === 200) {
        Alert.alert('Success', 'Profile updated successfully.');
        setIsEditing(false);
        fetchUserData();
      }
    } catch (err) {
      console.error('Error updating profile:', err.response || err.message);
      Alert.alert('Error', 'Update failed. Please try again.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../assets/profile.jpeg')}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Icon name="camera-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.header}>Edit Profile</Text>

      <View style={styles.inputContainer}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="User Name"
              value={userName}
              onChangeText={setUserName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: '#eee' }]}
              value={email}
              editable={false}
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
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text>{birthDate ? birthDate.toDateString() : 'Select Date of Birth'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
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
          </>
        ) : (
          <>
            <Text style={styles.input}>{userName}</Text>
            <Text style={styles.input}>{email}</Text>
            <View style={styles.phoneContainer}>
              <Text style={styles.countryCode}>+92</Text>
              <Text style={styles.phoneInput}>{phoneNumber}</Text>
            </View>
            <Text style={styles.input}>{birthDate.toDateString()}</Text>
            <Text style={styles.input}>{gender}</Text>
          </>
        )}
      </View>

      {isEditing ? (
        <TouchableOpacity style={styles.saveChangesButton} onPress={handleUpdateProfile}>
          <Text style={styles.saveChangesText}>Save Changes</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  imageContainer: { alignItems: 'center', marginVertical: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  editIcon: {
    position: 'absolute', bottom: 0, right: 120,
    backgroundColor: '#007bff', borderRadius: 15, padding: 5,
  },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  inputContainer: { marginVertical: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginBottom: 15,
  },
  phoneContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    marginBottom: 15,
  },
  countryCode: {
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: '#eee', borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  phoneInput: { flex: 1, padding: 10 },
  saveChangesButton: {
    backgroundColor: '#0077BE', padding: 15,
    borderRadius: 28, width: '50%', alignSelf: 'center',
    alignItems: 'center', marginVertical: 10,
  },
  saveChangesText: { color: '#fff', fontSize: 16 },
  editButton: {
    backgroundColor: '#0077BE', padding: 15,
    borderRadius: 28, width: '50%', alignSelf: 'center',
    alignItems: 'center', marginVertical: 10,
  },
  editButtonText: { color: '#fff', fontSize: 16 },
});

const pickerSelectStyles = {
  inputIOS: {
    color: 'black', paddingVertical: 12, paddingHorizontal: 10,
    borderRadius: 4, borderWidth: 1, borderColor: 'gray',
    backgroundColor: 'white', fontSize: 16,
  },
  inputAndroid: {
    color: 'black', paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 4, borderWidth: 1, borderColor: 'gray',
    backgroundColor: 'white', fontSize: 16,
  },
};

export default EditProfileScreen;
