import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeContext } from '../contexts/DarkModeContext'; // Import DarkModeContext
import SpinningImageLoader from '../contexts/SpinningImageLoader'; // Import SpinningImageLoader

export default function Analytics() {
  const navigation = useNavigation();
  const route = useRoute();
  const pondId = route.params?.pondId;
  const { isDarkMode } = useContext(DarkModeContext); // Access dark mode state

  const [temperatureData, setTemperatureData] = useState([]);
  const [phData, setPhData] = useState([]);
  const [turbidityData, setTurbidityData] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedChart, setSelectedChart] = useState('Temperature');
  const [selectedDate, setSelectedDate] = useState('All Dates');
  const [filteredData, setFilteredData] = useState([]);
  const [fishHealth, setFishHealth] = useState(72);
  const [suggestions, setSuggestions] = useState(['Add Ammonia', 'Cool Water Slightly']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPondData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.log('No token found. Redirecting to login.');
          navigation.navigate('Login');
          return;
        }

        const response = await axios.get(process.env.EXPO_PUBLIC_API_URL + `/getPondData/${pondId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const { temperatureData, phData, turbidityData, dates, pond_score } = response.data;
          setDates([...new Set(dates)]);
          setTemperatureData(temperatureData);
          setPhData(phData);
          setTurbidityData(turbidityData);
          setFishHealth(pond_score);
          setLoading(false);
        } else {
          console.error('Failed to fetch pond data. Status:', response.status);
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error fetching pond data:', error.message);
        setLoading(false);
      }
    };

    if (pondId) {
      fetchPondData(); 
    }
  }, [pondId]);

<<<<<<< Updated upstream
=======
  const deletePond = async () => {
    console.log('Deleting pond:', pondId);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found. Redirecting to login.');
        navigation.navigate('Login');
        return;
      }
  
      const response = await axios.delete(`${process.env.EXPO_PUBLIC_API_URL}/delete-pond/${pondId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        console.log('Pond deleted successfully.');
        navigation.navigate('Ponds'); 
      } else {
        console.error('Failed to delete the pond. Status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting pond:', error.message);
    }
  };

>>>>>>> Stashed changes
  useEffect(() => {
    let dataToFilter = [];
    if (selectedChart === 'Temperature') {
      dataToFilter = temperatureData;
    } else if (selectedChart === 'pH') {
      dataToFilter = phData;
    } else if (selectedChart === 'Turbidity') {
      dataToFilter = turbidityData;
    }

    if (selectedDate === 'All Dates') {
      setFilteredData(dataToFilter);
    } else {
      setFilteredData(dataToFilter.filter(data => data.date === selectedDate));
    }
  }, [selectedChart, selectedDate, temperatureData, phData, turbidityData]);

  const renderChart = (data, title) => {
    const labels = data.map(item => item.date);
    const values = data.map(item => item.value);
  
    return (
      <View style={[styles.chartContainer, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
        <Text style={[styles.chartTitle, isDarkMode ? styles.darkText : styles.lightText]}>{title}</Text>
        {loading ? (
          <View style={styles.loaderContainer}>
            {/* Replace ActivityIndicator with SpinningImageLoader */}
            <SpinningImageLoader 
              source={require('../assets/fish_logo.png')} // Use your custom loader image
              size={50} // Adjust the size as needed
              duration={2000} // Customize the animation duration if needed
            />
          </View>
        ) : data.length === 0 ? (
          <View style={[styles.skeletonGraph, isDarkMode ? styles.darkSkeleton : styles.lightSkeleton]}>
            <Text style={[styles.noDataText, isDarkMode ? styles.darkText : styles.lightText]}>No Data Available</Text>
          </View>
        ) : (
          <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
            <LineChart
              data={{
                labels: labels,
                datasets: [{ data: values }],
              }}
              width={Math.max(420, labels.length * 60)}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: isDarkMode ? '#333' : '#007bff',
                backgroundGradientFrom: isDarkMode ? '#555' : '#6ec1e4',
                backgroundGradientTo: isDarkMode ? '#222' : '#007bff',
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
              style={styles.chart}
            />
          </ScrollView>
        )}
      </View>
    );
  };
  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <ScrollView>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedChart(value)}
            items={[
              { label: 'Temperature', value: 'Temperature' },
              { label: 'pH', value: 'pH' },
              { label: 'Turbidity', value: 'Turbidity' },
            ]}
            style={pickerSelectStyles(isDarkMode)}
            placeholder={{ label: 'Select Chart', value: 'Temperature' }}
          />
          <RNPickerSelect
            onValueChange={(value) => setSelectedDate(value)}
            items={[
              { label: 'All Dates', value: 'All Dates' },
              ...dates.map(date => ({ label: date, value: date })),
            ]}
            style={pickerSelectStyles(isDarkMode)}
            placeholder={{ label: 'Select Date', value: 'All Dates' }}
          />
        </View>

        {selectedChart === 'Temperature' && renderChart(filteredData, 'TEMPERATURE CHART')}
        {selectedChart === 'pH' && renderChart(filteredData, 'PH CHART')}
        {selectedChart === 'Turbidity' && renderChart(filteredData, 'TURBIDITY CHART')}

        <Text style={[styles.fishHealth, isDarkMode ? styles.darkFishHealth : styles.lightFishHealth]}>
          Fish Health - <Text style={styles.fishHealthValue}>{fishHealth}%</Text> Okay
        </Text>

        <View style={[styles.suggestionsContainer, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
          <Text style={[styles.suggestionsHeader, isDarkMode ? styles.darkText : styles.lightText]}>Suggestions</Text>
          {suggestions.map((suggestion, index) => (
            <Text key={index} style={[styles.suggestionItem, isDarkMode ? styles.darkText : styles.lightText]}>• {suggestion}</Text>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]} onPress={() => navigation.navigate('AlertHistory')}>
            <Text style={styles.buttonText}>View Alerts History</Text>
          </TouchableOpacity>
<<<<<<< Updated upstream
          <TouchableOpacity style={styles.deleteButton} onPress={() => console.log('Delete Pond')}>
=======
          <TouchableOpacity style={[styles.deleteButton, isDarkMode ? styles.darkDeleteButton : styles.lightDeleteButton]} onPress={deletePond}>
>>>>>>> Stashed changes
            <Text style={styles.buttonText}>Delete Pond</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#f0f8ff',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 220, // Adjust to match chart height
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  chartContainer: {
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 10,
  },
  lightContainer: {
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  chartTitle: {
    fontSize: 24,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  lightText: {
    color: '#007bff',
  },
  darkText: {
    color: '#fff',
  },
  skeletonGraph: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  lightSkeleton: {
    backgroundColor: '#e0e0e0',
  },
  darkSkeleton: {
    backgroundColor: '#333',
  },
  fishHealth: {
    borderRadius: 20,
    width: '90%',
    marginLeft: '5%',
    fontSize: 26,
    textAlign: 'center',
    marginVertical: 10,
    paddingVertical: 20,
  },
  lightFishHealth: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  darkFishHealth: {
    backgroundColor: '#444',
    color: '#fff',
  },
  fishHealthValue: {
    fontWeight: 'bold',
    color: '#ffcc00',
  },
  suggestionsContainer: {
    borderRadius: 20,
    width: '90%',
    marginLeft: '5%',
    padding: 15,
    marginVertical: 10,
  },
  suggestionsHeader: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
  },
  suggestionItem: {
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  lightButton: {
    backgroundColor: '#007bff',
  },
  darkButton: {
    backgroundColor: '#00bcd5',
  },
  deleteButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  lightDeleteButton: {
    backgroundColor: '#ff3300',
  },
  darkDeleteButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = (isDarkMode) =>
  StyleSheet.create({
    inputAndroid: {
      fontSize: 16,
      width: 150,
      borderRadius: 200,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 10,
      color: isDarkMode ? '#fff' : 'black',
      paddingRight: 30,
      backgroundColor: isDarkMode ? '#333' : '#e0f7fa',
      marginHorizontal: 5,
    },
  });
