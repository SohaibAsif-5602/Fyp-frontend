import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileImage from '../assets/me.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { DarkModeContext } from '../contexts/DarkModeContext';

export default function Profile() {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkModeContext);

  const [userData, setUserData] = useState({});
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
        console.log(response.data.imagelink);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  return (
    <ScrollView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={userData.imagelink ? { uri: userData.imagelink } : ProfileImage}
          style={styles.profileImage}
          defaultSource={ProfileImage}
        />
        <Text style={[styles.profileName, isDarkMode ? styles.darkText : styles.lightText]}>{userData.username || 'N/A'}</Text>
        <Text style={[styles.profileEmail, isDarkMode ? styles.darkText : styles.lightText]}>{userData.email || 'N/A'}</Text>
        <TouchableOpacity style={[styles.editProfileButton, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={() => { navigation.navigate('Edit Profile'); }}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Options */}
      <View style={styles.optionContainer}>
        <View style={styles.divider} />

        <TouchableOpacity style={styles.option} onPress={logout}>
          <Icon name="log-out-outline" size={24} color={isDarkMode ? "#fff" : "#000"} />
          <Text style={[styles.optionText, isDarkMode ? styles.darkText : styles.lightText]}>Log Out</Text>
          <Icon name="chevron-forward-outline" size={24} color={isDarkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    padding: 16,
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
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
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
    marginBottom: 10,
  },
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  editProfileButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  lightButton: {
    backgroundColor: '#00bcd5',
  },
  darkButton: {
    backgroundColor: '#00bcd5',
  },
  editProfileText: {
    color: '#fff',
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 210,
    height: 210,
    borderRadius: 110,
    marginBottom: 10,
  },
  userDetails: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    color: '#000',
  },
  userEmail: {
    fontSize: 20,
    color: '#666',
  },
  menu: {
    backgroundColor: '#fff',
    paddingHorizontal: 60,
    marginTop: 30,
    gap:10
  },
  darkMenu: {
    backgroundColor: '#333',
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal:10,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
    borderStyle: 'solid',
  },
  menuText: {
    fontSize: 18,
    color: '#000',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});