import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Import additional icon set
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();
  // Handler function for card clicks
  const handleCardPress = (title) => {
    Alert.alert(`You clicked on ${title}`);
    // You can replace the Alert with navigation code if using React Navigation
    // Example: navigation.navigate('SomeScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Card
          title="Ponds"
          iconSet={MaterialCommunityIcons}
          iconName="water"
          onPress={() => navigation.navigate('Pond')}
        />
        <Card
          title="Transactions"
          iconSet={FontAwesome}
          iconName="money"
          onPress={() => navigation.navigate('Transaction')}
        />
      </View>
      <View style={styles.row}>
        <Card
          title="Inventory"
          iconSet={FontAwesome}
          iconName="archive"
          onPress={() => handleCardPress("Inventory")}
        />
        <Card
          title="Tasks"
          iconSet={FontAwesome}
          iconName="tasks"
          onPress={() => handleCardPress("Tasks")}
        />
      </View>
      <View style={styles.row}>
        <Card
          title="Farm Setup"
          iconSet={FontAwesome}
          iconName="gear"
          onPress={() => navigation.navigate('FarmSetup')}
        />
        <Card
          title="Reports"
          iconSet={FontAwesome}
          iconName="line-chart"
          onPress={() => handleCardPress("Reports")}
        />
      </View>
    </View>
  );
}

const Card = ({ title, iconSet: IconSet, iconName, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <IconSet name={iconName} size={40} color="#333" style={styles.icon} />
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    elevation: 3,
    paddingVertical: 20,
  },
  icon: {
    marginBottom: 10,
    color: "green",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
