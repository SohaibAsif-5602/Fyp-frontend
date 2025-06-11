import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import CONFIG from '../config';
import { useEffect } from 'react';

const PondList = ({ route }) => {
  const navigation = useNavigation();
  const [ponds, setPonds] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [role, setRole] = useState('');
  const windowWidth = Dimensions.get('window').width;

  const farmId = route?.params?.farmId;
  const browseIconRefs = useRef([]);

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      setRole(storedRole);
    };
    fetchRole();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchPonds = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            navigation.navigate('Login');
            return;
          }
          const storedRole = await AsyncStorage.getItem('role');
          let url = '';
          console.log('Role:', storedRole);
          if (storedRole === 'owner') {
            if(farmId){
              url = CONFIG.OWNER_URL + '/get-all-ponds/' + farmId;
            }
            else {
              url = CONFIG.OWNER_URL + '/get-all-ponds';}
          }         
           else if (storedRole === 'worker') {
            url = CONFIG.WORKER_URL + '/ponds';
          }
          console.log('Fetching ponds from URL:', url);
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPonds(data);
          } else if (response.status === 401) {
            await AsyncStorage.removeItem('token');
            navigation.navigate('Login');
          } else if (response.status === 404) {
            Alert.alert('No Ponds Available');
          } else {
            console.error('Failed to fetch ponds');
          }
        } catch (error) {
          console.error('Error fetching ponds:', error.message);
          navigation.navigate('Login');
        }
      };

      fetchPonds();
    }, [navigation, farmId])
  );

  const deletePond = async (pondId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this pond?",
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
          
              const response = await axios.delete(`${CONFIG.OWNER_URL}/delete-pond/${pondId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
          
              if (response.status === 200) {
                setPonds(ponds.filter(pond => pond.id !== pondId));
                Alert.alert("Success", "Pond deleted successfully");
              } else {
                Alert.alert("Error", "Failed to delete the pond");
              }
            } catch (error) {
              console.error('Error deleting pond:', error.message);
              Alert.alert("Error", "An error occurred while deleting the pond");
            }
          }
        }
      ]
    );
  };

  const handleBrowseClick = (pond, index) => {
    browseIconRefs.current[index]?.measure(
      (x, y, width, height, pageX, pageY) => {
        const modalLeft = pageX > windowWidth / 2 
          ? pageX - 150  // If icon is on right side, show modal to the left
          : pageX + width; // If icon is on left side, show modal to the right
        setModalPosition({ 
          top: pageY + height - 10, 
          left: modalLeft 
        });
        setSelectedPond(pond);
        setModalVisible(true);
      }
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return '#4CAF50';
      case 'inactive': return '#F44336';
      case 'maintenance': return '#FFC107';
      default: return '#607D8B';
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>Pond Management</Text>
      
      {ponds.length === 0 ? (
        <View style={styles.emptyState}>
          
          <Text style={styles.emptyText}>No ponds found</Text>
          <Text style={styles.emptySubtext}>Add a new pond to get started</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.pondList}>
          {ponds.map((pond, index) => (
            <View key={pond.id} style={styles.pondCard}>
              <TouchableOpacity
                style={styles.pondContent}
                onPress={() => navigation.navigate('Analytics', { 
                  pondId: pond.id, 
                  pondName: pond.name 
                })}
                activeOpacity={0.9}
              >
                <View style={styles.imgContainer}>
                  <Image 
                    source={{ uri: "https://res.cloudinary.com/dfegwo1lv/image/upload/v1734630806/images_1_bdx1zo.jpg" }} 
                    style={styles.pondImage} 
                  />
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pond.status) }]}>
                    <Text style={styles.statusText}>{pond.status || 'Unknown'}</Text>
                  </View>
                </View>
                <View style={styles.pondDetails}>
                  <Text style={styles.pondName}>{pond.name}</Text>
                  <View style={styles.detailRow}>
                    <FontAwesome5 name="water" size={14} color="#555" />
                    <Text style={styles.detailText}>Type: {pond.type || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <FontAwesome5 name="ruler-combined" size={14} color="#555" />
                    <Text style={styles.detailText}>Size: {pond.length || '0'}m × {pond.width || '0'}m × {pond.depth || '0'}m</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                ref={(el) => (browseIconRefs.current[index] = el)}
                onPress={() => handleBrowseClick(pond, index)}
                style={styles.menuButton}
                activeOpacity={0.7}
              >
                <FontAwesome5 name="ellipsis-v" size={18} color="#555" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
  
     {role=="owner" && ( <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddPond')}
        activeOpacity={0.8}
      >
        <FontAwesome5 name="plus" size={20} color="#fff" />
        <Text style={styles.addText}> New Pond</Text>
      </TouchableOpacity>)}
  
      {/* Action Modal */}
      <Modal transparent={true} animationType="fade" visible={modalVisible}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { 
            top: modalPosition.top, 
            left: Math.min(modalPosition.left, windowWidth - 160)
          }]}>
           {role=="owner" &&( <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => { 
                setModalVisible(false); 
                navigation.navigate('EditPond', { pondId: selectedPond?.id }); 
              }}
            >
              <FontAwesome5 name="edit" size={16} color="#3B82F6" style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>Edit Pond</Text>
            </TouchableOpacity>)}
            
            {role=="owner" &&(
          <TouchableOpacity 
          style={[styles.modalOption, styles.deleteOption]} 
          onPress={() => { 
            setModalVisible(false); 
            deletePond(selectedPond?.id) 
          }}
        >
          <FontAwesome5 name="trash-alt" size={16} color="#3B82F66" style={styles.modalIcon} />
          <Text style={[styles.modalOptionText, styles.deleteText]}>Delete Pond</Text>
        </TouchableOpacity>
          
          )}
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => { 
                setModalVisible(false); 
                navigation.navigate('Analytics', { pondId: selectedPond?.id,pondName: selectedPond?.name }) 
              }}
            >
              <FontAwesome5 name="chart-line" size={16} color="#3B82F6" style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>View Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => { 
                setModalVisible(false); 
                navigation.navigate('AlertHistory', { pondId: selectedPond?.id }) 
              }}
            >
              <FontAwesome5 name="bell" size={16} color="#3B82F6" style={styles.modalIcon} />
              <Text style={styles.modalOptionText}>Alert History</Text>
            </TouchableOpacity>
            
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f5f9fc',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2c3e50',
    margin: 20,
    marginBottom: 15,
    marginTop: 25,
  },
  pondList: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  pondCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  imgContainer: {
    position: 'relative',
    width: 90,
    height: 90,
  },
  pondImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  statusBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  pondContent: {
    flexDirection: 'row',
    flex: 1,
  },
  pondDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  pondName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
  menuButton: {
    padding: 8,
    alignSelf: 'center',
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
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
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
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  modalIcon: {
    marginRight: 10,
    width: 18,
   color:' #3B82F6'
  },
  modalOptionText: {
    fontSize: 14,
    color: '#1F2937',
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyImage: {
    width: 180,
    height: 180,
    opacity: 0.7,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
  },
});

export default PondList;