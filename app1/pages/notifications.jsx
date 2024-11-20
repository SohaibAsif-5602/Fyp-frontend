import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import axios for API calls
import moment from 'moment'; // To format the timestamp
import { useNavigation } from '@react-navigation/native';
import { DarkModeContext } from '../contexts/DarkModeContext'; // Import DarkModeContext

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkModeContext); // Access dark mode state

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
  }, [navigation]);

  // Function to render each notification item
  const renderItem = ({ item }) => (
    <View style={[styles.notificationCard, isDarkMode ? styles.darkCard : styles.lightCard]}>
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={30} color={isDarkMode ? '#007bff' : '#4F8EF7'} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>{item.title}</Text>
        <Text style={[styles.body, isDarkMode ? styles.darkText : styles.lightText]}>{item.body}</Text>
        <Text style={[styles.time, isDarkMode ? styles.darkTime : styles.lightTime]}>{moment(item.time).fromNow()}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
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
    padding: 10,
  },
  lightBackground: {
    backgroundColor: '#f9f9f9',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  lightCard: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
  },
  darkCard: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
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
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#ccc',
  },
  body: {
    fontSize: 14,
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
  },
  lightTime: {
    color: '#888',
  },
  darkTime: {
    color: '#aaa',
  },
});

export default NotificationScreen;
