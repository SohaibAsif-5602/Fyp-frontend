import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

const PondList = () => {
  const navigation = useNavigation();
  const [ponds, setPonds] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const browseIconRefs = useRef([]); // To store refs for each browse icon

  useFocusEffect(
    useCallback(() => {
      const fetchPonds = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            console.log('No token found. Redirecting to login.');
            navigation.navigate('Login');
            return;
          }

          const response = await fetch(process.env.EXPO_PUBLIC_API_URL + '/api/ponds/get-ponds', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPonds(data.ponds);
            console.log('Ponds fetched:', data.ponds);
          } else if (response.status === 401) {
            await AsyncStorage.removeItem('token');
            navigation.navigate('Login');
          } else {
            console.error('Failed to fetch ponds');
          }
        } catch (error) {
          console.error('Error fetching ponds:', error.message);
          navigation.navigate('Login');
        }
      };

      fetchPonds();
    }, [navigation])
  );

  const handleBrowseClick = (pond, index) => {
    // Measure the position of the browse icon
    browseIconRefs.current[index]?.measure(
      (x, y, width, height, pageX, pageY) => {
        setModalPosition({ top:( pageY + height / 2)-100, left: pageX - 120 }); // Adjusted `left` for left alignment
        setSelectedPond(pond);
        setModalVisible(true);
      }
    );
  };

  const handleAction = (action) => {
    setModalVisible(false);
    Alert.alert(`Action Selected: ${action}`, `For Pond: ${selectedPond.pond_name}`);
    navigation.navigate('AddPond', { pond: selectedPond.pond_id });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.pondList}>
        {ponds.map((pond, index) => (
          <View key={index} style={styles.pondCard}>
            <TouchableOpacity style={styles.pondContent} onPress={() => navigation.navigate('Analytics', { pondId: pond.pond_id })}>
              <View style={styles.imgcontainer}>
                <Image source={{ uri: pond.imagelink }} style={styles.pondImage} />
              </View>
              <View style={styles.pondDetails}>
                <Text style={styles.city}>{pond.pond_name}</Text>
                <Text style={styles.fish}>{pond.pond_loc}</Text>
                <Text style={styles.fish}>{pond.specie}</Text>
                <Text style={styles.health}>Health: {pond.pond_score}%</Text>
                {pond.pond_score < 50 && <Text style={styles.warning}>⚠️ Health Warning</Text>}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              ref={(el) => (browseIconRefs.current[index] = el)} // Store the ref for each browse icon
              onPress={() => handleBrowseClick(pond, index)}
            >
              <FontAwesome5 name="ellipsis-v" size={24} color="black" style={styles.browseIcon} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddPond')}>
        <Text style={styles.addText}>+ Add</Text>
      </TouchableOpacity>

      {/* Modal for actions */}
      {modalVisible && (
        <Modal transparent={true} animationType="none" visible={modalVisible}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={[styles.modalContent, { top: modalPosition.top, left: modalPosition.left }]}>
              <TouchableOpacity style={styles.modalOption} onPress={() => { setModalVisible(false); navigation.navigate('Analytics', { pond: selectedPond.pond_id });    ;
}}>
                <Text style={styles.modalOptionText}>Edit Record</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={() => {setModalVisible(false);navigation.navigate('Analytics', { pond: selectedPond.pond_id })}}>
                <Text style={styles.modalOptionText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={() => {setModalVisible(false);navigation.navigate('Analytics', { pond: selectedPond.pond_id })}}>
                <Text style={styles.modalOptionText}>Delete </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={() =>{setModalVisible(false); navigation.navigate('AlertSettingsPage', { pondId: selectedPond.pond_id,pondName:selectedPond.pond_name })}}>
                <Text style={styles.modalOptionText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  imgcontainer: {
    height: 'auto',
    width: 100,
  },
  pondList: {
    alignItems: 'center',
    paddingBottom: 80,
    marginTop: 20,
  },
  pondCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
    width: '90%',
    overflow: 'hidden',
    padding: 10,
  },
  browseIcon: {
    padding: 10,
    paddingTop: 10,
    color:'#04324d'
  },
  pondContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pondDetails: {
    flex: 1,
    paddingVertical: 0,
    justifyContent: 'center',
    marginLeft: 15,
  },
  pondImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  city: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  fish: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  health: {
    fontSize: 16,
    fontWeight: '500',
    color: '#27ae60',
  },
  warning: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    
  },
  modalContent: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderWidth: 0.81,
    borderColor: '#0077be',
    borderRadius: 5,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor:'#0077be'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    padding: 10,
  },
  modalOptionText: {
    fontSize: 14,
  },
});

export default PondList;
