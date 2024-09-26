import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import Entypo from '@expo/vector-icons/Entypo';
import Header from '../components/Header';
import Footer from '../components/footer';

export default function Profile() {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation(); // Use the navigation hook
  const change_plan = () => {
    navigation.navigate('Subscription');
  };
  return (
    <View style={styles.container}>
      <Header data={"Profile"}/>
      <View style={styles.header}>
        <Text style={styles.title}>User Details</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Entypo name="menu" size={34} color="black" />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setMenuVisible(false)} />
        <View style={styles.menu}>
        <TouchableOpacity
  style={styles.menuItem}
  onPress={() => {
    setMenuVisible(false); // Close the menu
    navigation.navigate('UserDetails'); // Make sure this matches the route name in the Stack.Navigator
  }}
>
  <Text style={styles.menuText}>User Details</Text>
</TouchableOpacity>

          
          <TouchableOpacity style={styles.menuItem} onPress={change_plan}>
            <Text style={styles.menuText}>Change Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {/* Handle Logout */}}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.deleteButton]} onPress={() => {/* Handle Delete Account */}}>
            <Text style={styles.menuText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#00BFFF', // Blue background
    paddingVertical: 5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuButton: {
    paddingRight: 10, // Push menu icon to the right
    marginTop: 55,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 50,
    marginLeft: 110,
    fontSize: 30,
    color: '#fff', // White title text
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
