import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL_PONDS = `${process.env.EXPO_PUBLIC_API_URL}/api/ponds/get-ponds`;
const API_URL_CATEGORIES = `${process.env.EXPO_PUBLIC_API_URL}/api/transactions/categories`;

const CreatePondTransaction = () => {
  const [ponds, setPonds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [selectedCategoryType, setSelectedCategoryType] = useState('income');
  const [amount, setAmount] = useState('');
  const [transactionDetails, setTransactionDetails] = useState('');
  const [category, setCategory] = useState(null);
  const [receipt_no, setReciept] = useState(null);

  useEffect(() => {
    const fetchPonds = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/ponds/get-ponds`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Ponds Data:', data);

        if (data && data.ponds) {
          setPonds(data.ponds);
        } else {
          console.error('Ponds data not found in response');
        }
      } catch (error) {
        console.error('Error fetching ponds:', error);
      }
    };
    fetchPonds();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/transactions/categories`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Categories Data:', data);

        if (data && Array.isArray(data)) {
          const filteredCategories = data.filter(
            (category) => category.type === selectedCategoryType
          );
          setCategories(filteredCategories);
        } else {
          console.error('Categories data not found or invalid format');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [selectedCategoryType]);

  const handleSubmit = async () => {
    const transactionDate = new Date().toISOString().split('T')[0];

    const transactionData = {
      pond_id: selectedPond,
      category_id: category,
      transaction_type: selectedCategoryType,
      amount,
      receipt_no: receipt_no,
      transaction_details: transactionDetails,
      transaction_date: transactionDate,
    };

    console.log('Transaction Data:', transactionData);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/transactions/`, transactionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Transaction added successfully:', response.data);
      Alert.alert('Success', 'Transaction added successfully');
      // Reset fields after successful submission
      setSelectedPond(null);
      setCategory(null);
      setAmount('');
      setTransactionDetails('');
      setReciept('');

    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add New Transaction</Text>

      <Text style={styles.label}>Select Pond</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedPond(value)}
        items={ponds.map((pond) => ({
          label: pond.pond_name,
          value: pond.pond_id,
        }))}
        placeholder={{ label: 'Select Pond...', value: null }}
        style={pickerSelectStyles}
      />

      <Text style={styles.label}>Select Category Type</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedCategoryType(value)}
        items={[
          { label: 'Income', value: 'income' },
          { label: 'Expense', value: 'expense' },
        ]}
        placeholder={{ label: 'Select Transaction Type', value: selectedCategoryType }}
        style={pickerSelectStyles}
      />

      <Text style={styles.label}>Select Category</Text>
      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        items={categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        placeholder={{ label: 'Select Category...', value: null }}
        style={pickerSelectStyles}
        disabled={!categories.length}
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Enter Amount"
      />

      <Text style={styles.label}>Receipt Number</Text>
      <TextInput
        style={styles.input}
        value={receipt_no}
        onChangeText={setReciept}
        placeholder="Enter Receipt Number"
      />

      <Text style={styles.label}>Transaction Details</Text>
      <TextInput
        style={styles.input}
        value={transactionDetails}
        onChangeText={setTransactionDetails}
        placeholder="Enter Transaction Details"
      />

      <TouchableOpacity
        style={styles.Button}
        onPress={handleSubmit}
        disabled={!selectedPond || !category || !amount || !transactionDetails || !receipt_no}
      >
        <Text style={styles.ButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  Button: {
    backgroundColor: '#0077BE',
    marginVertical: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '40%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  inputAndroid: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default CreatePondTransaction;
