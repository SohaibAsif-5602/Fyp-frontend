import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';

export default function Analytics() {
  const navigation = useNavigation();
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
    const channelID = '2592426';
    const apiKey = '45H5S1N645GKKUCB';
    const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=100`;

    axios.get(url)
      .then(response => {
        const feeds = response.data.feeds;
        const formattedDates = feeds.map(feed => feed.created_at.split('T')[0]);
        setDates([...new Set(formattedDates)]);
        setTemperatureData(feeds.map(feed => ({ date: feed.created_at.split('T')[0], value: parseFloat(feed.field1) })));
        setPhData(feeds.map(feed => ({ date: feed.created_at.split('T')[0], value: parseFloat(feed.field2) })));
        setTurbidityData(feeds.map(feed => ({ date: feed.created_at.split('T')[0], value: parseFloat(feed.field3) })));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data from ThingSpeak:', error);
        setLoading(false);
      });
  }, []);

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
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        {loading ? (
          <View style={styles.skeletonGraph}>
            <ActivityIndicator size="large" color="#007bff" />
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
                backgroundColor: '#007bff',
                backgroundGradientFrom: '#6ec1e4',
                backgroundGradientTo: '#007bff',
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
    <View style={styles.container}>
      <ScrollView>
        {/* Picker container to hold both pickers in a row */}
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedChart(value)}
            items={[
              { label: 'Temperature', value: 'Temperature' },
              { label: 'pH', value: 'pH' },
              { label: 'Turbidity', value: 'Turbidity' },
            ]}
            style={pickerSelectStyles}
            placeholder={{ label: 'Select Chart', value: 'Temperature' }}
          />
          <RNPickerSelect
            onValueChange={(value) => setSelectedDate(value)}
            items={[
              { label: 'All Dates', value: 'All Dates' },
              ...dates.map(date => ({ label: date, value: date })),
            ]}
            style={pickerSelectStyles}
            placeholder={{ label: 'Select Date', value: 'All Dates' }}
          />
        </View>

        {/* Render the chart container */}
        {selectedChart === 'Temperature' && renderChart(filteredData, 'TEMPERATURE CHART')}
        {selectedChart === 'pH' && renderChart(filteredData, 'PH CHART')}
        {selectedChart === 'Turbidity' && renderChart(filteredData, 'TURBIDITY CHART')}

        <Text style={styles.fishHealth}>
          Fish Health - <Text style={styles.fishHealthValue}>{fishHealth}%</Text> Okay
        </Text>

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsHeader}>Suggestions</Text>
          {suggestions.map((suggestion, index) => (
            <Text key={index} style={styles.suggestionItem}>• {suggestion}</Text>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AlertHistory')}>
            <Text style={styles.buttonText}>View Alerts History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => console.log('Delete Pond')}>
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
    backgroundColor: '#f0f8ff',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
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
  chartTitle: {
    fontSize: 24,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#007bff',
  },
  chart: {
    marginTop: 20,
    borderRadius: 16,
  },
  skeletonGraph: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
  },
  fishHealth: {
    borderRadius: 20,
    width: '90%',
    marginLeft: '5%',
    backgroundColor: '#007bff',
    fontSize: 26,
    textAlign: 'center',
    marginVertical: 10,
    paddingVertical: 20,
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
    backgroundColor: '#e6ffe6',
    padding: 15,
    marginVertical: 10,
  },
  suggestionsHeader: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
    color: '#2c3e50',
  },
  suggestionItem: {
    fontSize: 18,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  deleteButton: {
    backgroundColor: '#ff3300',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    width:150,
    borderRadius:200,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#e0f7fa',
    marginHorizontal: 5,
  },
});