import React, { useEffect, useState } from 'react';
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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import CONFIG from '../config';

const EditTask = ({ route, navigation }) => {
  const { taskId } = route.params;

  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending'); // default
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${CONFIG.OWNER_URL}/get-task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setDescription(data.description || '');
          setStatus(data.status || 'pending');
          if (data.due_date) {
            setDueDate(new Date(data.due_date));
          }
        } else {
          Alert.alert('Error', data.error || 'Failed to fetch task details.');
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    };

    fetchTaskDetails();
  }, [taskId]);

  const handleUpdate = async () => {
    if (!description || !status || !dueDate) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const formattedDate = dueDate.toISOString(); // "2024-05-07T12:00:00.000Z"

      const response = await fetch(`${CONFIG.OWNER_URL}/update-task/${taskId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          status,
          due_date: formattedDate,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Task updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.error || 'Failed to update task.');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Task Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter task description"
        multiline
      />

      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={status}
        onValueChange={setStatus}
        style={styles.input}
      >
        <Picker.Item label="Pending" value="pending" />
        <Picker.Item label="In Progress" value="in-progress" />
        <Picker.Item label="Completed" value="completed" />
      </Picker>

      <Text style={styles.label}>Due Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        <Text>{dueDate.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDueDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0077BE',
    paddingVertical: 15,
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default EditTask;
