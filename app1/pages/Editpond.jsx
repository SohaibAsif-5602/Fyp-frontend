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
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config';

const EditPond = ({ route, navigation }) => {
  const { pondId } = route.params;
  console.log('Pond ID:', pondId); // Log the pond ID for debugging
  const [pondName, setPondName] = useState('');
  const [depth, setDepth] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchPondDetails = async () => {
      console.log('Fetching pond details...'); // Log when fetching starts
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        const response = await fetch(`${CONFIG.OWNER_URL}/get-pond/${pondId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log(data) ;// Log the response data
        console.log('Pond details fetched:'); // Log the fetched pond details
        if (response.ok) {
          setPondName(data.name || '');
          setDepth(data.depth?.toString() || '');
          setLength(data.length?.toString() || '');
          setWidth(data.width?.toString() || '');
          setType(data.type || '');
          setStatus(data.status || '');
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch pond details.');
        }
      } catch (error) {
        console.error('Error fetching pond details:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    };

    fetchPondDetails();
  }, [pondId]);

  const handleUpdate = async () => {
    if (!pondName || !depth || !length || !width || !type || !status) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${CONFIG.OWNER_URL}/edit-pond/${pondId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: pondName,
          depth: parseFloat(depth),
          length: parseFloat(length),
          width: parseFloat(width),
          type,
          status,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Pond updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error || 'Failed to update pond.');
      }
    } catch (error) {
      console.error('Error updating pond:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Pond Name</Text>
      <TextInput style={styles.input} value={pondName} onChangeText={setPondName} placeholder="Enter Pond Name" />

      <Text style={styles.label}>Depth (in meters)</Text>
      <TextInput style={styles.input} value={depth} onChangeText={setDepth} keyboardType="numeric" placeholder="Enter Depth" />

      <Text style={styles.label}>Length (in meters)</Text>
      <TextInput style={styles.input} value={length} onChangeText={setLength} keyboardType="numeric" placeholder="Enter Length" />

      <Text style={styles.label}>Width (in meters)</Text>
      <TextInput style={styles.input} value={width} onChangeText={setWidth} keyboardType="numeric" placeholder="Enter Width" />

      <Text style={styles.label}>Type</Text>
      <TextInput style={styles.input} value={type} onChangeText={setType} placeholder="e.g., Clay, Cement" />


      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateText}>Update Pond</Text>
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
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  updateButton: {
    backgroundColor: '#0077BE',
    paddingVertical: 15,
    alignSelf: 'center',
    borderRadius: 32,
    width: 180,
    alignItems: 'center',
    marginTop: 20,
  },
  updateText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditPond;
