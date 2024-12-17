import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

const AlertSettingsPages = () => {
  const route = useRoute();
  const { pondId } = route.params;
  const { pondName } = route.params;

  // State for toggles
  const [alerts, setAlerts] = useState({
    ph: false,
    temp: false,
    turbidity: false,
  });

  const [actions, setActions] = useState({
    ph: false,
    temp: false,
    turbidity: false,
  });

  // Toggle handlers
  const handleAlertToggle = (key) => {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
    console.log(actions);
  };

  const handleActionToggle = (key) => {
    console.log(actions);
    setActions((prev) => ({ ...prev, [key]: !prev[key] }));
    console.log(actions);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Pond Settings</Text>
        <Text style={styles.title1}>{pondName}</Text>

        {/* Alerts Section */}
        <Text style={styles.sectionTitle}>Alerts</Text>
        <View style={styles.toggleGroup}>
          {Object.keys(alerts).map((key) => (
            <View key={key} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{key.toUpperCase()}</Text>
              <Switch
                value={alerts[key]}
                onValueChange={() => handleAlertToggle(key)}
              />
            </View>
          ))}
        </View>

        {/* Actions Section */}
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.toggleGroup}>
          {Object.keys(actions).map((key) => (
            <View key={key} style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>{key.toUpperCase()}</Text>
              <Switch
                value={actions[key]}
                onValueChange={() => {
                  handleActionToggle(key);
                  console.log(key);
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1, // Ensures content is scrollable
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 27,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  title1: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleGroup: {
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default AlertSettingsPages;
