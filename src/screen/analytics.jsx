import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

export default function Analytics() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [ph, setph] = useState([]);
  const [turbidity, setturbidity] = useState([]);

  useEffect(() => {
    const channelID = '2592426';
    const apiKey = '45H5S1N645GKKUCB';
    const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=20`;

    axios.get(url)
      .then(response => {
        const feeds = response.data.feeds;
        setTemperatureData(feeds.map(feed => parseFloat(feed.field1))); // Assuming temperature data is in field1
        setph(feeds.map(feed => parseFloat(feed.field2))); // Assuming humidity data is in field2
        setturbidity(feeds.map(feed => parseFloat(feed.field3))); // Assuming pressure data is in field3
      })
      .catch(error => {
        console.error("Error fetching data from ThingSpeak:", error);
      });
  }, []);

  const renderChart = (data, title) => (
    <View style={{ marginBottom: 30 }}>
      <Text style={{ fontSize: 20, marginTop: 60, textAlign: 'center', fontWeight: 'bold' }}>{title}</Text>
      {data.length > 0 ? (
        <LineChart
          data={{
            labels: data.map((_, index) => index.toString()),
            datasets: [
              {
                data: data,
              },
            ],
          }}
          width={Dimensions.get('window').width}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#e26a01',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 30,
            },
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
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );

  return (
    <ScrollView>
      {renderChart(temperatureData, 'TEMPERATURE CHART')}
      {renderChart(ph, 'PH CHART')}
      {renderChart(turbidity, 'TURBIDITY CHART')}
    </ScrollView>
  );
}
