import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import the Picker
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPond = ({ navigation }) => {
  const [pondName, setPondName] = useState('');
  const [location, setLocation] = useState('');
  const [fishSpecies, setFishSpecies] = useState('');
  const [fishAge, setFishAge] = useState('');

  const handleSubmit = async () => {
    if (pondName && location && fishSpecies && fishAge) {
      if (parseInt(fishAge) <= 6) {
        try {
          const token = await AsyncStorage.getItem('token');
          if (!token) {
            console.log('No token found. Redirecting to login.');
            navigation.navigate('Login');
            return;
          }
   
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL+'/api/ponds/add-pond', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              channelName: pondName,
              location: location,
              fishSpecies: fishSpecies,
              fishAge: fishAge,
            }), // Send all required data to the backend
          });
  
          const data = await response.json();
  
          if (response.ok) {
            // Handle successful response
            Alert.alert(`'Pond Added', ${pondName} pond added successfully!`);
            setPondName('');
            setLocation('');
            setFishSpecies('');
            setFishAge('');
            navigation.goBack();
          } else {
            // Handle error from the server
            Alert.alert('Error', data.error || 'Failed to create a channel. Please try again.');
          }
        } catch (error) {
          console.error('Error creating channel:', error);
          Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        }
      } else {
        Alert.alert('Error', 'Fish age cannot be more than 6 months.');
      }
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };
  

  return (
    
    <ScrollView contentContainerStyle={[styles.container]}>
     

      <Text style={[styles.label]}>Pond Name</Text>
      <TextInput
        style={[styles.input]}
        value={pondName}
        onChangeText={setPondName}
        placeholder="Enter Pond Name"
      />

      <Text style={[styles.label]}>Location</Text>
      <TextInput
        style={[styles.input]}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter Pond Location"
      />

      <Text style={[styles.label]}>Fish Species</Text>
      <View style={[styles.pickerContainer]}>
        <Picker
          selectedValue={fishSpecies}
          onValueChange={(itemValue) => setFishSpecies(itemValue)}
          style={[styles.picker]}
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
          <Picker.Item label= "Prawn" value="prawn" />
        </Picker>
      </View>

      <Text style={[styles.label]}>Fish Age (in months)</Text>
      <TextInput
        style={[styles.input]}
        value={fishAge}
        onChangeText={(text) => {
          // Allow only numbers less than or equal to 6
          if (/^\d*$/.test(text) && (text === '' || parseInt(text) <= 6)) {
            setFishAge(text);
          } else if (parseInt(text) > 6) {
            Alert.alert('Error', 'Fish age cannot be more than 6 months.');
          }
        }}
        placeholder="Enter Fish Age"
        keyboardType="numeric"
      />

      <TouchableOpacity style={[styles.addButton]} onPress={handleSubmit}>
        <Text style={[styles.addText]}>Add Pond</Text>
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
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    resizeMode: 'cover',
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
    elevation: 2, // Adding shadow for a more professional look
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
    elevation: 2, // Adding shadow for a more professional look
  },
  picker: {
    width: '100%',
    height: '100%',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#0077BE',
    paddingVertical: 15,
    alignSelf:'center',
    borderRadius: 32,
    width:105,
    alignItems: 'center',
    marginTop: 20,
  },
  addText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddPond;
