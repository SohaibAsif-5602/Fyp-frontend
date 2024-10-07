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
    if (areAlertsEnabled) {
      // Show modal only when turning off the auto-action
      setIsModalVisible(true);
    } else {
      // If auto-action is being turned on, simply enable it without showing the modal
      setAreAlertsEnabled(true);
    }
  };
  const viewAlertSettingsPage = () => {
    navigation.navigate('AlertSettingsPage');
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
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={styles.option}>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      <View style={styles.option}>
        <Text style={[styles.text, isDarkMode && styles.darkText]}>Turn off auto-action</Text>
        <Switch value={areAlertsEnabled} onValueChange={toggleAutoAction} />
      </View>

      <View style={styles.option}>
        <TouchableOpacity style={styles.button} onPress={view_fish_guide}>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>Fish Guide</Text>
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
          <View style={[styles.modalContent, isDarkMode && styles.darkModalContent]}>
            <Text style={[styles.modalText, isDarkMode && styles.darkText]}>
              Are you sure you want to turn off automatic corrective actions from all your ponds? You can still choose to take action on an alert.
            </Text>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30, // Reduced gap between buttons
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 150,
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
    width: '80%',
    alignItems: 'center',
  },
  darkModalContent: {
    backgroundColor: '#333',
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Setting;
