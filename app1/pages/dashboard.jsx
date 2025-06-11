import React from "react";

import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Import additional icon set
import { useNavigation} from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react"; // Import useState and useEffect

export default function Dashboard() {
  const navigation = useNavigation();
  const [role, setRole] = useState('');  // Handler function for card clicks

  useEffect(() => {
    const fetchRole = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      setRole(storedRole);
    };
    fetchRole();
  }, []);
  

  const handleCardPress = (title) => {
    Alert.alert(`You clicked on ${title}`);
    // You can replace the Alert with navigation code if using React Navigation
    // Example: navigation.navigate('SomeScreen');
  };

  return (
    <View style={styles.container}>
      
      {role == "owner" && (
        <View style={styles.row}>
          <Card
            title="Farms"
            iconSet={MaterialCommunityIcons}
            iconName="barn"
            onPress={() => navigation.navigate('Farms')}
          />
          <Card
            title="Workers"
            iconSet={MaterialCommunityIcons}
            iconName="account-group"
            onPress={() => navigation.navigate('Workers')}
          />
        </View>
      )}
      <View style={styles.row}>
        <Card
          title="Ponds"
          iconSet={MaterialCommunityIcons}
          iconName="fish"
          onPress={() => navigation.navigate('Pond')}
        />
        <Card
          title="Devices"
          iconSet={MaterialCommunityIcons} // Changed icon set
          iconName="devices" // Changed icon name
          onPress={() => navigation.navigate('Devices')}
        />
      </View>

      <View style={styles.row}>
        <Card
          title="Tasks"
          iconSet={MaterialCommunityIcons}
          iconName="clipboard-check"
          onPress={() => navigation.navigate('Tasks')}
        />
        <Card
          title="Fish Stock"
          iconSet={MaterialCommunityIcons}
          iconName="fishbowl"
          onPress={() => navigation.navigate('FishStock')}
        />
      </View>
   
     {role == "owner" && (
       <View style={styles.row}>
         <Card
           title="Farm Setup"
           iconSet={MaterialCommunityIcons}
           iconName="tractor"
           onPress={() => navigation.navigate('FarmSetup')}
         />
         <Card
           title="Reports"
           iconSet={FontAwesome}
           iconName="bar-chart"
           onPress={() => handleCardPress("Reports")}
         />
       </View>
     )}

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
    paddingTop: 40
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
    marginBottom: 10,
    color: "#0077BE",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
