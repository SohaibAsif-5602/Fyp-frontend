import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Switch, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CONFIG from '../config';

const AddWorker = ({ route, navigation }) => {
  const { farmId } = route.params;
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [manageTransactions, setManageTransactions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddWorker = async () => {
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter the worker\'s email.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        `${CONFIG.OWNER_URL}/add-worker`,
        {
          farmId,
          email,
          designation: designation || 'Worker',
          manageTransactions
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Alert.alert('Success', response.data.message, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.error || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Farm Worker</Text>

      <TextInput
        style={styles.input}
        placeholder="Worker's Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Designation (e.g., Technician)"
        value={designation}
        onChangeText={setDesignation}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Can Manage Transactions?</Text>
        <Switch
          value={manageTransactions}
          onValueChange={setManageTransactions}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddWorker}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add Worker</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    color: '#111827',
  },
  input: {
    height: 50,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 16,
    color: '#374151',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default AddWorker;
