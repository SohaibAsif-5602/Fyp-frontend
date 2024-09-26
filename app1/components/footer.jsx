import { View, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff' }}>
      <TouchableOpacity onPress={() => navigation.navigate('Analytics')}>
        <Ionicons name="analytics" size={24} color="black" />
        <Text>Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Ponds')}>
        <FontAwesome5 name="water" size={24} color="black" />
        <Text>Ponds</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <AntDesign name="profile" size={24} color="black" />
        <Text>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
        <AntDesign name="setting" size={24} color="black" />
        <Text>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
