import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const fishData = [
  {
    id: '1',
    name: 'Catla',
    image: require('../assets/Fish_PICS/Catla.jpg'),
    stats: {
      temperature: '25 - 32°C',
      pH: '6.5 - 8.0',
      population: '50 - 100 individuals',
      DO: '4 - 5 mg/L',
    },
    description: 'Freshwater fish, thrives in warm waters, polycultured with Rohu and Mrigal.',
  },
  {
    id: '2',
    name: 'Catfish',
    image: require('../assets/Fish_PICS/Catfish.jpg'),
    stats: {
      temperature: '22 - 28°C',
      pH: '6.5 - 8.0',
      population: '100 - 200 individuals',
      DO: '2 - 5 mg/L',
    },
    description: 'Hardy species, tolerates low oxygen, often monocultured or with tilapia.',
  },
  // Add other fish data...
];

const Logo = () => (
  <Image
    source={require('../assets/fish_logo.png')}
    style={styles.logo}
    resizeMode="contain"
  />
);

const FishGuidePage = () => {
  const renderFishItem = ({ item }) => (
    <LinearGradient
      colors={['#E0F7FA', '#B2EBF2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.fishItem}
    >
      <Image source={item.image} style={styles.fishImage} />
      <View style={styles.fishInfo}>
        <Text style={styles.fishName}>{item.name}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.fishStats}>Temperature: {item.stats.temperature}</Text>
          <Text style={styles.fishStats}>pH: {item.stats.pH}</Text>
          <Text style={styles.fishStats}>Population: {item.stats.population}</Text>
          <Text style={styles.fishStats}>DO: {item.stats.DO}</Text>
        </View>
        <Text style={styles.fishDescription}>{item.description}</Text>
      </View>
    </LinearGradient>
  );

  return (
    <FlatList
      data={fishData}
      renderItem={renderFishItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Aqua Guide</Text>
          <Text style={styles.subheading}>
            A comprehensive guide to commonly farmed fish species in Pakistan
          </Text>
        </View>
      }
      ListFooterComponent={
        <View style={styles.footerContainer}>
          <Logo />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#1A9A9A',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subheading: {
    fontSize: 18,
    color: '#E0F7FA',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 30,
  },
  listContainer: {
    padding: 20,
  },
  fishItem: {
    flexDirection: 'row',
    backgroundColor: '#E0F7FA',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fishImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  fishInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  fishName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 10,
  },
  statsContainer: {
    backgroundColor: '#B2EBF2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  fishStats: {
    fontSize: 16,
    color: '#004D40',
    marginTop: 5,
  },
  fishDescription: {
    fontSize: 16,
    color: '#004D40',
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
});

export default FishGuidePage;