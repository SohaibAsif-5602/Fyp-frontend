import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";

const Fishbot = () => {
  const [parameters, setParameters] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "AIzaSyCKoCo3EgjOVfhYM-wpPFl9KIlCPIPB0-I";

  useEffect(() => {
    const fetchMonitoringData = async () => {
      setLoading(true);
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = "Explain fish monitoring and its importance.";
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const data = [
        { key: "1", parameter: "Machiro Bot", value: text },
      ];
      setParameters(data);
      setLoading(false);

      showMessage({
        message: "Fish Monitoring Data Loaded",
        description: "Fetched explanation successfully.",
        type: "success",
        icon: "success",
        duration: 2000,
        style: { backgroundColor: "#0077BE", color: "white" },
      });
    };

    fetchMonitoringData();
  }, []);

  const askBot = async () => {
    if (!userInput) {
      showMessage({
        message: "Error",
        description: "Please enter a question.",
        type: "danger",
        icon: "danger",
      });
      return;
    }

    setLoading(true);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = userInput;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const newParameters = [
      { key: Date.now().toString(), parameter: "User Question", value: userInput },
      { key: (Date.now() + 1).toString(), parameter: "Machiro Bot", value: text},
    ];

    setParameters([...parameters, ...newParameters]);
    setUserInput("");
    setLoading(false);

    showMessage({
      message: "Response Received",
      description: "The bot has answered your question.",
      type: "success",
      icon: "success",
    });
  };

  const renderParameter = ({ item }) => (
    <View style={styles.parameterContainer}>
      <Text style={styles.parameterText}>{item.parameter}:</Text>
      <Text style={styles.valueText}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Machiro Bot</Text>

      {loading && <Text style={styles.loadingText}>Loading data...</Text>}
      <FlashMessage position="top" />
      <FlatList
        data={parameters}
        renderItem={renderParameter}
        keyExtractor={(item) => item.key}
        style={styles.list}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ask the bot about fish"
          onChangeText={setUserInput}
          value={userInput}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={askBot}>
          <Text style={styles.buttonText}>Ask</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#0077BE",
  },
  list: {
    marginBottom: 20,
    width: "100%",
  },
  parameterContainer: {
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#e0f7fa",
    marginVertical: 10,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
  },
  parameterText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#0077BE",
  },
  valueText: {
    textAlign: "left",
    fontSize: 16,
    color: "#004d40",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    width: "90%",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0077BE",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#757575",
  },
});

export default Fishbot;
