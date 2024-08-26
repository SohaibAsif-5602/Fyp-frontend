import { StyleSheet, Text, View,FlatList,TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Ionicons from 'react-native-vector-icons/Ionicons';

const sitearray = [
    {
        id:1,
        name:"Rawal Site",
        location:"Rawalpindi",
        status:"Warning",
        role:"Admin"
    },
    {
        id:2,
        name:"Site2",
        location:"Location2",
        status:"Normal",
        role:"Admin"
    },
    {
        id:3,
        name:"Site3",
        location:"Location3",
        status:"Indanger",
        role:"Admin"
    },
    {
        id:4,
        name:"Site4",
        location:"Location4",
        status:"Normal",
        role:"Admin"
    },
    {
        id:5,
        name:"Site5",
        location:"Location5",
        status:"Warning",
        role:"Admin"
    },
    {
        id:6,
        name:"Site6",
        location:"Location6",
        status:"Normal",
        role:"Admin"
    },
    {
        id:7,
        name:"Site7",
        location:"Location7",
        status:"Warning",
        role:"Admin"
    },
    {
        id:8,
        name:"Site8",
        location:"Location8",
        status:"Normal",
        role:"Admin"
    },
    {
        id:9,
        name:"Site9",
        location:"Location9",
        status:"Warning",
        role:"Admin"
    },
    
    
]

const Ponds = () => {

    const handlepressbutton=(item)=>{
        console.log(item.name);
    }

    const getstatuscolor=(status)=>{
        if (status === "Normal") {
            return "green";
        } else if (status === "Warning") {
            return "yellow";
        } else if (status === "Indanger") {
            return "red";
        } else {
            return "black";
        }
    };



    const renderSite=({item})=>(
        <TouchableOpacity onPress={()=>handlepressbutton(item)}>
        <View style={styles.sitecontainer}>
            <View style={styles.innerview}><Text style={styles.sitename}>{item.name}</Text><Text style={styles.siterole}><Text style={styles.listname}>Role:</Text>{item.role}</Text></View>
            <View style={styles.innerview}><Text style={styles.siteloc}><Text style={styles.listname}>Location:</Text>{item.location}</Text><Text style={[styles.sitestatus ,{color:getstatuscolor(item.status)}]}><Text style={styles.listname}>Status:</Text>{item.status}</Text></View>
            
            
            
        </View>
        </TouchableOpacity>
    )
  return (
    <View style={styles.container}>
        <Header/>
        
        <FlatList
        data={sitearray}
        renderItem={renderSite}
        keyExtractor={item=>item.id}
        />
        <Footer style={styles.footstyle}/>
        <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    console.log("Add new site");
                }}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
    </View>
    

  )
}

export default Ponds

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    sitecontainer:{
        backgroundColor: 'white',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sitename:{
        fontSize: 20,
        fontWeight: "bold",
        color: 'blue',

    },
    siteloc:{
        fontSize: 18,
        color: 'purple',

    },
    sitestatus:{
        fontSize: 18,

    },
    siterole:{
        fontSize: 18,
        color: 'purple',
    },
    footstyle:{
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    listname:{color:"black", fontSize:20 },
    innerview:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 80,
        backgroundColor: 'purple',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },

})