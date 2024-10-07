import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileImage from '../assets/me.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import axios for API calls

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    imagelink: '',
    D_O_B: '',
    contact_on: '',
    gender: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        const response = await axios.get(process.env.EXPO_PUBLIC_API_URL+'/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUserData(response.data); // Assuming the API returns user data directly
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const logout = async () => {
    console.log('Logging out...');
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={userData.imagelink ? { uri: userData.imagelink } : ProfileImage} // Use fetched image link or a default one
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userData.username || 'N/A'}</Text>
        <Text style={styles.profileEmail}>{userData.email || 'N/A'}</Text>
        <TouchableOpacity style={styles.editProfileButton} onPress={() => { navigation.navigate('Edit Profile'); }}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Options */}
      <View style={styles.optionContainer}>
        <View style={styles.divider} />

        <TouchableOpacity style={styles.option} onPress={() => {}}>
          <Icon name="trash-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Clear Cache</Text>
          <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => {}}>
          <Icon name="time-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Clear History</Text>
          <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={logout}>
          <Icon name="log-out-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Log Out</Text>
          <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* App Version */}
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
});

export default ProfileScreen;
