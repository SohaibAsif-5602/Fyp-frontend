import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/footer';
// Assume icon imports remain the same
const temperatureIcon = require('../assets/high-temperature.png');
const lowtemperatureIcon = require('../assets/low-temperature.png');
const phIcon = require('../assets/high-ph.png');
const lowphIcon = require('../assets/ph-low.png');
const dissolvedOxygenIcon = require('../assets/oxygen-tank.png');
const lowdissolvedOxygenIcon = require('../assets/medical.png');

// Custom Checkbox component
const Checkbox = ({ value, onValueChange, label }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={() => onValueChange(!value)}>
    <View style={[styles.checkbox, value && styles.checkboxChecked]}>
      {value && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function AlertHistory() {
  const [highestTemperature, setHighestTemperature] = useState(null);
  const [lowestTemperature, setLowestTemperature] = useState(null);
  const [highestPh, setHighestPh] = useState(null);
  const [lowestPh, setLowestPh] = useState(null);
  const [highestDissolvedOxygen, setHighestDissolvedOxygen] = useState(null);
  const [lowestDissolvedOxygen, setLowestDissolvedOxygen] = useState(null);
  
  const [showHighTemp, setShowHighTemp] = useState(true);
  const [showLowTemp, setShowLowTemp] = useState(true);
  const [showHighPh, setShowHighPh] = useState(true);
  const [showLowPh, setShowLowPh] = useState(true);
  const [showHighDO, setShowHighDO] = useState(false);
  const [showLowDO, setShowLowDO] = useState(true);
  const [showAll, setShowAll] = useState(true);

  // State to toggle dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const channelID = '2592426';
    const apiKey = '45H5S1N645GKKUCB';
    const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=100`;

    axios.get(url)
      .then(response => {
        const feeds = response.data.feeds;

        const temperatures = feeds.map(feed => ({
          date: feed.created_at.split('T')[0],
          value: parseFloat(feed.field1)
        }));
        const phValues = feeds.map(feed => ({
          date: feed.created_at.split('T')[0],
          value: parseFloat(feed.field2)
        }));
        const dissolvedOxygenValues = feeds.map(feed => ({
          date: feed.created_at.split('T')[0],
          value: parseFloat(feed.field3)
        }));

        const maxTemperature = temperatures.reduce((max, item) => (item.value > max.value ? item : max), temperatures[0]);
        const minTemperature = temperatures.reduce((min, item) => (item.value < min.value ? item : min), temperatures[0]);

        const maxPh = phValues.reduce((max, item) => (item.value > max.value ? item : max), phValues[0]);
        const minPh = phValues.reduce((min, item) => (item.value < min.value ? item : min), phValues[0]);

        const maxDissolvedOxygen = dissolvedOxygenValues.reduce((max, item) => (item.value > max.value ? item : max), dissolvedOxygenValues[0]);
        const minDissolvedOxygen = dissolvedOxygenValues.reduce((min, item) => (item.value < min.value ? item : min), dissolvedOxygenValues[0]);

        setHighestTemperature(maxTemperature);
        setLowestTemperature(minTemperature);
        setHighestPh(maxPh);
        setLowestPh(minPh);
        setHighestDissolvedOxygen(maxDissolvedOxygen);
        setLowestDissolvedOxygen(minDissolvedOxygen);
      })
      .catch(error => {
        console.error("Error fetching data from ThingSpeak:", error);
      });
  };

  const handleAllChange = (value) => {
    setShowAll(value);
    setShowHighTemp(value);
    setShowLowTemp(value);
    setShowHighPh(value);
    setShowLowPh(value);
    setShowHighDO(value);
    setShowLowDO(value);
  };

  const handleSave = () => {
    console.log('Save button pressed');
  };

  const renderAlertItem = (title, data, icon, show) => {
    if (!show || !data) return null;
    return (
      <View style={styles.alertContainer}>
        <Text style={styles.alertHeader}>{title}:</Text>
        <View style={styles.alertItem}>
          <Image source={icon} style={styles.icon} />
          <Text style={styles.alertText}>{data.date}: {data.value}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageHeader}>Alert History</Text>

      {/* Dropdown Section */}
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setDropdownOpen(!dropdownOpen)}>
        <Text style={styles.dropdownButtonText}>ALL</Text>
      </TouchableOpacity>

      {dropdownOpen && (
        <View style={styles.checkboxList}>
          <View style={styles.checkboxRow}>
            <Text style={styles.parameterLabel}>Temperature</Text>
            <View style={styles.checkboxGroup}>
              <Checkbox value={showHighTemp} onValueChange={setShowHighTemp} label="High" />
              <Checkbox value={showLowTemp} onValueChange={setShowLowTemp} label="Low" />
            </View>
          </View>
          <View style={styles.checkboxRow}>
            <Text style={styles.parameterLabel}>pH</Text>
            <View style={styles.checkboxGroup}>
              <Checkbox value={showHighPh} onValueChange={setShowHighPh} label="High" />
              <Checkbox value={showLowPh} onValueChange={setShowLowPh} label="Low" />
            </View>
          </View>
          <View style={styles.checkboxRow}>
            <Text style={styles.parameterLabel}>DO</Text>
            <View style={styles.checkboxGroup}>
              <Checkbox value={showHighDO} onValueChange={setShowHighDO} label="High" />
              <Checkbox value={showLowDO} onValueChange={setShowLowDO} label="Low" />
            </View>
          </View>
          <View style={styles.checkboxRow}>
            <Text style={styles.parameterLabel}>All</Text>
            <View style={styles.checkboxGroup}>
              <Checkbox value={showAll} onValueChange={handleAllChange} label="" />
            </View>
          </View>
        </View>
      )}

      {renderAlertItem("Highest Temperature", highestTemperature, temperatureIcon, showHighTemp)}
      {renderAlertItem("Lowest Temperature", lowestTemperature, lowtemperatureIcon, showLowTemp)}
      {renderAlertItem("Highest pH", highestPh, phIcon, showHighPh)}
      {renderAlertItem("Lowest pH", lowestPh, lowphIcon, showLowPh)}
      {renderAlertItem("Highest Dissolved Oxygen", highestDissolvedOxygen, dissolvedOxygenIcon, showHighDO)}
      {renderAlertItem("Lowest Dissolved Oxygen", lowestDissolvedOxygen, lowdissolvedOxygenIcon, showLowDO)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  pageHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  dropdownButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxList: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  parameterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxGroup: {
    flexDirection: 'row',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  checkmark: {
    color: 'white',
    fontSize: 18,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  alertHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  alertText: {
    fontSize: 16,
  },
});
