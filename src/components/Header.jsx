import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo';

const Header = () => {
  return (
    <View style={styles.Headercontainer}>
        <Entypo name={"menu"} style={styles.menuicon}/>
        <Text style={styles.HeaderText}>Header</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    Headercontainer:{
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#9a9a9a',
        borderBottomWidth: 1,
        borderBottomColor: '#d8d8d8'
    },
    HeaderText:{
        textAlign: 'center',
        alignSelf: 'center',
        marginLeft: 100,
        fontSize: 24,
        fontWeight: 'bold',
        color: 'purple'
    },
    menuicon:{
        fontSize: 35,
        color: 'purple'
    }
})