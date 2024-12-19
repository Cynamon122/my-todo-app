import React, { useEffect } from "react";
import { View, Text, FlatList, Pressable, TextInput, Alert, StyleSheet } from "react-native";
import useStore from "../store/useStore";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const { tasks, loadTasks, deleteTask, clearTasks, addTask, setTask, task } = useStore();

  useEffect(() => {
    loadTasks(); // Ładowanie zadań przy starcie aplikacji
  }, []);

  const confirmClearTasks = () => {
    Alert.alert("Confirm", "Are you sure you want to delete all tasks?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => clearTasks() },
    ]);
  };

  const handleAddTask = () => {
    if (task.trim()) {
      addTask();
      setTask("");
    } else {
      Alert.alert("Error", "Task name cannot be empty.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <View style={styles.row}>
        <TextInput
          value={task}
          onChangeText={setTask}
          placeholder="Add a new task..."
          style={styles.input}
        />
        <Pressable onPress={handleAddTask} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/task/${item.id}`)}
            style={[styles.taskItem, getBackgroundColor(item.status)]}
          >
            <Text style={styles.taskText}>{item.name}</Text>
            <Pressable onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.emptyList}>No tasks yet!</Text>}
      />

      <Pressable onPress={confirmClearTasks} style={styles.clearButton}>
        <Text style={styles.clearButtonText}>Clear All Tasks</Text>
      </Pressable>
    </View>
  );
}

const getBackgroundColor = (status) => {
  switch (status) {
    case "Do zrobienia":
      return { backgroundColor: "#ffe6e6" }; // Jasnoczerwone tło
    case "W trakcie":
      return { backgroundColor: "#fff4cc" }; // Jasnożółte tło
    case "Gotowe":
      return { backgroundColor: "#ccffcc" }; // Jasnozielone tło
    default:
      return { backgroundColor: "#f9f9f9" };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#ddd",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    fontWeight: "bold",
    color: "#333",
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  taskText: {
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "#ffcccc",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#ff0000",
    fontWeight: "bold",
  },
  emptyList: {
    textAlign: "center",
    color: "#aaa",
  },
  clearButton: {
    marginTop: 16,
    backgroundColor: "#ffcccc",
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    textAlign: "center",
    color: "#ff0000",
    fontWeight: "bold",
  },
});

