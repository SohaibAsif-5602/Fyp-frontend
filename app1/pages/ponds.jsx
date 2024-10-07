<<<<<<< Updated upstream
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import Footer from '../components/footer';
=======
import React, { useState, useCallback, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { DarkModeContext } from '../contexts/DarkModeContext'; // Assuming you have a DarkModeContext
>>>>>>> Stashed changes

const PondList = () => {
  const navigation = useNavigation();
  const [ponds, setPonds] = useState([]);
  const { isDarkMode } = useContext(DarkModeContext); // Access dark mode context

  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('No token found. Redirecting to login.');
          navigation.navigate('Login');
          return;
        }

<<<<<<< Updated upstream
        const response = await fetch(process.env.EXPO_PUBLIC_API_URL+'/getPonds', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          setPonds(data.ponds);
        } else if (response.status === 401) {
          console.error('Invalid token. Redirecting to login.');
          await AsyncStorage.removeItem('token');
          navigation.navigate('Login');
        } else {
          console.error('Failed to fetch ponds. Status:', response.status);
          const errorData = await response.text();
          console.error('Error details:', errorData);
        }
      } catch (error) {
        console.error('Error fetching pond data:', error.message);
        navigation.navigate('Login');
      }
    };

    fetchPonds();
  }, []);
=======
      fetchPonds();
    }, [navigation])
  );
>>>>>>> Stashed changes

  const handlePondClick = (pond) => {
    // Navigate to the Analytics screen and pass the pond_id as a parameter
    navigation.navigate('Analytics', { pondId: pond.pond_id });
  };

  return (
    <View style={[styles.wrapper, isDarkMode ? styles.darkWrapper : styles.lightWrapper]}>
      <ScrollView contentContainerStyle={styles.pondList}>
        {ponds.map((pond, index) => (
          <View key={index} style={[styles.pondCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
            <TouchableOpacity style={styles.pondContent} onPress={() => handlePondClick(pond)}>
              <View style={styles.imgcontainer}>
                <Image source={{ uri: pond.imagelink }} style={styles.pondImage} />
              </View>
              <View style={styles.pondDetails}>
                <Text style={[styles.city, isDarkMode ? styles.darkText : styles.lightText]}>{pond.pond_name}</Text>
                <Text style={[styles.fish, isDarkMode ? styles.darkText : styles.lightText]}>{pond.pond_loc}</Text>
                <Text style={[styles.fish, isDarkMode ? styles.darkText : styles.lightText]}>{pond.specie}</Text>
                <Text style={[styles.health, isDarkMode ? styles.darkText : styles.lightText]}>Health: {pond.pond_score}%</Text>
                {pond.pond_score < 50 && <Text style={styles.warning}>⚠️ Health Warning</Text>}
              </View>
            </TouchableOpacity>
            <FontAwesome5 name="ellipsis-v" size={24} color={isDarkMode ? "#fff" : "#000"} style={styles.browseIcon} />
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={[styles.addButton, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={() => navigation.navigate('AddPond')}>
        <Text style={styles.addText}>+ Add Pond</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  lightWrapper: {
    backgroundColor: '#f0f4f8',
  },
  darkWrapper: {
    backgroundColor: '#000',
  },
  imgcontainer: {
    height: 'auto',
    width: 100,
  },
  pondList: {
    alignItems: 'center',
    paddingBottom: 80,
    marginTop: 20,
  },
  pondCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
    width: '90%',
    overflow: 'hidden',
    padding: 10,
  },
  lightCard: {
    backgroundColor: '#fff',
    shadowColor: '#000',
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#fff',
  },
  browseIcon: {
    marginLeft: 5,
    padding: 5,
    alignSelf: 'center',
  },
  pondContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pondDetails: {
    flex: 1,
    paddingVertical: 0,
    justifyContent: 'center',
    marginLeft: 15,
  },
  pondImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  city: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fish: {
    fontSize: 16,
    marginBottom: 5,
  },
  health: {
    fontSize: 16,
    fontWeight: '500',
  },
  warning: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  lightText: {
    color: '#2c3e50',
  },
  darkText: {
    color: '#fff',
  },
  addButton: {
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
  lightButton: {
    backgroundColor: '#00bcd5',
  },
  darkButton: {
    backgroundColor: '#00bcd5',
  },
  addText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PondList;
