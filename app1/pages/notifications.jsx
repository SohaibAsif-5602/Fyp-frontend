import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import CONFIG from '../config';

const getIconName = (type) => {
  switch (type) {
    case 'Message':
      return 'chatbox-ellipses-outline';
    case 'Inventory':
      return 'cube-outline';
    case 'System':
      return 'cog-outline';
    case 'Task':
      return 'checkmark-done-outline';
    case 'Alert':
      return 'alert-circle-outline';
    default:
      return 'notifications-outline';
  }
};

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'User not authenticated. Please log in.');
          return;
        }

        const response = await axios.get(CONFIG.OWNER_URL + '/get-notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedNotifications = response.data.map((notification) => ({
          id: notification.id.toString(),
          body: notification.message,
          type: notification.notification_type,
          isRead: notification.is_read === 1,
          icon: getIconName(notification.notification_type),
          time: notification.created_at || new Date().toISOString(),
        }));

        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        Alert.alert('Error', 'Failed to fetch notifications');
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      await axios.delete(`${CONFIG.OWNER_URL}/delete-notification/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove from local state
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.notificationCard, !item.isRead && styles.unreadNotification]}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={30} color="#4F8EF7" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.type}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.time}>{moment(item.time).fromNow()}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Icon name="trash-outline" size={24} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  unreadNotification: {
    backgroundColor: '#e6f0ff',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  body: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    marginLeft: 10,
    padding: 4,
  },
});

export default NotificationScreen;
