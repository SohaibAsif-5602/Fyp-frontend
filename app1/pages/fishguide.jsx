import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const { width } = Dimensions.get('window');

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
    name: 'Silver Carp',
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
    name: 'Pangas',
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
    name: 'Rahu',
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
    name: 'Koi',
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
    name: 'Tilapia',
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
    name: 'Sing',
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
    name: 'Carp',
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
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Light grey for a subtle background
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#00BCD4', // Teal for a fresh look
    borderBottomLeftRadius: 30, // Smooth rounded edges
    borderBottomRightRadius: 30,
    elevation: 5, // Shadow effect for header
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1.2, // Slight spacing for elegance
  },
  subheading: {
    fontSize: 18,
    color: '#E0F7FA',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40, // Better spacing
    fontStyle: 'italic', // Subtle emphasis
  },
  listContainer: {
    padding: 20,
  },
  fishItem: {
    flexDirection: 'row',
    marginTop: 20,
    borderRadius: 20, // Smooth rounded corners
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF', // White for contrast
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  fishImage: {
    width: width * 0.4,
    height: width * 0.4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  fishInfo: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    backgroundColor: '#FAFAFA', // Slight contrast
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  fishName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796B', // Complementary teal
    marginBottom: 10,
    textTransform: 'uppercase', // Adds emphasis
  },
  statsContainer: {
    backgroundColor: '#E0F7FA', // Light teal
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2, // Light shadow for depth
  },
  fishStats: {
    fontSize: 16,
    color: '#004D40',
    marginTop: 5,
  },
  fishDescription: {
    fontSize: 16,
    color: '#616161', // Neutral grey for description
    marginTop: 10,
    lineHeight: 22, // Improves readability
  },
});


export default FishGuidePage;
