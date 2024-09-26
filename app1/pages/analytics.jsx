import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, Button, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, Image, icon } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';
import Header from '../components/Header';
import Footer from '../components/footer';
import { useNavigation } from '@react-navigation/native';

  
const Checkbox = ({ value, onValueChange, label }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={() => onValueChange(!value)}>
    <View style={[styles.checkbox, value && styles.checkboxChecked]}>
      {value && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function Analytics() {
  const navigation = useNavigation();
  const [temperatureData, setTemperatureData] = useState([]);
  const [phData, setPhData] = useState([]);
  const [turbidityData, setTurbidityData] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedChart, setSelectedChart] = useState("Temperature");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [filteredData, setFilteredData] = useState([]);
  const [fishHealth, setFishHealth] = useState(72);
  const [suggestions, setSuggestions] = useState(["Add Ammonia", "Cool Water Slightly"]);
  
  // State variables for delete pond functionality
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const view_alert_history = () => {
    navigation.navigate('AlertHistory');
  };

  useEffect(() => {
    const channelID = '2592426';
    const apiKey = '45H5S1N645GKKUCB';
    const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=100`;

    axios.get(url)
      .then(response => {
        const feeds = response.data.feeds;
        const formattedDates = feeds.map(feed => feed.created_at.split('T')[0]);
        setDates([...new Set(formattedDates)]); // Remove duplicate dates
        setTemperatureData(feeds.map(feed => ({ date: feed.created_at.split('T')[0], value: parseFloat(feed.field1) })));
        setPhData(feeds.map(feed => ({ date: feed.created_at.split('T')[0], value: parseFloat(feed.field2) })));
        setTurbidityData(feeds.map(feed => ({ date: feed.created_at.split('T')[0], value: parseFloat(feed.field3) })));
      })
      .catch(error => {
        console.error("Error fetching data from ThingSpeak:", error);
      });
  }, []);

  useEffect(() => {
    let dataToFilter = [];
    if (selectedChart === "Temperature") {
      dataToFilter = temperatureData;
    } else if (selectedChart === "pH") {
      dataToFilter = phData;
    } else if (selectedChart === "Turbidity") {
      dataToFilter = turbidityData;
    }

    if (selectedDate === "All Dates") {
      setFilteredData(dataToFilter);  // Show all data if "All Dates" is selected
    } else {
      setFilteredData(dataToFilter.filter(data => data.date === selectedDate));
    }
  }, [selectedChart, selectedDate, temperatureData, phData, turbidityData]);

  const renderChart = (data, title) => {
    const labels = data.map(item => item.date);
    const values = data.map(item => item.value);
  
    return (
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 30, marginTop: 20, textAlign: 'center', fontWeight: 'bold' }}>{title}</Text>
        {data.length > 0 ? (
          <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1 }}>
            <View pointerEvents="none">
              <LineChart
                data={{
                  labels: labels,
                  datasets: [{ data: values }],
                }}
                width={Math.max(420, labels.length * 60)} // Dynamically increase width based on data length
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: '#e26a01',
                  backgroundGradientFrom: 'blue',
                  backgroundGradientTo: 'green',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 25 },
                  propsForDots: {
                    r: '5',
                    strokeWidth: '2',
                    stroke: '#ffa726',
                  },
                }}
                bezier
                style={{
                  marginTop: 20,
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </ScrollView>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    );
  };
  
  const resetDialogStates = () => {
    setPassword('');
    setOtp('');
    setIsChecked(false);
  };

  const handleDeletePond = () => {
    resetDialogStates();
    setShowPasswordDialog(true);
  };

  const handlePasswordConfirm = () => {
    if (password.trim() === '') {
      Alert.alert("Error", "Please enter a password.");
      return;
    }
    setShowPasswordDialog(false);
    setShowOtpDialog(true);
  };

  const handleOtpConfirm = () => {
    if (otp.length !== 4) {
      Alert.alert("Error", "Please enter a 4-digit OTP.");
      return;
    }
    setShowOtpDialog(false);
    setShowFinalConfirmation(true);
  };

  const handleFinalConfirmation = () => {
    if (isChecked) {
      Alert.alert("Pond Deleted", "The pond has been successfully deleted.");
      setShowFinalConfirmation(false);
      resetDialogStates();
    } else {
      Alert.alert("Error", "Please check the confirmation box to delete the pond.");
    }
  };

  const renderDialog = (visible, content, onRequestClose) => (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onRequestClose}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity activeOpacity={1}>
            {content}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (<View style={styles.container}>
    <Header data={"Analytics"}/>
    <ScrollView >
      {/* Display the chart at the top */}
      {selectedChart === "Temperature" && renderChart(filteredData, 'TEMPERATURE CHART')}
      {selectedChart === "pH" && renderChart(filteredData, 'PH CHART')}
      {selectedChart === "Turbidity" && renderChart(filteredData, 'TURBIDITY CHART')}

      {/* Dropdown for Chart Selection */}
      <RNPickerSelect
        onValueChange={(value) => setSelectedChart(value)}
        items={[
          { label: "Temperature", value: "Temperature"},
          { label: "pH", value: "pH" },
          { label: "Turbidity", value: "Turbidity" },
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Select Chart", value: "Temperature" }}  // Default chart to Temperature
      />

      {/* Dropdown for Date Selection */}
      <RNPickerSelect
        onValueChange={(value) => setSelectedDate(value)}
        items={[
          { label: "All Dates", value: "All Dates" },  // Default to "All Dates"
          ...dates.map(date => ({ label: date, value: date })),
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Select Date", value: "All Dates" }}  // Default date to "All Dates"
      />

      {/* Fish Health Section */}
      <Text style={styles.fishHealth}>Fish Health - <Text style={styles.fishHealthValue}>{fishHealth}%</Text> Okay</Text>

      {/* Suggestions */}
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsHeader}>Suggestions</Text>
        {suggestions.map((suggestion, index) => (
          <Text key={index} style={styles.suggestionItem}>• {suggestion}</Text>
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <Button title="View Alerts History" onPress={view_alert_history} color="#3366FF" />
        <Button title="Delete Pond" onPress={handleDeletePond} color="#FF3300" />
      </View>

      {/* Password Dialog */}
      {renderDialog(
        showPasswordDialog,
        <>
          <Text style={styles.dialogTitle}>Enter Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
          />
          <View style={styles.dialogButtons1}>
          <TouchableOpacity style={styles.dialogconfirmButton1} onPress={() => setShowPasswordDialog(false)}>
            <Text style={styles.confirmButtonText}>Cancel</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.dconfirmButton1} onPress={handlePasswordConfirm}>
            <Text style={styles.confirmButtonText1}>Confirm</Text>
          </TouchableOpacity>
          </View>
        </>,
        () => setShowPasswordDialog(false)
      )}

      {/* OTP Dialog */}
      {renderDialog(
        showOtpDialog,
        <>
          <Text style={styles.dialogTitle}>Enter 4-digit OTP</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={4}
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter 4-digit OTP"
          />
          <TouchableOpacity style={styles.confirmButton} onPress={handleOtpConfirm}>
            <Text style={styles.confirmButtonText}>OK</Text>
          </TouchableOpacity>
        </>,
        () => setShowOtpDialog(false)
      )}

      {/* Final Confirmation Dialog */}
      {renderDialog(
        showFinalConfirmation,
        <>
          <Text style={styles.dialogText}>Are you sure you want to delete this pond? This will delete all the pond's data, monetring and alerts.</Text>
          <Checkbox
            value={isChecked}
            onValueChange={setIsChecked}
            label="Yes, I'm sure I want to delete this pond"
          />
          <View style={styles.dialogButtons}>
          <TouchableOpacity style={styles.dialogconfirmButton} onPress={() => setShowFinalConfirmation(false)}>
            <Text style={styles.confirmButtonText}>No</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.dconfirmButton} onPress={handleFinalConfirmation}>
            <Text style={styles.confirmButtonText}>Yes</Text>
          </TouchableOpacity>
          </View>
        </>,
        () => setShowFinalConfirmation(false)
      )}
      
    </ScrollView>
    <Footer style={styles.footerStyle} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#e6f7ff',
  },
  footerStyle: {
    position: 'fixed',
    bottom: 0,
    marginTop: 10,
    width: '100%',
  },
  fishHealth: {
    borderRadius: 20,
    width: '90%',
    marginLeft: '5%',
    backgroundColor: 'blue',
    fontSize: 26,
    textAlign: 'center',
    marginVertical: 10,
    paddingVertical: 20,
  },
  fishHealthValue: {
    fontWeight: 'bold',
    color: '#FFCC00',
  },
  suggestionsContainer: {
    borderRadius: 20,
    width: '90%',
    marginLeft: '5%',
    backgroundColor: '#33FF33',
    padding: 10,
    marginVertical: 10,
  },
  suggestionsHeader: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 20,
  },
  suggestionItem: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    padding: 10,
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
    alignItems: 'center',
    width: '80%',
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'black',
    borderWidth: 1.5,
    padding: 10,
    marginVertical: 10,
    width: '80%',
    borderRadius: 5,
    marginLeft: 20,
  },
  dialogButtons1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    marginLeft: 20,
    marginTop: 0,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '30%',
    marginLeft: 200,
    marginTop: 0,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  checkboxChecked: {
    backgroundColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 200,
    marginTop: 0,
  },
  dialogconfirmButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'red',
    width: 40,
    padding: 8,
    justifyContent: 'center',
  },
  dialogconfirmButton1: {
    backgroundColor: 'white',
    padding: 8,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  dconfirmButton1: {
    backgroundColor: 'black',
    color: 'white',
    borderRadius: 5,

  },
  dconfirmButton: {
    backgroundColor: 'red',
    width: 40,
    padding: 8,
    justifyContent: 'center',
    marginLeft: 40,
  },
  confirmButton: {
    backgroundColor: 'green',
    width: 40,
    padding: 10,
    justifyContent: 'center',
    marginLeft: 60,
  },
  confirmButtonText1: {
    color: 'white',
    padding: 10,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
  },
  dialogText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#777',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#b3e0ff',
    marginVertical: 10,
  },
});
