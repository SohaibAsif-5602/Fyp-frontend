
import React, { useState, useEffect } from 'react';
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

const EditPond = ({ route, navigation }) => {
    const { pondId } = route.params;


    const [pondName, setPondName] = useState('');
  const [location, setLocation] = useState('');
  const [fishSpecies, setFishSpecies] = useState('');
  const [fishAge, setFishAge] = useState('');

  useEffect(() => {
    // Fetch existing pond details
    const fetchPondDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('No token found. Redirecting to login.');
          navigation.navigate('Login');
          return;
        }
        console.log(pondId);
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/ponds/pond/${pondId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setPondName(data.pond_name);
          setLocation(data.pond_loc);
          setFishSpecies(data.specie);
          setFishAge(data.fishAge);
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch pond details.');
        }
      } catch (error) {
        console.error('Error fetching pond details:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    };

    fetchPondDetails();
  }, [pondId]);

  const handleUpdate = async () => {
    if (pondName && location && fishSpecies && fishAge) {
        console.log(fishAge);
       console.log(pondId);
        console.log(fishSpecies);
        console.log(location);
        console.log(pondName);
      if (parseInt(fishAge) <= 6) {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            console.log('No token found. Redirecting to login.');
            navigation.navigate('Login');
            return;
          }
          console.log(fishAge);
          console.log(pondId);
           console.log(fishSpecies);
           console.log(location);
           console.log(pondName);
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/ponds/${pondId}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pondName,
              location,
              fishSpecies,
              fishAge,
            }),
          });

          const data = await response.json();
          console.log(data);
          if (response.ok) {
            Alert.alert('Success', 'Pond details updated successfully!');
            navigation.goBack();
          } else {
            Alert.alert('Error', data.error || 'Failed to update pond details.');
          }
        } catch (error) {
          console.error('Error updating pond:', error);
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
      } else {
        Alert.alert('Error', 'Fish age cannot be more than 6 months.');
      }
    } else {
      Alert.alert('Error', 'Please fill all fields.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Pond Name</Text>
      <TextInput
        style={styles.input}
        value={pondName}
        onChangeText={setPondName}
        placeholder="Enter Pond Name"
      />

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter Pond Location"
      />

      <Text style={styles.label}>Fish Species</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={fishSpecies}
          onValueChange={(itemValue) => setFishSpecies(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Fish Species" value="" />
          <Picker.Item label="Catla" value="katla" />
          <Picker.Item label="Silver Carp" value="silverCup" />
          <Picker.Item label="Pangas" value="pangas" />
          <Picker.Item label="Rahu" value="pui" />
          <Picker.Item label="Koi" value="koi" />
          <Picker.Item label="Tilapia" value="tilapia" />
          <Picker.Item label="Mrigal" value="magur" />
          <Picker.Item label="Sing" value="sing" />
          <Picker.Item label="Shrimp" value="shrimp" />
          <Picker.Item label="Carp" value="karpio" />
          <Picker.Item label="Prawn" value="prawn" />
        </Picker>
      </View>

      <Text style={styles.label}>Fish Age (in months)</Text>
      <TextInput
        style={styles.input}
        value={fishAge}
        onChangeText={(text) => {
          if (/^\d*$/.test(text) && (text === '' || parseInt(text) <= 6)) {
            setFishAge(text);
          } else if (parseInt(text) > 6) {
            Alert.alert('Error', 'Fish age cannot be more than 6 months.');
          }
        }}
        placeholder="Enter Fish Age"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateText}>Update Pond</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
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
  },
  pickerContainer: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  updateButton: {
    backgroundColor: '#0077BE',
    paddingVertical: 15,
    alignSelf: 'center',
    borderRadius: 32,
    width: 120,
    alignItems: 'center',
    marginTop: 20,
  },
  updateText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditPond;