import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";

export default function CategoriesPage() {
  const route = useRoute();
  const type = route.params.type;
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const [categoryName, setCategoryName] = useState(""); // Input state
  const [editCategoryData, setEditCategoryData] = useState(null); // Store data for editing

  // Fetch categories on component mount
  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/categories/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const filteredCategories = response.data.filter(category => category.type === type);
      setCategories(filteredCategories);
      console.log(filteredCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [type]);

  // Open modal for adding a new category
  const openAddModal = () => {
    setCategoryName("");
    setEditCategoryData(null);
    setModalVisible(true);
  };

  // Open modal for editing a category
  const openEditModal = (category) => {
    setCategoryName(category.name);
    setEditCategoryData(category);
    setModalVisible(true);
  };

  // Add or Update Category Functionality
  const handleSaveCategory = async () => {
    const token = await AsyncStorage.getItem("token");

    try {
      if (editCategoryData) {
        // Update existing category
        await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/api/categories/${editCategoryData.id}`,
          { name: categoryName, type: editCategoryData.type },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Alert.alert("Success", "Category updated successfully");
      } else {
        // Add new category
        await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/api/categories/`,
          { name: categoryName, type: type },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Alert.alert("Success", "Category added successfully");
      }
      fetchCategories();
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving category:", error);
      Alert.alert("Error", "Failed to save category");
    }
  };

  // Delete Category Function
  const deleteCategory = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL}/api/categories/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", "Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      Alert.alert("Error", "Failed to delete category");
    }
  };

  // Render a single category item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.categoryText}>{item.name}</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <FontAwesome name="edit" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteCategory(item.id)}>
          <MaterialIcons name="delete" size={24} color="red" style={styles.iconSpacing} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
<View style={styles.typeContainer}>
<Text style={styles.typeText}>{type.toUpperCase()} CATEGORIES</Text>
</View>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No Categories Found</Text>}
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <MaterialIcons name="add" size={30} color="white" />
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      {/* Modal for Add/Edit */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editCategoryData ? "Edit Category" : "Add Category"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "green" }]}
                onPress={handleSaveCategory}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "red" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 20 },
    typeContainer: { padding: 10, alignItems: "center", marginVertical: 10 },
    typeText: { fontSize: 18, fontWeight: "bold", color: "#333" },
    card: {
      backgroundColor: "#fff",
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 8,
      elevation: 2,
      padding: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    categoryText: { fontSize: 16, fontWeight: "500" },
    iconContainer: { flexDirection: "row" },
    iconSpacing: { marginLeft: 15 },
    emptyText: { textAlign: "center", marginTop: 20, color: "#888", fontSize: 16 },
    addButton: {
      backgroundColor: "#FFA000",
      borderRadius: 30,
      position: "absolute",
      bottom: 30,
      right: 20,
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      elevation: 5,
    },
    addButtonText: { color: "white", marginLeft: 8, fontSize: 18, fontWeight: "bold" },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
      width: "80%",
      elevation: 5,
    },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
    input: { borderBottomWidth: 1, borderColor: "#ccc", marginBottom: 20, fontSize: 16 },
    modalButtonContainer: { flexDirection: "row", justifyContent: "space-between" },
    modalButton: { padding: 10, borderRadius: 5, width: "45%", alignItems: "center" },
    buttonText: { color: "white", fontWeight: "bold" },
  });
  
