import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Setting = () => {
  const navigation = useNavigation();
  const [areAlertsEnabled, setAreAlertsEnabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleAutoAction = () => {
    setIsModalVisible(true); // Show modal when the switch is toggled
  };

  const viewAlertSettingsPage = () => {
    navigation.navigate('AlertSettingsPage');
  };

  const view_fish_guide = () => {
    navigation.navigate('fishguide');
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
    <View style={styles.container}>
      <View style={styles.optionsContainer}>
        <View style={styles.option}>
          <Text style={styles.optionText}>Turn off auto-action</Text>
          <Switch
            value={areAlertsEnabled}
            onValueChange={toggleAutoAction}
            thumbColor={areAlertsEnabled ? '#4caf50' : '#f44336'}
            trackColor={{ true: '#b2fab4', false: '#f6c5c7' }}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={view_fish_guide}>
          <Text style={styles.buttonText}>Fish Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Fishbot')}
        >
          <Text style={styles.buttonText}>Help Center</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for confirmation */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to turn off automatic corrective actions
              from all your ponds? You can still choose to take action on an
              alert.
            </Text>
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalButton, styles.noButton]} onPress={handleNo}>
                <Text style={styles.modalButtonText}>No</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.yesButton]} onPress={handleYes}>
                <Text style={styles.modalButtonText}>Yes</Text>
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
    backgroundColor: '#f4f6f9',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3c4858',
    marginTop: 10,
  },
  optionsContainer: {
    marginTop: 20,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    marginVertical: 10,
    paddingVertical: 15,
    backgroundColor: '#0077BE',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  yesButton: {
    backgroundColor: '#4caf50',
  },
  noButton: {
    backgroundColor: '#f44336',
  },
});

export default Setting;
