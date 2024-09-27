// Profile.js
import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DarkModeContext } from '../contexts/DarkModeContext';

export default function Profile() {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkModeContext);

  const change_plan = () => {
    navigation.navigate('Subscription');
  };

  const logout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.title, isDarkMode && styles.darkHeaderText]}>User Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <View style={styles.userDetails}>
          <Text style={[styles.userName, isDarkMode && styles.darkText]}>Taha Shayan</Text>
          <Text style={[styles.userEmail, isDarkMode && styles.darkText]}>taha@gmail.com</Text>
        </View>
      </View>

      {/* Menu buttons below the profile */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#00bcd4',
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  darkHeader: {
    backgroundColor: '#000',
  },
  title: {
    fontSize: 30,
    color: '#fff', // White title text
    fontWeight: 'bold',
  },
  darkHeaderText: {
    color: '#fff',
  },
  darkText: {
    color: '#fff',
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 90,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  darkMenu: {
    backgroundColor: '#333',
  },
  menuItem: {
    paddingVertical: 10,
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
