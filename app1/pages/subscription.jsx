import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Modal, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Footer from '../components/footer';
export function Subscription(props) {
    const [menuVisible, setMenuVisible] = useState(false);
    const { onPress, title = 'Purchase' } = props;
    const navigation = useNavigation();
    const change_plan = () => {
        navigation.navigate('Subscription');
      };

    // Function to show the alert dialog when "Cancel anytime" is pressed
    const showCancelDialog = () => {
        Alert.alert(
            'Cancel Subscription',
            'Are you sure you want to cancel your subscription?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('No Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => console.log('Yes Pressed'),
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
        <Text style={styles.title}>Subscription</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
          <Entypo name="menu" size={34} color="black" />
        </TouchableOpacity>
      </View>
            {/* Card Box */}
            <View style={styles.cardBox}>
                <View style={styles.card}>
                    {/* Header */}
                    <View style={styles.header1}>
                        <Text style={styles.title1}>
                            Premium
                        </Text>
                        <Text style={styles.subtitle}>
                            $30/month
                        </Text>
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        <View style={{ padding: 20 }}>
                            <FlatList
                                data={[
                                    { key: 'Upto 10 ponds' },
                                    { key: '8 Fish Species' },
                                    { key: 'Vital RT suggestions' },
                                ]}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{ fontSize: 20 }}>{`\u2022 ${item.key}`}</Text>
                                        </View>
                                    );
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
            {/* Purchase Button */}
            <Pressable style={styles.button} onPress={onPress}>
                <Text style={styles.text}>{title}</Text>
            </Pressable>
            {/* Cancel Anytime Button */}
            <Pressable style={styles.button1} onPress={showCancelDialog}>
                <Text style={styles.text1}>Cancel anytime</Text>
            </Pressable>
            <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => setMenuVisible(false)} />
        <View style={styles.menu}>
        <TouchableOpacity
  style={styles.menuItem}
  onPress={() => {
    setMenuVisible(false); // Close the menu
    navigation.navigate('UserDetails'); // Make sure this matches the route name in the Stack.Navigator
  }}
>
  <Text style={styles.menuText}>User Details</Text>
</TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={change_plan}>
            <Text style={styles.menuText}>Change Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {/* Handle Logout */}}>
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.deleteButton]} onPress={() => {/* Handle Delete Account */}}>
            <Text style={styles.menuText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    footerStyle: {
        bottom: 0,
      },
    card: {
        backgroundColor: 'rgb(30, 100, 150)',
        borderRadius: 15,
        padding: 16,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 14,
        width: 300,
        height: 400,
        justifyContent: 'center',
        alignItems: 'Center',
        marginBottom: 20,
        marginTop: 50,
    },
    header1: {
        marginTop: 50,
        marginBottom: 0,
        alignItems: 'Center',
    },
    header: {
        backgroundColor: '#00BFFF',
        flexDirection: 'row',
        paddingHorizontal: 40,
        justifyContent: 'space-between',
    },
    menuButton: {
        justifyContent: 'space-between',
        marginTop: 60,
        paddingRight: 20, // Push menu icon to the right
        marginLeft: 50,
      },
    title: {
        marginLeft: 100,
        marginTop: 60,
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
    },
    title1: {
        marginTop: 50,
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#444444',
        textAlign: 'center',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        width: 200,
        marginTop: 20,
    },
    overlay: {
        flex: 1,
    },
    menu: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 10,
        position: 'absolute',
        top: 550, 
        left: 20,
        right: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      menuItem: {
        paddingVertical: 10,
      },
      menuText: {
        fontSize: 18,
      },
      deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
      },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        color: 'white',
    },
    text1: {
        fontSize: 16,
        color: 'black',
    },
    button1: {
        marginBottom: 170,
        alignItems: 'center',
        paddingVertical: 17,
    },
});

export default Subscription;
