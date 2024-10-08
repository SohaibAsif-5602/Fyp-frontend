import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import axios for API calls
import moment from 'moment'; // To format the timestamp

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Get the token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'User not authenticated. Please log in.');
          return;
        }

        // Fetch notifications from the server
        const response = await axios.get(process.env.EXPO_PUBLIC_API_URL + '/api/notifications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Assuming the API returns an array of notifications
        const fetchedNotifications = response.data.map((notification) => ({
          id: notification.notification_id.toString(),
          title: notification.notification_title,
          body: notification.notification_body,
          time: notification.created_at,
          icon: 'notifications-outline', // Set a default icon for notifications
        }));

        // Update state with fetched notifications
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        Alert.alert('Error', 'Failed to fetch notifications');
      }
    };

    fetchNotifications();
  }, []);

  // Function to render each notification item
  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={30} color="#4F8EF7" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.time}>{moment(item.time).fromNow()}</Text>
      </View>
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
});

export default NotificationScreen;
