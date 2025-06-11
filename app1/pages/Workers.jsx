// AllWorkersScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import CONFIG from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllWorkersScreen = ({route}) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const farmId = route?.params?.farmId;

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      let url='';
        if (farmId) {
            url = `${CONFIG.OWNER_URL}/get-farm-workers/${farmId}`;
        } else {
            url = `${CONFIG.OWNER_URL}/get-workers`;
        }
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderWorker = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: "https://res.cloudinary.com/dfegwo1lv/image/upload/v1734630806/images_1_bdx1zo.jpg" }} 
        style={styles.image} 
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.user_name}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Farm:</Text>
          <Text style={styles.detailValue}>{item.farm_name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Role:</Text>
          <Text style={[styles.detailValue, styles.roleText]}>{item.designation}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={[
            styles.statusText,
            item.status === 'active' ? styles.activeStatus : styles.inactiveStatus
          ]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <FlatList
      data={workers}
      keyExtractor={(item) => item.w_id.toString()}
      renderItem={renderWorker}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No workers found</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },
  listContainer: {
    padding: 20,
    backgroundColor: '#F5F7FB',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E8E8E8',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: '#636E72',
    width: 60,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: '#2D3436',
    flex: 1,
  },
  roleText: {
    fontWeight: '500',
    color: '#4A90E2',
  },
  statusContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#E3FCEF',
    color: '#006644',
  },
  inactiveStatus: {
    backgroundColor: '#FFEBE6',
    color: '#BF0711',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#636E72',
  },
});

export default AllWorkersScreen;