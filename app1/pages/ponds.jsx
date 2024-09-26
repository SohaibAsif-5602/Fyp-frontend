import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/footer';

const PondList = () => {
  const navigation = useNavigation();

  // Check if a token exists in local storage
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(token);

        if (!token) {
          // If no token, redirect to the login screen
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error fetching token', error);
        navigation.navigate('Login');
      }
    };

    checkToken();
  }, []);

  const ponds = [
    {
      id: 1,
      city: 'Islamabad',
      fish: 'Catla',
      health: '86%',
      image: 'https://t3.ftcdn.net/jpg/05/66/14/16/360_F_566141635_0kJ26Xqbl2fTI1dFQBHJpRBWOM6C5Ryp.jpg',
    },
    {
      id: 2,
      city: 'Lahore',
      fish: 'Rohu',
      health: '72%',
      image: 'https://t3.ftcdn.net/jpg/05/66/14/16/360_F_566141635_0kJ26Xqbl2fTI1dFQBHJpRBWOM6C5Ryp.jpg',
    },
    {
      id: 3,
      city: 'Karachi',
      fish: 'Silver Carp',
      health: '25%',
      image: 'https://t3.ftcdn.net/jpg/05/66/14/16/360_F_566141635_0kJ26Xqbl2fTI1dFQBHJpRBWOM6C5Ryp.jpg',
      warning: true,
    },
  ];

  const handlePondClick = (pond) => {
   navigation.navigate('Analytics')
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pond Health Overview</Text>
      </View>
      <ScrollView contentContainerStyle={styles.pondList}>
        {ponds.map((pond) => (
          <TouchableOpacity key={pond.id} style={styles.pondCard} onPress={() => handlePondClick(pond)}>
            <Image source={{ uri: pond.image }} style={styles.pondImage} />
            <View style={styles.pondDetails}>
              <Text style={styles.city}>{pond.city}</Text>
              <Text style={styles.fish}>{pond.fish}</Text>
              <Text style={styles.health}>Health: {pond.health}</Text>
              {pond.warning && <Text style={styles.warning}>⚠️ Health Warning</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddPond')}>
        <Text style={styles.addText}>+ Add Pond</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#00bcd4',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // Adding shadow for a better look
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  pondList: {
    alignItems: 'center',
    paddingBottom: 80,
    marginTop: 20, // Adjusted margin for spacing
  },
  pondCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
    width: '90%',
    overflow: 'hidden',
  },
  pondImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    resizeMode: 'cover',
  },
  pondDetails: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  city: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  fish: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  health: {
    fontSize: 16,
    fontWeight: '500',
    color: '#27ae60',
  },
  warning: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  addButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 20,
    elevation: 2,
    position: 'absolute',
    bottom: 20,
    width: '80%',
  },
  addText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PondList;
