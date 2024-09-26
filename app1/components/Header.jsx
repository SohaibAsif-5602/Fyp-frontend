import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo';

const Header = ({data}) => {
  return (
    <View style={styles.Headercontainer}>
        <Text style={styles.HeaderText}>{data}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    Headercontainer:{
        flexDirection: 'row',
        marginTop: 0,
        justifyContent: 'center',
        padding: 10,
        paddingTop: 25,
        height: 70,
        backgroundColor: '#9a9a9a',
        borderBottomWidth: 1,
        borderBottomColor: '#d8d8d8'
    },
    HeaderText:{
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: 'purple'
    },
  

})
