import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Switch, Pressable } from 'react-native';
import { RadioButton } from 'react-native-paper';

const PondSetting = () => {
  const [selectedPond, setSelectedPond] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFirstModalVisible, setIsFirstModalVisible] = useState(false);
  const [checked, setChecked] = useState('first'); // Radio button state

  // Store the alert states separately for each pond
  const [alerts, setAlerts] = useState({
    Lahore: { temperatureAlert: false, phAlert: false, doAlert: false },
    Islamabad: { temperatureAlert: false, phAlert: false, doAlert: false },
    Karachi: { temperatureAlert: false, phAlert: false, doAlert: false },
  });

  const ponds = [
    { name: 'Lahore', image: require('../assets/fish1.jpg') },
    { name: 'Islamabad', image: require('../assets/fish2.jpg') },
    { name: 'Karachi', image: require('../assets/fish3.jpg') }
  ];

  const handlePondPress = (pond) => {
    setSelectedPond(pond);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPond(null);
  };

  const handleSwitchChange = (alertType, value) => {
    // Update the alert state for the selected pond only
    setAlerts((prevAlerts) => ({
      ...prevAlerts,
      [selectedPond.name]: {
        ...prevAlerts[selectedPond.name],
        [alertType]: value,
      },
    }));

    if (value) {
      // Show the warning modal if any switch is turned on
      setIsFirstModalVisible(true);
    }
  };

  const handleOkPress = () => {
    // Handle OK press (do something like updating the alert status)
    setIsFirstModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.headertext]}>Settings</Text>
      <Text style={styles.title}>Select Pond</Text>
      <View style={styles.pondContainer}>
        {ponds.map((pond, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.pondCard} 
            onPress={() => handlePondPress(pond)}
          >
            <Image source={pond.image} style={styles.pondImage} />
            <Text style={styles.pondName}>{pond.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal for Pond Alerts */}
      {selectedPond && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle1}>{selectedPond.name} Alerts</Text>
              
              {/* Switches for Alerts */}
              <View style={styles.alertContainer}>
                <View style={styles.alertRow}>
                  <Text style={styles.alertText}>Temperature Alert</Text>
                  <Switch 
                    value={alerts[selectedPond.name].temperatureAlert} 
                    onValueChange={(value) => handleSwitchChange('temperatureAlert', value)} 
                  />
                </View>
                <View style={styles.alertRow}>
                  <Text style={styles.alertText}>PH Alert</Text>
                  <Switch 
                    value={alerts[selectedPond.name].phAlert} 
                    onValueChange={(value) => handleSwitchChange('phAlert', value)} 
                  />
                </View>
                <View style={styles.alertRow}>
                  <Text style={styles.alertText}>DO Alert</Text>
                  <Switch 
                    value={alerts[selectedPond.name].doAlert} 
                    onValueChange={(value) => handleSwitchChange('doAlert', value)} 
                  />
                </View>
              </View>

              {/* Button for All Alerts */}
              <TouchableOpacity style={styles.allAlertsButton}>
                <Text style={styles.allAlertsButtonText}>All {selectedPond.name} alerts</Text>
              </TouchableOpacity>

              {/* Close Button */}
              <Pressable style={styles.modalButton1} onPress={closeModal}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {/* Modal for Warning */}
      <Modal
        transparent={true}
        visible={isFirstModalVisible}
        animationType="fade"
        onRequestClose={() => setIsFirstModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              WARNING! ALL YOUR ALERTS FROM ALL YOUR PONDS WILL BE TURNED OFF FOR THE SELECTED TIME PERIOD. 
              ALL AUTO-CORRECTIVE MEASURES WILL ALSO BE TURNED OFF.
            </Text>

            {/* Radio Buttons */}
            <View style={styles.radioGroup}>
              <RadioButton
                value="first"
                status={checked === 'first' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('first')}
              />
              <Text>12 Hours</Text>
            </View>
            <View style={styles.radioGroup}>
              <RadioButton
                value="second"
                status={checked === 'second' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('second')}
              />
              <Text>24 Hours</Text>
            </View>
            <View style={styles.radioGroup}>
              <RadioButton
                value="third"
                status={checked === 'third' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('third')}
              />
              <Text>A Week</Text>
            </View>
            <View style={styles.radioGroup}>
              <RadioButton
                value="fourth"
                status={checked === 'fourth' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('fourth')}
              />
              <Text>Always</Text>
            </View>

            {/* Cancel and OK Buttons */}
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setIsFirstModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={handleOkPress}>
                <Text style={styles.buttonText}>OK</Text>
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
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  headertext: {
    width: '100%',
    backgroundColor: 'lightblue',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    padding: 10,
    color: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  pondContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  pondCard: {
    alignItems: 'center',
    width: '60%',
    marginBottom: 20,
  },
  pondImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 10,
  },
  pondName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'left',
  },
  modalTitle: {
    fontSize: 17,
    color: 'red',
    marginBottom: 15,
  },
  modalTitle1: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  alertContainer: {
    width: '100%',
    marginBottom: 20,
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  alertText: {
    fontSize: 18,
  },
  allAlertsButton: {
    width: '50%',
    flexDirection: 'row',
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  allAlertsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginLeft: 170,
  },
  modalButton1: {
    flexDirection: 'row',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default PondSetting;
