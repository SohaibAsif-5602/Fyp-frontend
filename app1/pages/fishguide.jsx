import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DarkModeContext } from '../contexts/DarkModeContext'; // Import DarkModeContext

const { width, height } = Dimensions.get('window');

const fishData = [
  {
    id: '1',
    name: 'Catla',
    image: require('../assets/Fish PICS/Catla.jpg'),
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
    image: require('../assets/Fish PICS/Catfish.jpg'),
    stats: {
      temperature: '22 - 28°C',
      pH: '6.5 - 8.0',
      population: '100 - 200 individuals',
      DO: '2 - 5 mg/L',
    },
    description: 'Hardy species, tolerates low oxygen, often monocultured or with tilapia.',
  },
  {
    id: '3',
    name: 'Cod',
    image: require('../assets/Fish PICS/Cod.jpg'),
    stats: {
      temperature: '2 - 10°C',
      pH: '7.0 - 8.5',
      population: 'Varies',
      DO: '5 - 7 mg/L',
    },
    description: 'Cold-water fish, farmed in sea cages, requires high oxygen levels.',
  },
  {
    id: '4',
    name: 'Grass Carp',
    image: require('../assets/Fish PICS/GrassCarp.jpg'),
    stats: {
      temperature: '20 - 30°C',
      pH: '6.5 - 8.5',
      population: '50 - 150 individuals',
      DO: '3 - 5 mg/L',
    },
    description: 'Herbivorous, controls aquatic vegetation, polycultured with Catla and Rohu.',
  },
  {
    id: '5',
    name: 'Milkfish',
    image: require('../assets/Fish PICS/Milkfish.jpg'),
    stats: {
      temperature: '26 - 30°C',
      pH: '7.0 - 8.5',
      population: '50 - 200 individuals',
      DO: '3 - 6 mg/L',
    },
    description: 'Popular in brackish water ponds, feeds on algae and small invertebrates.',
  },
  {
    id: '6',
    name: 'Salmon',
    image: require('../assets/Fish PICS/Salmon.jpg'),
    stats: {
      temperature: '8 - 14°C',
      pH: '6.5 - 8.0',
      population: 'Varies',
      DO: '6 - 8 mg/L',
    },
    description: 'Cold-water species, farmed in sea pens, requires high-quality, protein-rich feed.',
  },
  {
    id: '7',
    name: 'Tilapia',
    image: require('../assets/Fish PICS/Tilapia.jpg'),
    stats: {
      temperature: '24 - 30°C',
      pH: '6.0 - 9.0',
      population: '100 - 300 individuals',
      DO: '3 - 6 mg/L',
    },
    description: 'Fast-growing, tolerates various conditions, ideal for polyculture with catfish.',
  },
  {
    id: '8',
    name: 'Trout',
    image: require('../assets/Fish PICS/Trout.jpg'),
    stats: {
      temperature: '10 - 16°C',
      pH: '6.5 - 8.0',
      population: '100 - 200 individuals',
      DO: '7 - 9 mg/L',
    },
    description: 'Cold-water fish, prefers flowing water, grown in raceways or recirculating systems.',
  },
];


const Logo = () => (
  <Image
    source={require('../assets/fish_logo.png')}
    style={styles.logo}
    resizeMode="contain"
  />
);

const FishGuidePage = () => {
  const { isDarkMode } = useContext(DarkModeContext); // Access dark mode state

  const renderFishItem = ({ item }) => (
    <View style={[styles.fishItem, isDarkMode ? styles.darkItem : styles.lightItem]}>
      {/* Top banner for fish name */}
      <View style={[styles.topBanner, isDarkMode ? styles.darkBanner : styles.lightBanner]}>
        <Text style={styles.fishName}>{item.name}</Text>
      </View>

      {/* Fish image and stats */}
      <Image source={item.image} style={styles.fishImage} />
      <View style={styles.fishInfo}>
        <Text style={[styles.fishStats, isDarkMode ? styles.darkText : styles.lightText]}>
          Temperature: {item.stats.temperature}
        </Text>
        <Text style={[styles.fishStats, isDarkMode ? styles.darkText : styles.lightText]}>
          pH: {item.stats.pH}
        </Text>
        <Text style={[styles.fishStats, isDarkMode ? styles.darkText : styles.lightText]}>
          Population: {item.stats.population}
        </Text>
        <Text style={[styles.fishStats, isDarkMode ? styles.darkText : styles.lightText]}>
          DO: {item.stats.DO}
        </Text>
      </View>

      {/* Bottom banner for description */}
      <View style={[styles.bottomBanner, isDarkMode ? styles.darkBanner : styles.lightBanner]}>
        <Text style={styles.fishDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={isDarkMode ? ['#000', '#121212'] : ['#e0f7fa', '#ffffff']}
      style={styles.container}
    >
      <FlatList
        data={fishData}
        renderItem={renderFishItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <Logo />
          </View>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: height * 0.2,
  },
  fishItem: {
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 30,
    width: width * 0.9,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  lightItem: {
    backgroundColor: '#ffffff',
  },
  darkItem: {
    backgroundColor: '#2c2c2c',
  },
  topBanner: {
    width: '100%',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  lightBanner: {
    backgroundColor: '#00bcd5',
  },
  darkBanner: {
    backgroundColor: '#444',
  },
  fishName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  fishImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 15,
  },
  fishInfo: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  fishStats: {
    fontSize: 16,
    marginVertical: 2,
  },
  lightText: {
    color: '#00796B',
  },
  darkText: {
    color: '#b0c4de',
  },
  bottomBanner: {
    width: '100%',
    paddingVertical: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  fishDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  footerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export default FishGuidePage;
