import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CONFIG from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const FishStockPage = () => {
  const [fishStockData, setFishStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState('');
  const navigation = useNavigation(); // Use the navigation prop
  const fetchFishStock = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in again.');
        return;
      }
      const role1 = await AsyncStorage.getItem('role');
      setRole(role1);
      let url='';
      if (role === 'owner') {
        url = `${CONFIG.OWNER_URL}/get-all-fish-stockings`;}
      else if (role1 === 'worker') {
        url = `${CONFIG.WORKER_URL}/fish-stock`;}
        else {
          console.error('Invalid role, please log in again.');
        }
      const response = await axios.get(`${CONFIG.WORKER_URL}/fish-stock`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fish stock data:', response.data); // Log the response data
      setFishStockData(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch fish stock data. Please pull to refresh.');
      console.error('Error fetching tasks:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchFishStock();
    };
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFishStock();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="fish" size={24} color="#2F80ED" />
        <Text style={styles.title}>{item.species}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Icon name="water" size={18} color="#828282" />
        <Text style={styles.infoText}>Pond: {item.pond_name}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Icon name="scale" size={18} color="#828282" />
        <Text style={[styles.infoText, { color: item.quantity < 100 ? '#EB5757' : '#27AE60' }]}>
          Quantity: {item.quantity}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Icon name="calendar" size={18} color="#828282" />
        <Text style={styles.infoText}>
          Stocked: {new Date(item.date_of_stocking).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.infoRow}>
        <Icon name="clock" size={18} color="#828282" />
        <Text style={styles.infoText}>Age at Stocking: {item.age_at_stocking} months</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2F80ED" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      

      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={24} color="#EB5757" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={fishStockData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2F80ED']}
            tintColor="#2F80ED"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="database-remove" size={40} color="#BDBDBD" />
            <Text style={styles.emptyText}>No fish stock records found</Text>
          </View>
        }
      />
      {role === "owner" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddFarm')}
        >
          <MaterialIcons name="add" size={28} color="white" />
                  <Text style={styles.addText}> New Farm</Text>
          
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2F80ED',
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    marginTop: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#4F4F4F',
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEDED',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#EB5757',
    marginLeft: 10,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    padding: 20,
  },
  emptyText: {
    color: '#828282',
    fontSize: 16,
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#0077BE',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  addText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default FishStockPage;













