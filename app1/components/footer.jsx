import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Footer() {
  const navigation = useNavigation();
  const route = useRoute();

  // Function to check if a route is active
  const isActive = (routeName) => route.name === routeName;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.footerContainer}>
        {/* Home Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons
            name="home-outline"
            size={24}
            color={isActive('Home') ? '#4F8EF7' : '#ccc'}
          />
          <Text
            style={[
              styles.label,
              { color: isActive('Home') ? '#4F8EF7' : '#ccc' },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Ponds')}
        >
          <AntDesign
            name="profile"
            size={24}
            color={isActive('Ponds') ? '#4F8EF7' : '#ccc'}
          />
          <Text
            style={[
              styles.label,
              { color: isActive('Ponds') ? '#4F8EF7' : '#ccc' },
            ]}
          >
            Ponds
          </Text>
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Setting')}
        >
          <AntDesign
            name="setting"
            size={24}
            color={isActive('Setting') ? '#4F8EF7' : '#ccc'}
          />
          <Text
            style={[
              styles.label,
              { color: isActive('Setting') ? '#4F8EF7' : '#ccc' },
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>

        {/* Notifications Button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <FontAwesome5
            name="bell"
            size={24}
            color={isActive('Notifications') ? '#4F8EF7' : '#ccc'}
          />
          <Text
            style={[
              styles.label,
              { color: isActive('Notifications') ? '#4F8EF7' : '#ccc' },
            ]}
          >
            Alerts
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    flex: 1, // Ensures buttons take equal space
  },
  label: {
    fontSize: 12,
    color: '#4F8EF7',
    marginTop: 2,
  },
});
