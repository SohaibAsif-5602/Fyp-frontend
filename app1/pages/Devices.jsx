import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CONFIG from '../config';
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DeviceList = () => {
  const [devicesData, setDevicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState('');
  const fetchDevices = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in again.');
        return;
      }
      const role1 = await AsyncStorage.getItem('role');
      console.log('Role:', role1); // Log the role for debugging
      let url = '';
      if (role1 === 'owner') {
        url = `${CONFIG.OWNER_URL}/get-devices`;
      }
      else if (role1 === 'worker') {
        url = `${CONFIG.WORKER_URL}/devices`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevicesData(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch devices. Pull to refresh.');
      console.error('Error fetching devices:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDevices();
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const renderSensor = (sensor, index) => (
    <View key={index} style={styles.sensorItem}>
      <Icon name="circle-small" size={24} color="#4a90e2" />
      <Text style={styles.sensorText}>
        {sensor.sensor_type} <Text style={styles.unitText}>({sensor.unit})</Text>
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="devices" size={24} color="#4a90e2" />
        <Text style={styles.title}>{item.device_name}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Icon name="label-outline" size={16} color="#666" />
        <Text style={styles.subText}>Type: {item.device_type}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Icon name="water" size={16} color="#666" />
        <Text style={styles.subText}>Pond: {item.pond_name}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Icon name="calendar" size={16} color="#666" />
        <Text style={styles.subText}>
          Installed: {new Date(item.installation_date).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.sensorSection}>
        <View style={styles.sectionHeader}>
          <Icon name="chart-line" size={18} color="#4a90e2" />
          <Text style={styles.sensorHeader}>Sensors</Text>
        </View>
        {item.sensors.map(renderSensor)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>My Devices</Text>
        <Icon name="devices" size={28} color="#4a90e2" />
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={24} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <FlatList
        data={devicesData}
        keyExtractor={(item) => item.device_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4a90e2']}
            tintColor="#4a90e2"
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Icon name="devices-off" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No devices found</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5
  },
  header: {
    fontSize: 28,
    fontWeight: '600',
    color: '#2c3e50'
  },
  listContent: {
    paddingBottom: 20
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 10
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8
  },
  sensorSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  sensorHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 6
  },
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4
  },
  sensorText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 4
  },
  unitText: {
    color: '#7f8c8d',
    fontSize: 12
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fde8e8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  errorText: {
    color: '#e74c3c',
    marginLeft: 8,
    fontSize: 14
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40
  },
  emptyText: {
    marginTop: 16,
    color: '#95a5a6',
    fontSize: 16
  }
});

export default DeviceList;