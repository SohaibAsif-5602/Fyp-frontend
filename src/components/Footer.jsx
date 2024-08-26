// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Entypo from 'react-native-vector-icons/Entypo';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// const Footer = () => {
//   return (
//     <View style={styles.Footercontainer}>
//         <Entypo name={"home"} style={styles.homeicon}/>
//         <FontAwesome name={"list"} style={styles.listicon}/>
//         <FontAwesome5 name={"house-user"} style={styles.usericon}/>

//     </View>
//   )
// }

// export default Footer

// const styles = StyleSheet.create({
//     Footercontainer:{
//         flexDirection: 'row',
//         padding: 10,
//         height: 55,
//         backgroundColor: '#9a9a9a',
//         borderTopWidth: 1,
//         borderTopColor: '#d8d8d8',
//         justifyContent: 'space-around',
        
//         alignItems: 'center', 
//     },
//     homeicon:{
//         fontSize: 27,
//         color: 'purple'
//     },
//     listicon:{
//         fontSize: 27,
//         color: 'purple'
//     },
//     usericon:{
//         fontSize: 27,
//         color: 'purple'
//     }
// })






import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'react-native-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Footer() {
  return (
    <Tabs screenOptions={{headerShown: false}}>
        <Tabs.Screen name='Analytics' 
        options={{
          tabBarLabel: 'Analytics',
          tabBarIcon: ({ color }) => <Ionicons name="analytics" size={24} color={color} />
        }}
        
        />
        <Tabs.Screen name='Ponds' 
        options={{
          tabBarLabel: 'Ponds',
          tabBarIcon: ({ color }) => <FontAwesome5 name="aater" size={24} color={color} />
        }}
        />
        <Tabs.Screen name='Profile' 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <AntDesign name="profile" size={24} color={color} />
        }}
        />
        <Tabs.Screen name='Settings' 
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <AntDesign name="setting" size={24} color={color} />
        }}
        />
    </Tabs>
  )
}