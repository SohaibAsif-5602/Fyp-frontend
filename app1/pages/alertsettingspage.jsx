import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
const AlertSettingsPages = () => {
  const [isFirstModalVisible, setIsFirstModalVisible] = useState(false);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);
  const [checked, setChecked] = useState('first'); 
  const navigation = useNavigation();

  const view_pond_settings_page = () => {
    navigation.navigate('PondSetting');
  };

  const handleOkPress = () => {
    setIsFirstModalVisible(false);
    setIsSecondModalVisible(true); 
  };

  const handleYesPress = () => {
    setIsSecondModalVisible(false);
    alert('Alerts turned off');
  };

  const handleNoPress = () => {
    setIsSecondModalVisible(false); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={view_pond_settings_page}>
        <Text style={styles.text}>Turn off Alerts{'\n'}by ponds</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.alertbutton}
        onPress={() => setIsFirstModalVisible(true)}>
        <Text style={styles.text}>Turn off All{'\n'}Alerts</Text>
      </TouchableOpacity>

      {/* First Modal with Radio Buttons */}
      <Modal
        transparent={true}
        visible={isFirstModalVisible}
        animationType="fade"
        onRequestClose={() => setIsFirstModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>WARNING! ALL YOUR ALERTS FROM ALL YOUR PONDS WILL BE TURNED OFF FOR THE SELECTED TIME PERIOD. ALL AUTO-CORRECTIVE MEASURES WILL ALSO BE TURNED OFF.</Text>

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

      {/* Second Modal with Yes/No */}
      <Modal
        transparent={true}
        visible={isSecondModalVisible}
        animationType="fade"
        onRequestClose={() => setIsSecondModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to turn off all alerts from all your ponds? All auto-corrective actions will also be stopped.</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={handleNoPress}>
                <Text style={styles.buttonText}>No</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={handleYesPress}>
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
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: 'blue',
    padding: 30,
    marginBottom: 60,
  },
  alertbutton: {
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 30,
    marginBottom: 60,
  },
  text: {
    color: 'white',
    fontSize: 40,
    textAlign: 'center',
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
    alignItems: 'left',
  },
  modalText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    marginLeft: 160,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 2,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 17,
    color: 'red',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AlertSettingsPages;
