import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // Updated icons
import { useNavigation } from "@react-navigation/native";

export default function Dashboard() {
  const navigation = useNavigation();

  const handleCardPress = (title) => {
    Alert.alert(`You clicked on ${title}`);
  };

return (
    <View style={styles.container}>
        <View style={styles.row}>
            <Card
                title="Income Categories"
                iconSet={MaterialIcons}
                iconName="attach-money" // Updated icon for 'Income'
                onPress={() => navigation.navigate("Categories", { type: "income" })}
            />
            <Card
                title="Expense Categories"
                iconSet={FontAwesome5}
                iconName="wallet" // Updated icon for 'Expense'
                onPress={() => navigation.navigate("Categories", { type: "expense" })}
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
    paddingHorizontal: 10,
  },
  icon: {
    marginBottom: 10,
    color: "#0077BE", // Can be customized further
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
