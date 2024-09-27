import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

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
    <View style={styles.fishItem}>
      <Image source={item.image} style={styles.fishImage} />
      <View style={styles.fishInfo}>
        <Text style={styles.fishName}>{item.name}</Text>
        <Text style={styles.fishStats}>Optimal temperature: {item.stats.temperature}</Text>
        <Text style={styles.fishStats}>Optimal pH: {item.stats.pH}</Text>
        <Text style={styles.fishStats}>Optimal Population: {item.stats.population}</Text>
        <Text style={styles.fishStats}>Optimal DO: {item.stats.DO}</Text>
        <Text style={styles.fishDescription}>{item.description}</Text>
      </View>
    </View>
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
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#1a9a9a',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  listContainer: {
    padding: 20,
  },
  fishItem: {
    flexDirection: 'row',
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  fishImage: {
    width: 100,
    height: 100,
    margin: 10,
  },
  fishInfo: {
    flex: 1,
    padding: 10,
  },
  fishName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005662',
  },
  fishStats: {
    fontSize: 14,
    color: '#000',
    marginTop: 5,
  },
  fishDescription: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
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

export default FishGuidePage;