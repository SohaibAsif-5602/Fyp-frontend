import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config';

const EditFarm = ({ route, navigation }) => {
  const { farmId } = route.params;
    console.log(farmId);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState(''); // avoid `state` keyword
  const [country, setCountry] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    const fetchFarmDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        const response = await fetch(`${CONFIG.OWNER_URL}/get-farm/${farmId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log(data);
        const farm=data.farm;
        if (response.status === 200) {
          setName(farm.name || '');
          setAddress(farm.address || '');
          setCity(farm.city || '');
          setStateField(farm.state || '');
          setCountry(farm.country || '');
          setZip(farm.zip || '');
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch farm details.');
        }
      } catch (error) {
        console.error('Error fetching farm:', error);
        Alert.alert('Error', 'Unexpected error occurred.');
      }
    };

    fetchFarmDetails();
  }, [farmId]);

  const handleUpdate = async () => {
    if (name && address && city && stateField && country && zip) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        const response = await fetch(`${CONFIG.OWNER_URL}/update-farm/${farmId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            address,
            city,
            state: stateField,
            country,
            zip,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          Alert.alert('Success', 'Farm updated successfully.');
          navigation.goBack();
        } else {
          Alert.alert('Error', data.error || 'Failed to update farm.');
        }
      } catch (error) {
        console.error('Error updating farm:', error);
        Alert.alert('Error', 'Unexpected error occurred.');
      }
    } else {
      Alert.alert('Error', 'Please fill all fields.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Farm Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter farm name" />

      <Text style={styles.label}>Address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Enter address" />

      <Text style={styles.label}>City</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="Enter city" />

      <Text style={styles.label}>State</Text>
      <TextInput style={styles.input} value={stateField} onChangeText={setStateField} placeholder="Enter state" />

      <Text style={styles.label}>Country</Text>
      <TextInput style={styles.input} value={country} onChangeText={setCountry} placeholder="Enter country" />

      <Text style={styles.label}>ZIP Code</Text>
      <TextInput style={styles.input} value={zip} onChangeText={setZip} placeholder="Enter ZIP code" keyboardType="number-pad" />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateText}>Update Farm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  updateButton: {
    backgroundColor: '#0077BE',
    paddingVertical: 14,
    alignSelf: 'center',
    borderRadius: 24,
    width: 160,
    alignItems: 'center',
    marginTop: 25,
  },
  updateText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditFarm;
