import React, { useState } from 'react';
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

const AddFishStocking = ({ navigation }) => {
  const [pondId, setPondId] = useState('');
  const [fishId, setFishId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dateOfStocking, setDateOfStocking] = useState('');
  const [ageAtStocking, setAgeAtStocking] = useState('');

  const handleSubmit = async () => {
    if (!pondId || !fishId || !quantity || !dateOfStocking || !ageAtStocking) {
      return Alert.alert('Error', 'All fields are required.');
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return navigation.navigate('Login');
      }

      const response = await fetch(`${CONFIG.OWNER_URL}/add-fish-stock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pondId,
          fish_id: fishId,
          quantity: parseInt(quantity),
          date_of_stocking: dateOfStocking,
          age_at_stocking: parseInt(ageAtStocking),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Fish stocked successfully.');
        setPondId('');
        setFishId('');
        setQuantity('');
        setDateOfStocking('');
        setAgeAtStocking('');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Failed to stock fish.');
      }
    } catch (error) {
      console.error('Error stocking fish:', error);
      Alert.alert('Error', 'Internal server error.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Pond ID</Text>
      <TextInput
        style={styles.input}
        value={pondId}
        onChangeText={setPondId}
        placeholder="Enter Pond ID"
      />

      <Text style={styles.label}>Fish ID</Text>
      <TextInput
        style={styles.input}
        value={fishId}
        onChangeText={setFishId}
        placeholder="Enter Fish ID"
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Enter Quantity"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Date of Stocking (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={dateOfStocking}
        onChangeText={setDateOfStocking}
        placeholder="e.g. 2025-05-10"
      />

      <Text style={styles.label}>Age at Stocking (in days)</Text>
      <TextInput
        style={styles.input}
        value={ageAtStocking}
        onChangeText={setAgeAtStocking}
        placeholder="e.g. 30"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addText}>Add Stock</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 40,
    backgroundColor: '#f2f2f2',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  addText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddFishStocking;
