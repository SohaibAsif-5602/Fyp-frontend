import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config';
import { useEffect } from 'react';


const AddPond = ({ navigation, route }) => {
  
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const farmIdFromRoute = route?.params?.farmId;
  
  const [pondName, setPondName] = useState('');
  const [type, setType] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');

    useEffect(() => {
      const fetchFarms = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            navigation.navigate('Login');
            return;
          }
    
          const response = await fetch(`${CONFIG.OWNER_URL}/get-farm-name-and-id`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
    
          const data = await response.json();
    
          if (response.ok) {
            setFarms(data.farms);
            if (farmIdFromRoute) {
              setSelectedFarmId(farmIdFromRoute); // Just pre-select, don’t filter the list
            }
          } else {
            Alert.alert('Error', data.error || 'Failed to fetch farms');
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to load farms.');
        }
      };
    
      fetchFarms();
    }, [farmIdFromRoute]);
    
  
  
  


  const handleSubmit = async () => {
    if (!pondName || !type || !length || !width || !depth) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (!selectedFarmId) {
      Alert.alert('Error', 'Please select a farm');
      return;
    }
    
    if (!['Clay', 'Concrete'].includes(type)) {
      Alert.alert('Error', "Invalid pond type. Choose 'Clay' or 'Concrete'.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const response = await fetch(`${CONFIG.OWNER_URL}/add-pond/${selectedFarmId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: pondName,
          type,
          length,
          width,
          depth,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Pond added successfully!');
        setPondName('');
        setType('');
        setLength('');
        setWidth('');
        setDepth('');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error || 'Failed to add pond');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
<Text style={styles.label}>Select Farm</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={selectedFarmId}
    onValueChange={(value) => setSelectedFarmId(value)}
    style={styles.picker}
  >
    <Picker.Item label="Select a Farm" value="" />
    {farms.map((farm) => (
      <Picker.Item key={farm.id} label={farm.name} value={farm.id} />
    ))}
  </Picker>
</View>

      <Text style={styles.label}>Pond Name</Text>
      <TextInput
        style={styles.input}
        value={pondName}
        onChangeText={setPondName}
        placeholder="Enter Pond Name"
      />

      <Text style={styles.label}>Pond Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={type}
          onValueChange={(value) => setType(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Pond Type" value="" />
          <Picker.Item label="Clay" value="Clay" />
          <Picker.Item label="Concrete" value="Concrete" />
        </Picker>
      </View>

      <Text style={styles.label}>Length (meters)</Text>
      <TextInput
        style={styles.input}
        value={length}
        onChangeText={setLength}
        placeholder="Enter Length"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Width (meters)</Text>
      <TextInput
        style={styles.input}
        value={width}
        onChangeText={setWidth}
        placeholder="Enter Width"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Depth (meters)</Text>
      <TextInput
        style={styles.input}
        value={depth}
        onChangeText={setDepth}
        placeholder="Enter Depth"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addText}>Add Pond</Text>
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
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2,
    color: '#000',
  },
  pickerContainer: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    elevation: 2,
  },
  picker: {
    width: '100%',
    height: '100%',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#0077BE',
    paddingVertical: 15,
    alignSelf: 'center',
    borderRadius: 32,
    width: 140,
    alignItems: 'center',
    marginTop: 20,
  },
  addText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddPond;
