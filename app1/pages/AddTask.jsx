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
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config';

const CreateTask = ({ navigation }) => {
  const [pondId, setPondId] = useState('');
  const [taskCategoryId, setTaskCategoryId] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async () => {
    if (!pondId || !taskCategoryId || !assignedTo || !description) {
      return Alert.alert('Error', 'Please fill all required fields');
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found. Redirecting to login.');
        return navigation.navigate('Login');
      }

      const response = await fetch(`${CONFIG.OWNER_URL}/create-task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pond_id: pondId,
          taskCategoryId,
          assigned_to: assignedTo,
          description,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Task created successfully');
        setPondId('');
        setTaskCategoryId('');
        setAssignedTo('');
        setDescription('');
        setDueDate('');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Pond ID</Text>
      <TextInput
        style={styles.input}
        value={pondId}
        onChangeText={setPondId}
        placeholder="Enter Pond ID"
      />

      <Text style={styles.label}>Task Category ID</Text>
      <TextInput
        style={styles.input}
        value={taskCategoryId}
        onChangeText={setTaskCategoryId}
        placeholder="Enter Task Category ID"
      />

      <Text style={styles.label}>Assigned To (User ID)</Text>
      <TextInput
        style={styles.input}
        value={assignedTo}
        onChangeText={setAssignedTo}
        placeholder="Enter Assigned User ID"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Task Description"
        multiline
      />

      <Text style={styles.label}>Due Date (YYYY-MM-DDTHH:MM:SSZ)</Text>
      <TextInput
        style={styles.input}
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="2025-05-10T12:00:00Z"
      />

      <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
        <Text style={styles.addText}>Create Task</Text>
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
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#0077BE',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  addText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreateTask;
