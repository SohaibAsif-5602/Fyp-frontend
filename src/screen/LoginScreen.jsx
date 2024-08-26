import { Image, StyleSheet, Text, View,TextInput,TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

const LoginScreen = () => {

    const navigation = useNavigation();
    const handleRegister =()=>{
        navigation.navigate("Signup");
    }
  return (
    <View style={styles.container}>
       <View style={styles.imgcontainer}><Image source={require("../assets/topVector.png")} style={styles.topImage}/></View>
        <View style={styles.txthellocontainer}><Text style={styles.txthello}>Hello</Text></View>
        <View style={styles.txtsignincontainer}><Text style={styles.txtsignin}>Sign in to your account</Text></View>
        <View style={styles.usercontainer}>
            <MaterialCommunityIcons name={"email"} size={24} color={"#9A9A9A"} style={styles.usericon}/>
            <TextInput style={styles.usertextfield} placeholder="Email" placeholderTextColor={"#9A9A9A"}/>

        </View>
        <View style={styles.usercontainer}>
            <Fontisto name={"locked"} size={24} color={"#9A9A9A"} style={styles.usericon}/>
            <TextInput style={styles.usertextfield} placeholder="Password" secureTextEntry placeholderTextColor={"#9A9A9A"}/>

        </View>
        <View style={styles.forgottxtcontainer}><Text style={styles.txtforgot}>Forgot your password?</Text></View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleRegister}><View style={styles.txtdontcontainer}><Text style={styles.txtDont}>Don't have an account? </Text><Text style={styles.txtcreate}>Create now</Text></View></TouchableOpacity>


    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({

    container:{
        backgroundColor: 'white',
        flex: 1,
    },
    imgcontainer:{
        height:120
    },
    topImage:{
        height: 120,
        width: 360,
        flex: 1,
    },
    txthellocontainer:{
        width: "100%",
    },
    txthello:{
        textAlign: 'center',
        fontSize: 65,
        color: 'purple',
        fontWeight: '500',
    },
    txtsignincontainer:{
        width: "100%",
        height: 40,
        marginBottom: 20,
    },
    txtsignin:{
        paddingTop: 10,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        fontWeight: '500',
    },
    usercontainer:{
        paddingStart: 20,
        alignItems: 'center',
        elevation: 10,
        flexDirection: 'row',
        height: 50,
        backgroundColor: 'white',
        marginHorizontal: 40,
        borderRadius: 20,
        marginVertical: 20,
        

    },
    usericon:{
        paddingStart: 10,
    },
    usertextfield:{
        paddingStart: 20,
        width: "80%",
        height: 50,
        fontSize: 20,
        color: 'black',
    },
    forgottxtcontainer:{
        marginTop: 10,
        marginHorizontal: 40,
        height: 30,
        
    },
    txtforgot:{
        textAlign: 'right',
        fontSize: 17,
        color: 'purple',
        fontWeight: '500',
    },
    buttonContainer:{
        alignItems: 'center',
        marginTop: 20,
        marginLeft: 90,
    },
    button:{
        backgroundColor: 'purple',
        width: 150,
        height: 50,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText:{
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
    },
    txtdontcontainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
        marginHorizontal: 40,
        height: 30,
    },
    txtDont:{
        
        textAlign: 'center',
        fontSize: 14,
        color: 'black',
        fontWeight: '500',
    },
    txtcreate:{
        textAlign: 'center',
        fontSize: 14,
        color: 'purple',
        fontWeight: '500',
    },



});