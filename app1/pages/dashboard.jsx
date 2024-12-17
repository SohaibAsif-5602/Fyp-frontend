import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";

export default function Dashboard() {
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
          title="Sites & Ponds"
        //   icon={require("./assets/pond.png")}
          onPress={() => handleCardPress("Sites & Ponds")}
        />
        <Card
          title="Transactions"
        //   icon={require("./assets/money.png")}
          onPress={() => handleCardPress("Transactions")}
        />
      </View>
      <View style={styles.row}>
        <Card
          title="Inventory"
        //   icon={require("./assets/inventory.png")}
          onPress={() => handleCardPress("Inventory")}
        />
        <Card
          title="Tasks"
        //   icon={require("./assets/tasks.png")}
          onPress={() => handleCardPress("Tasks")}
        />
      </View>
      <View style={styles.row}>
        <Card
          title="Farm Setup"
        //   icon={require("./assets/setup.png")}
          onPress={() => handleCardPress("Farm Setup")}
        />
        <Card
          title="Reports"
        //   icon={require("./assets/reports.png")}
          onPress={() => handleCardPress("Reports")}
        />
      </View>
    </View>
  );
}

const Card = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={icon} style={styles.icon} />
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
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
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
