import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import CONFIG from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState(''); // State to hold the role
  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in again.');
        return;
      }
      const role =await AsyncStorage.getItem('role');
      setRole(role); // Set the role state
      let url=''
      if (role == 'worker') 
        {
          url=`${CONFIG.WORKER_URL}/tasks`;
        }
        if (role === 'owner')
        {
          url=`${CONFIG.OWNER_URL}/get-all-tasks`;
        }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      console.log('Tasks data:', response.data); // Log the response data
      console.log('Role:'); // Log the role for debugging
      setError('');
    } catch (error) {
      setError('Failed to fetch tasks. Pull to refresh.');
      console.error('Error fetching tasks:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markTaskAsDone = async (taskId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      
      const response = await axios.patch(`${CONFIG.WORKER_URL}/mark-completed/${taskId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Task marked as done:', response.data);
      fetchTasks(); // Refresh task list after marking done
    } catch (error) {
      console.error('Failed to mark task as done:', error.message);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        await fetchTasks();
    };
    fetchData();
    }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#27AE60';
      case 'pending': return '#F2C94C';
      case 'overdue': return '#EB5757';
      default: return '#4F4F4F';
    }
  };

  const getTaskIcon = (taskType) => {
    switch (taskType.toLowerCase()) {
      case 'feeding': return 'food';
      case 'harvesting': return 'basket';
      case 'cleaning': return 'broom';
      case 'monitoring': return 'clipboard-pulse';
      default: return 'clipboard-list';
    }
  };

  const formatDueDate = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `Due in ${diffDays} days`;
  };
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons 
          name={getTaskIcon(item.task_type)} 
          size={24} 
          color={getStatusColor(item.status)} 
        />
        <Text style={styles.title}>{item.description}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="water" size={16} color="#828282" />
          <Text style={styles.detailText}>{item.pond_name}</Text>
        </View>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="domain" size={16} color="#828282" />
          <Text style={styles.detailText}>{item.site_name}</Text>
        </View>
      </View>
  
      {role=="owner" && (<View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="account-arrow-right" size={16} color="#828282" />
          <Text style={styles.detailText}>Assigned To: {item.assigned_to}</Text>
        </View>
      </View>)}
  
      {role=="owner" && ( <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="account-arrow-left" size={16} color="#828282" />
          <Text style={styles.detailText}>Assigned By: {item.assigned_by}</Text>
        </View>
      </View>)}
  
      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="calendar-clock" size={16} color="#828282" />
          <Text style={styles.detailText}>
            {formatDueDate(item.due_date)}
          </Text>
        </View>
        <Text style={styles.taskType}>{item.task_type}</Text>
      </View>

      <Text style={styles.dueDate}>
        Due: {new Date(item.due_date).toLocaleString()}
      </Text>
  
      
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>

      {role=="worker" && item.status.toLowerCase() !== 'completed' && (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() =>
            Alert.alert(
              "Confirm",
              "Are you sure you want to mark this task as done?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Yes",
                  onPress: () => markTaskAsDone(item.id),
                  style: "destructive",
                },
              ],
              { cancelable: true }
            )
          }
        >
          <Text style={styles.doneButtonText}>Mark as Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading Tasks...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      

      {error ? (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={24} color="#EB5757" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks available</Text>
          </View>
        }
      />
      {role === "owner" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddFarm')}
        >
          <MaterialIcons name="add" size={28} color="white" />
          <Text style={styles.addText}> New Task</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f9fc', // Matching PondList's background
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0077BE', // Matching PondList's add button color
        paddingVertical: 20,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      },
      headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
        letterSpacing: 0.5,
      },
      taskCount: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 6,
      },
      countText: {
        color: '#0077BE', // Matching header color
        fontWeight: 'bold',
      },
      card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        marginBottom: 15, // Matching PondList's margin
        marginHorizontal: 15, // Matching PondList's padding
        shadowColor: '#000',
        shadowOpacity: 0.08, // Softer shadow
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      },
      statusBadge: {
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 4,
        alignSelf: 'flex-start',
        marginTop: 8,
      },
      statusText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '500',
      },
      detailText: {
        fontSize: 14,
        color: '#555', // Matching PondList's detail text
        marginLeft: 6,
      },
      errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FDEDED',
        padding: 16,
        margin: 16,
        borderRadius: 8,
      },
  

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#4F4F4F',
  },
  
 
 
  
 
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginLeft: 10,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
 
  taskType: {
    fontSize: 12,
    color: '#4F4F4F',
    fontStyle: 'italic',
  },
  dueDate: {
    fontSize: 12,
    color: '#828282',
    marginTop: 8,
  },
 
  errorText: {
    color: '#EB5757',
    marginLeft: 10,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    padding: 20,
  },
  emptyText: {
    color: '#828282',
    fontSize: 16,
    marginTop: 10,
  },
  doneButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  doneButtonText: {
    color: '#FFF',
    fontWeight: '600',
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
  
});

export default TasksPage;












