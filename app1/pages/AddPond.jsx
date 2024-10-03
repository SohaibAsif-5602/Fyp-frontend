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
import { DarkModeContext } from '../contexts/DarkModeContext'; // Import DarkModeContext
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPond = ({ navigation }) => {
  const [pondName, setPondName] = useState('');
  const [location, setLocation] = useState('');
  const [fishSpecies, setFishSpecies] = useState('');
  const [fishAge, setFishAge] = useState('');

  const { isDarkMode } = useContext(DarkModeContext); // Consume isDarkMode from context

  // const handleSubmit = () => {
  //   if (pondName && location && fishSpecies && fishAge) {
  //     if (parseInt(fishAge) <= 6) {
        
  //       // Handle form submission here (e.g., API call or local state update)
  //       Alert.alert('Pond Added', ${pondName} pond added successfully!);
  //       navigation.goBack();
  //     } else {
  //       Alert.alert('Error', 'Fish age cannot be more than 6 months.');
  //     }
  //   } else {
  //     Alert.alert('Error', 'Please fill all fields');
  //   }
  // };

  // const handleSubmit = async () => {
  //   if (pondName && location && fishSpecies && fishAge) {
  //     if (parseInt(fishAge) <= 6) {
  //       try {
  //         // Make a POST request to your backend to create a ThingSpeak channel
  //         const response = await fetch('http://10.120.150.227:8080/create-channel', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ channelName: pondName }), // Send the pond name to the backend
  //         });
  
  //         const data = await response.json();
  
  //         if (response.ok) {
  //           // Handle successful response
  //           Alert.alert('Pond Added', ${pondName} pond added successfully!);
  //           navigation.goBack();
  //         } else {
  //           // Handle error from the server
  //           Alert.alert('Error', data.error || 'Failed to create a channel. Please try again.');
  //         }
  //       } catch (error) {
  //         console.error('Error creating channel:', error);
  //         Alert.alert('Error', 'An unexpected error occurred. Please try again.');
  //       }
  //     } else {
  //       Alert.alert('Error', 'Fish age cannot be more than 6 months.');
  //     }
  //   } else {
  //     Alert.alert('Error', 'Please fill all fields');
  //   }
  // };
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
   
            const response = await fetch(process.env.EXPO_PUBLIC_API_URL+'/add-pond', {
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
    <ScrollView contentContainerStyle={[styles.container, isDarkMode && styles.darkContainer]}>
      <Image
        source={require('../assets/fish_logo.png')} // Replace with your pond image URL
        style={styles.headerImage}
      />

      <Text style={[styles.label, isDarkMode && styles.darkText]}>Pond Name</Text>
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        value={pondName}
        onChangeText={setPondName}
        placeholder="Enter Pond Name"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'} // Adjust placeholder color
      />

      <Text style={[styles.label, isDarkMode && styles.darkText]}>Location</Text>
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter Pond Location"
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
      />

      <Text style={[styles.label, isDarkMode && styles.darkText]}>Fish Species</Text>
      <View style={[styles.pickerContainer, isDarkMode && styles.darkPickerContainer]}>
        <Picker
          selectedValue={fishSpecies}
          onValueChange={(itemValue) => setFishSpecies(itemValue)}
          style={[styles.picker, isDarkMode && styles.darkPicker]}
          itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
        >
          <Picker.Item label="Select Fish Species" value="" />
          <Picker.Item label="Catla" value="Catla" />
          <Picker.Item label="Silver Carp" value="Silver Carp" />
          <Picker.Item label="Thalia" value="Thalia" />
          <Picker.Item label="Raho" value="Raho" />
        </Picker>
      </View>

      <Text style={[styles.label, isDarkMode && styles.darkText]}>Fish Age (in months)</Text>
      <TextInput
        style={[styles.input, isDarkMode && styles.darkInput]}
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
        placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
      />

      <TouchableOpacity style={[styles.addButton, isDarkMode && styles.darkAddButton]} onPress={handleSubmit}>
        <Text style={[styles.addText, isDarkMode && styles.darkAddText]}>Add Pond</Text>
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
  darkContainer: {
    backgroundColor: '#000',
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
  darkText: {
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2, // Adding shadow for a more professional look
    color: '#000',
  },
  darkInput: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
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
  darkPickerContainer: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  picker: {
    width: '100%',
    height: '100%',
    color: '#000',
  },
  darkPicker: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#00bcd4',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  darkAddButton: {
    backgroundColor: '#1a8bbf',
  },
  addText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  darkAddText: {
    color: '#fff',
  },
});

export default AddPond;