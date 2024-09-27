import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { DarkModeContext } from '../contexts/DarkModeContext';

export default function Profile() {
  const [menuVisible, setMenuVisible] = useState(false);
  const { isDarkMode } = useContext(DarkModeContext);
  const navigation = useNavigation(); // Use the navigation hook
  const change_plan = () => {
    navigation.navigate('Subscription');
  };
  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.title, isDarkMode && styles.darkHeaderText]}>User Details</Text>
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
  darkHeader: {
    backgroundColor: '#000',
  },
  darkHeaderText: {
    color: '#fff',
  },
  darkText: {
    color: '#fff',
  },
  darkMenu: {
    backgroundColor: '#333',
  },
  header: {
    backgroundColor: '#00bcd4',
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  menuButton: {
    paddingRight: 10, // Push menu icon to the right
    marginTop: 55,
  },
  title: {
    fontSize: 30,
    color: '#fff', // White title text
    fontWeight: 'bold',
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
  },
  userEmail: {
    fontSize: 20,
    color: '#666',
  },
  overlay: {
    flex: 1,
  },
  menu: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    position: 'absolute',
    top: 550, 
    left: 20,
    right: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});
