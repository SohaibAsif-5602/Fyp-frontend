import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const Logo = () => (
    <Image
      source={require('../assets/high-temperature.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );

export default function Setting() {
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [areAlertsEnabled, setAreAlertsEnabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(previousState => !previousState);
  const toggleAlerts = () => setAreAlertsEnabled(previousState => !previousState);

  const toggleAutoAction = () => {
    setIsModalVisible(true);  // Show modal when the switch is toggled
  };

  const view_alert_settings_page = () => {
    navigation.navigate('AlertSettingsPage');
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
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.headertext, isDarkMode && styles.darkText]}>Settings</Text>

      <View style={styles.option}>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
        />
      </View>

      <View style={styles.option}>
        <TouchableOpacity style={styles.button} onPress={view_alert_settings_page}>
            <Text style={styles.text}>Turn off Alerts</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.option}>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>Turn off auto-action</Text>
        <Switch
          value={areAlertsEnabled}
          onValueChange={toggleAutoAction}
        />
      </View>

      <View style={styles.option}>
        <TouchableOpacity style={styles.button} onPress={() => alert('Are you sure?')}>
            <Text style={styles.text}>Fish Guide</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.option}>
        <TouchableOpacity style={styles.button} onPress={() => alert('Are you sure?')}>
            <Text style={styles.text}>Help Center</Text>
          </TouchableOpacity>
      </View>

      <View style={styles.option}>
        <TouchableOpacity style={styles.button} onPress={() => alert('Are you sure?')}>
            <Text style={styles.text}>Learn More about Machiro</Text>
          </TouchableOpacity>
      </View>
      
      <View style={styles.logoContainer}>
        <Logo />
      </View>

      {/* Modal for confirmation */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to turn off automatic corrective actions from all your ponds? You can still choose to take action on an alert.</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={handleNo}>
                <Text style={styles.buttonText}>No</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={handleYes}>
                <Text style={styles.buttonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  headertext: {
    paddingVertical: 20,
    backgroundColor: 'lightblue',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    padding: 10,
    color: '#000',
  },
  text: {
    fontSize: 20,
    padding: 10,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
    marginLeft: 250,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 2,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
