<<<<<<< Updated upstream
import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DarkModeContext } from '../contexts/DarkModeContext';
import image from '../assets/me.jpg'
import AsyncStorage from '@react-native-async-storage/async-storage';
=======
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileImage from '../assets/me.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { DarkModeContext } from '../contexts/DarkModeContext';
>>>>>>> Stashed changes

export default function Profile() {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkModeContext);

<<<<<<< Updated upstream
  const change_plan = () => {
    navigation.navigate('Subscription');
  };
=======
  const { isDarkMode } = useContext(DarkModeContext);

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
        
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);
>>>>>>> Stashed changes

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  return (
<<<<<<< Updated upstream
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
     

      <View style={styles.profileContainer}>
        <Image
          source={image}
=======
    <ScrollView style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={userData.imagelink ? { uri: userData.imagelink } : ProfileImage}
>>>>>>> Stashed changes
          style={styles.profileImage}
          defaultSource={ProfileImage}
        />
<<<<<<< Updated upstream
        <View style={styles.userDetails}>
          <Text style={[styles.userName, isDarkMode && styles.darkText]}></Text>
          <Text style={[styles.userEmail, isDarkMode && styles.darkText]}></Text>
        </View>
      </View>

      <View style={[styles.menu, isDarkMode && styles.darkMenu]}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('UserDetails')}
        >
          <Text style={[styles.menuText, isDarkMode && styles.darkText]}>User Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={change_plan}>
          <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Change Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={logout}>
          <Text style={[styles.menuText, isDarkMode && styles.darkText]}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, styles.deleteButton]}
          onPress={() => {
            /* Handle Delete Account */
          }}
        >
          <Text style={styles.menuText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
=======
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
>>>>>>> Stashed changes
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
<<<<<<< Updated upstream
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  darkText: {
=======
    padding: 16,
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
>>>>>>> Stashed changes
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
