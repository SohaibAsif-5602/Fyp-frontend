import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';

const AddPond = ({ navigation }) => {
  const [pondName, setPondName] = useState('');
  const [location, setLocation] = useState('');
  const [fishSpecies, setFishSpecies] = useState('');
  const [fishAge, setFishAge] = useState('');

  const handleSubmit = () => {
    if (pondName && location && fishSpecies && fishAge) {
      // Handle form submission here (e.g., API call or local state update)
      Alert.alert('Pond Added', `${pondName} pond added successfully!`);
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://t3.ftcdn.net/jpg/05/66/14/16/360_F_566141635_0kJ26Xqbl2fTI1dFQBHJpRBWOM6C5Ryp.jpg' }} // Replace with your pond image URL
        style={styles.headerImage}
      />

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
      <TextInput
        style={styles.input}
        value={fishSpecies}
        onChangeText={setFishSpecies}
        placeholder="Enter Fish Species"
      />

      <Text style={styles.label}>Fish Age (in months)</Text>
      <TextInput
        style={styles.input}
        value={fishAge}
        onChangeText={setFishAge}
        placeholder="Enter Fish Age"
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
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ddd',
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
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 2, // Adding shadow for a more professional look
  },
  addButton: {
    backgroundColor: '#00bcd4',
    paddingVertical: 15,
    borderRadius: 8,
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
