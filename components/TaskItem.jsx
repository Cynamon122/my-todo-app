import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function TaskItem({ task, onDelete }) {
  return (
    <View style={styles.container}>
      {/* Tekst zadania */}
      <Text style={styles.text}>{task.name}</Text>

      {/* Przycisk DELETE */}
      <Pressable onPress={() => onDelete(task.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Ustawia elementy w jednej linii
    justifyContent: "space-between", // Oddziela tekst i przycisk
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f9c2ff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    fontSize: 16,
    color: "#333",
    flex: 1, // Zapobiega "przyklejeniu się" tekstu do przycisku
  },
  deleteButton: {
    backgroundColor: "#ff4d4d", // Czerwony przycisk
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
