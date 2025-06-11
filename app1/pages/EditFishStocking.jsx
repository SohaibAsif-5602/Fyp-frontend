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

const EditFishStocking = ({ route, navigation }) => {
  const { stockId, initialFishId, initialQuantity } = route.params;

  const [fishId, setFishId] = useState(initialFishId.toString());
  const [quantity, setQuantity] = useState(initialQuantity.toString());

  const handleUpdate = async () => {
    if (!fishId || !quantity) {
      return Alert.alert('Error', 'Fish ID and Quantity are required.');
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return navigation.navigate('Login');
      }

      const response = await fetch(`${CONFIG.OWNER_URL}/update-fish-stocking/${stockId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fish_id: fishId,
          quantity: parseInt(quantity),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Fish stock updated successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Failed to update stock.');
      }
    } catch (error) {
      console.error('Error updating fish stock:', error);
      Alert.alert('Error', 'Internal server error.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateText}>Update Stock</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 40,
    backgroundColor: '#f9f9f9',
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
  updateButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  updateText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditFishStocking;
