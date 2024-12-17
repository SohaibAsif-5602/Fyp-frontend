import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
// Example API URL
const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/transactions`;

const Tran = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('income');

const navigation = useNavigation();

  // Fetch transactions
  const fetchTransactions = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data);
      filterTransactions(response.data, 'income'); // Filter income initially
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
    }
  };

  // Filter transactions based on type
  const filterTransactions = (data, type) => {
    const filtered = data.filter((item) => item.transaction_type === type);
    setFilteredTransactions(filtered);
    setActiveTab(type);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render individual transaction item
  const renderItem = ({ item }) => (
    console.log(item),
    <View style={styles.transactionCard}>
      <Text style={styles.transactionTitle}>
        {item.transaction_details} [{item.pond_id}] ({item.category_name})
      </Text>
      <Text style={styles.transactionDate}>{formatDate(item.transaction_date)}</Text>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.transaction_type === 'income' ? 'green' : 'red' },
        ]}
      >
        ${parseFloat(item.amount).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => filterTransactions(transactions, 'income')}>
          <Text
            style={[
              styles.headerText,
              activeTab === 'income' && styles.activeTab,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterTransactions(transactions, 'expense')}>
          <Text
            style={[
              styles.headerText,
              activeTab === 'expense' && styles.activeTab,
            ]}
          >
            Expenses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.transaction_id.toString()}
        renderItem={renderItem}
      />

      {/* Add Income Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text style={styles.addText}>+ Add</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#0077BE',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeTab: {
    textDecorationLine: 'underline',
    color: 'black',
  },
  transactionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 14,
    borderRadius: 10,
    elevation: 2,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionDate: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  addButton: {
    backgroundColor: '#0077BE',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 30,
    top: '85%',
    right: '5%',
    alignSelf: 'center',
    elevation: 2,
    position: 'absolute',
    width: '28%',
  },
  addText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Tran;
