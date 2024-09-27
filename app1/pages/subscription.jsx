// Subscription.js
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { DarkModeContext } from '../contexts/DarkModeContext';
import Header from '../components/Header';
import Footer from '../components/footer';

export function Subscription(props) {
  const { onPress, title = 'Purchase' } = props;
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkModeContext);

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
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Subscription</Text>
      </View>
      {/* Card Box */}
      <View style={styles.cardBox}>
        <View style={[styles.card, isDarkMode && styles.darkCard]}>
          {/* Header */}
          <View style={styles.header1}>
            <Text style={[styles.title1, isDarkMode && styles.darkTitle1]}>Premium</Text>
            <Text style={[styles.subtitle, isDarkMode && styles.darkSubtitle]}>$30/month</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={{ padding: 20 }}>
              <FlatList
                data={[
                  { key: 'Up to 10 ponds' },
                  { key: '8 Fish Species' },
                  { key: 'Vital RT suggestions' },
                ]}
                renderItem={({ item }) => {
                  return (
                    <View style={{ marginBottom: 10 }}>
                      <Text style={[styles.listItemText, isDarkMode && styles.darkText]}>
                        {`\u2022 ${item.key}`}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
      </View>
      {/* Purchase Button */}
      <Pressable style={[styles.button, isDarkMode && styles.darkButton]} onPress={onPress}>
        <Text style={[styles.buttonText, isDarkMode && styles.darkButtonText]}>{title}</Text>
      </Pressable>
      {/* Cancel Anytime Button */}
      <Pressable style={styles.button1} onPress={showCancelDialog}>
        <Text style={[styles.text1, isDarkMode && styles.darkText1]}>Cancel anytime</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
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
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  darkCard: {
    backgroundColor: '#333',
  },
  header1: {
    marginTop: 50,
    marginBottom: 0,
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#00bcd4',
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
  },
  darkHeader: {
    backgroundColor: '#000',
  },
  title: {
    fontSize: 30,
    color: '#fff', // White title text
    fontWeight: 'bold',
  },
  darkTitle: {
    color: '#fff',
  },
  title1: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
  },
  darkTitle1: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#333',
  },
  darkSubtitle: {
    color: '#fff',
  },
  content: {
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 20,
    color: '#000',
  },
  darkText: {
    color: '#fff',
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
  darkButton: {
    backgroundColor: '#1a1a1a',
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    color: 'white',
  },
  darkButtonText: {
    color: '#fff',
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
  text1: {
    fontSize: 16,
    color: 'black',
  },
  darkText1: {
    color: '#fff',
  },
  button1: {
    marginBottom: 170,
    alignItems: 'center',
    paddingVertical: 17,
  },
});

export default Subscription;
