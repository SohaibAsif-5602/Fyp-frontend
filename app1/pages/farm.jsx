import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import CONFIG from '../config';
import { Alert } from 'react-native';

const FarmList = () => {
  const navigation = useNavigation();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [role, setRole] = useState('');

  const browseIconRefs = useRef([]);

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      setRole(storedRole);
    };
    fetchRole();
  }, []);

  const deleteFarm = async (farmId) => {
    console.log('Deleting farm with ID:', farmId); // Log the farm ID for debugging
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this farm?",
      "All the related data will be deleted.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) {
                navigation.navigate('Login');
                return;
              }
          
              const response = await axios.delete(`${CONFIG.OWNER_URL}/delete-farm/${farmId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
          
              if (response.status === 200) {
                setFarms(farms.filter(farm => farm.id !== farmId));
                Alert.alert("Success", "Farm deleted successfully");
              } else {
                Alert.alert("Error", "Failed to delete the farm");
              }
            } catch (error) {
              console.error('Error deleting farm:', error.message);
              Alert.alert("Error", "An error occurred while deleting the farm");
            }
          }
        }
      ]
    );
  };
  useFocusEffect(
    useCallback(() => {
      const fetchFarms = async () => {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem('token');
          const response = await axios.get(`${CONFIG.OWNER_URL}/get-farms`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFarms(response.data.farms);
        } catch (error) {
          if (error.response?.status === 401) {
            await AsyncStorage.removeItem('token');
            navigation.navigate('Login');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchFarms();
    }, [navigation])
  );

  const handleBrowseClick = (farm, index) => {
    browseIconRefs.current[index]?.measure((x, y, width, height, pageX, pageY) => {
      setModalPosition({ top: pageY + height - 10, left: pageX - 140 });
      setSelectedFarm(farm);
      setModalVisible(true);
    });
  };

  const renderFarmCard = (farm, index) => (
    <View key={index} style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        // onPress={() => navigation.navigate('FarmDetail', { farmId: farm.id })}
      >
        <Image
          source={{ uri: "https://res.cloudinary.com/dfegwo1lv/image/upload/v1734630806/images_1_bdx1zo.jpg" }}
          style={styles.image}
        />
        <View style={styles.details}>
          <View style={styles.header}>
            <Text style={styles.title}>{farm.name}</Text>
            <View style={[styles.status, farm.status === 'active' ? styles.active : styles.inactive]}>
              <Text style={styles.statusText}>{farm.status.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.meta}>
            <FontAwesome5 name="map-marker-alt" size={14} color="#6B7280" />
            <Text style={styles.location}>{farm.city}, {farm.state}</Text>
          </View>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <MaterialIcons name="water" size={16} color="#3B82F6" />
              <Text style={styles.statText}>{farm.number_of_ponds} Ponds</Text>
            </View>
            <View style={styles.statItem}>
              <FontAwesome5 name="users" size={14} color="#3B82F6" />
              <Text style={styles.statText}>{farm.number_of_workers} Workers</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        ref={(el) => (browseIconRefs.current[index] = el)}
        onPress={() => handleBrowseClick(farm, index)}
        style={styles.menuButton}
      >
        <FontAwesome5 name="ellipsis-v" size={18} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00A76F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {farms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="agriculture" size={80} color="#E5E7EB" />
          <Text style={styles.emptyText}>No farms found</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {farms.map(renderFarmCard)}
        </ScrollView>
      )}

      {role === "owner" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddFarm')}
        >
          <MaterialIcons name="add" size={28} color="white" />
                  <Text style={styles.addText}> New Farm</Text>
          
        </TouchableOpacity>
      )}

      <Modal transparent visible={modalVisible} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modal, modalPosition]}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('EditFarm', { farmId: selectedFarm.id })}
            >
              <MaterialIcons name="edit" size={18} color="#3B82F6" />
              <Text style={styles.menuText}>Edit Farm</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('AddPond', { farmId: selectedFarm.id })}
            >
              <MaterialIcons name="add-circle" size={18} color="#3B82F6" />
              <Text style={styles.menuText}>Add Pond</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => { 
                setModalVisible(false); 
                deleteFarm(selectedFarm?.id) 
              }}            >

              <FontAwesome5 name="users" size={16} color="#3B82F6" />
              <Text style={styles.menuText}>Delete Farm</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('Workers', { farmId: selectedFarm.id })}
            >
              <FontAwesome5 name="users" size={16} color="#3B82F6" />
              <Text style={styles.menuText}>View Workers</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('Pond', { farmId: selectedFarm.id })}
            >
              <FontAwesome5 name="users" size={16} color="#3B82F6" />
              <Text style={styles.menuText}>View Ponds</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8', // Changed from #F9FAFB to match PondList
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 18,
    color: '#9CA3AF',
    marginTop: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // Increased from 12 to match PondList
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, // Reduced from original
    shadowRadius: 6, // Increased from 4
    elevation: 3, // Adjusted from 2
  },
  
  cardContent: {
    flexDirection: 'row',
    flex: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  details: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    width: '80%',
    fontWeight: '600',
    color: '#1F2937',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  active: {
    backgroundColor: '#D1FAE5',
  },
  inactive: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#555555', // Changed from #6B7280 to match PondList's pondDetail
    marginLeft: 8,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#555555', // Changed from #4B5563 to match PondList
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  modal: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 160,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 14,
    color: '#1F2937',
  },
});

export default FarmList;