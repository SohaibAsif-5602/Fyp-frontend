import React from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* User Info */}
      <View style={{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:30
      }}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with actual image URI
          style={styles.profileImage}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>Taha Shayan</Text>
          <Text style={styles.userEmail}>taha@gmail.com</Text>
        </View>
      </View>

      {/* Menu List */}

      {/* Change Plan Button */}
      <TouchableOpacity style={styles.changePlanButton} onPress={() => {/* Handle plan change */}}>
        <Text style={styles.changePlanText}>Change to Premium Plan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 35,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  userDetails: {
    flexDirection: 'column',
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#666',
  },
  changePlanButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  changePlanText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
  },
});
