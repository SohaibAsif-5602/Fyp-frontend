import React, { useContext, useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DarkModeContext } from '../contexts/DarkModeContext';

const Logo = () => (
  <Image
    source={require('../assets/fish_logo.png')}
    style={styles.logo}
    resizeMode="contain"
  />
);

const Setting = () => {
  const navigation = useNavigation();
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const [areAlertsEnabled, setAreAlertsEnabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prevState) => !prevState);
  const toggleAutoAction = () => {
    setIsModalVisible(true); // Show modal when the switch is toggled
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const logout = async () => {
    console.log('Logging out...');
    await AsyncStorage.removeItem('token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const view_fish_guide = () => {
    navigation.navigate('Fish Guide');
  };

  const handleYes = () => {
    setIsModalVisible(false);
    setAreAlertsEnabled(false); // Disable auto-action
  };

  const handleNo = () => {
    setIsModalVisible(false);
    setAreAlertsEnabled(true); // Keep auto-action enabled
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Image
          source={
            userData.imagelink && userData.imagelink.startsWith('http')
              ? { uri: userData.imagelink }
              : require('../assets/profile.jpeg')
          }
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userData.username || 'N/A'}</Text>
        <Text style={styles.profileEmail}>{userData.email || 'N/A'}</Text>
      </View>

      <View style={styles.option}>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>Turn off auto-action</Text>
        <Switch value={areAlertsEnabled} onValueChange={toggleAutoAction} />
      </View>

        <TouchableOpacity style={styles.option} onPress={() => EditNav()}>
          <Icon name="person-outline" size={24} color="#000" />
          <Text style={styles.optionText}>View Profile</Text>
          <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('fishguide')}>
          <Icon name="book-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Fish Guide</Text>
          <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Fishbot')}>
          <Icon name="help-circle-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Help Center</Text>
          <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={logout}>
          <Icon name="exit-outline" size={24} color="#000" />
          <Text style={styles.optionText}>Log Out</Text>
          <Icon name="chevron-forward-outline" size={24} color="#000" />
        </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  headertext: {
    paddingVertical: 17,
    backgroundColor: '#00bcd4',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  darkHeadertext: {
    backgroundColor: '#000',
  },
  optionContainer: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default Setting;
