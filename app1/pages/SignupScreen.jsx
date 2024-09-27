import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import { ImageBackground } from 'react-native';
import background from '../assets/water1.jpeg'
const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(''); // Add this line
  const [username,setusername]=useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    console.log("clicked");
      if (!email || !password) {
        Alert.alert("Please fill in all fields");
        return;
      }
    
      try {
        const response = await axios.post('http://192.168.10.47:8080/signup', {
          email: email,
          password: password,
          username: username // Assuming username is static here; if it's dynamic, add a state for it
        });
    
        // Handle success response
        setMsg(response.data.msg);
        Alert.alert("Registered successfully");
        navigation.navigate('Login'); // Navigate to the desired screen upon success
      } catch (error) {
        console.error('Error:', error.message); // Log the error message
        console.error('Error response:', error.response); // Log the response object if available
        Alert.alert("Signup failed", error.message); // Show an alert with error details
      }
    
    
    // try {
    //   console.log('CLICKED');
    //   const response = await axios.get('http://192.168.100.15:8080/signup');
    //   setMsg(response.data.msg);
    //   navigation.navigate('Analytics');
    // } catch (error) {
    //   console.log('An error occurred');
    //   console.error('Error:', error); // Log the entire error object
    //   console.error('Error response:', error.response); // Log the response object if available
    //   console.error('Error request:', error.request); // Log the request object if no response
    //   console.error('Error message:', error.message);
    // }
  };

  return (
    <ImageBackground
    source={background}
    style={styles.container}
    >
    <View style={styles.con}>
      
      <View style={styles.txthellocontainer}>
        <Text style={styles.txthello}>Create Account</Text>
      </View>
      <View style={styles.usercontainer}>
        <FontAwesome name="user" size={24} color="#9A9A9A" style={styles.usericon} />
        <TextInput 
        style={styles.usertextfield}
         placeholder="Username"
        value={username}
        onChangeText={setusername}
        placeholderTextColor="#9A9A9A" />
      </View>
      <View style={styles.usercontainer}>
        <MaterialCommunityIcons name="email" size={24} color="#9A9A9A" style={styles.usericon} />
        <TextInput
          style={styles.usertextfield}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#9A9A9A"
        />
      </View>
      <View style={styles.usercontainer}>
        <Fontisto name="locked" size={24} color="#9A9A9A" style={styles.usericon} />
        <TextInput
          style={styles.usertextfield}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9A9A9A"
        />
      </View>
      <View style={styles.usercontainer}>
        <FontAwesome name="user" size={24} color="#9A9A9A" style={styles.usericon} />
        <TextInput
         style={styles.usertextfield}
          placeholder="Mobile" placeholderTextColor="#9A9A9A" />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.txtdontcontainer}>
        <Text style={styles.txtDont}>Or sign in with</Text>
      </View>
      <View style={styles.iconcontainer}>
        <Entypo name="facebook" size={24} color="blue" style={styles.signinicon} />
        <Fontisto name="google" size={24} color="orange" style={styles.signinicon} />
        <AntDesign name="twitter" size={24} color="blue" style={styles.signinicon} />
      </View>
      <TouchableOpacity onPress={()=>{      navigation.navigate('Login');
}}>
        <View style={styles.txtdontcontainer1}>
          <Text style={styles.txtDont1}>Already have an account? </Text>
          <Text style={styles.txtcreate1}>Login now</Text>
        </View>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    opacity:1
  },
  con:{
    
     paddingTop:100,
  },
  imgcontainer: {
    height: 120,
  },
  topImage: {
    height: 120,
    width: 360,
    flex: 1,
  },
  txthellocontainer: {
    marginTop: 20,
    width: '100%',
    marginBottom: 20,
  },
  txthello: {
    textAlign: 'center',
    fontSize: 35,
    color: 'purple',
    fontWeight: '500',
  },
  usercontainer: {
    paddingStart: 20,
    alignItems: 'center',
    elevation: 10,
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'white',
    marginHorizontal: 40,
    borderRadius: 20,
    marginVertical: 15,
  },
  usericon: {
    paddingStart: 10,
  },
  usertextfield: {
    paddingStart: 20,
    width: '80%',
    height: 50,
    fontSize: 20,
    color: 'black',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 90,
  },
  button: {
    backgroundColor: 'purple',
    width: 150,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  txtdontcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 40,
    height: 30,
  },
  txtDont: {
    textAlign: 'center',
    fontSize: 14,
    color: 'purple',
    fontWeight: '500',
  },
  iconcontainer: {
    paddingLeft: 60,
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: 40,
    height: 40,
  },
  signinicon: {
    backgroundColor: '#f0f0f0',
    height: 30,
    marginLeft: 10,
    width: 30,
    marginHorizontal: 10,
    elevation: 20,
    borderRadius: 25,
  },
  txtdontcontainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 40,
    height: 30,
  },
  txtDont1: {
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
    fontWeight: '500',
  },
  txtcreate1: {
    textAlign: 'center',
    fontSize: 19,
    color: 'purple',
    fontWeight: '500',
  },
});