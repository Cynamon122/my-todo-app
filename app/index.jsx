import React, { useEffect } from "react";
import { View, TextInput, FlatList, Pressable, Text, StyleSheet } from "react-native";
import useStore from "../store/useStore";
import TaskItem from "../components/TaskItem";

export default function Home() {
  const { task, tasks, setTask, addTask, deleteTask, loadTasks, clearTasks } = useStore();

  // Wczytanie zadań przy starcie aplikacji
  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>

      <TextInput
        placeholder="Add a task..."
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />

      <Pressable onPress={addTask} style={styles.button}>
        <Text style={styles.buttonText}>Add Task</Text>
      </Pressable>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem task={item} onDelete={deleteTask} />}
        style={styles.list}
      />

      {/* Opcjonalny przycisk do wyczyszczenia SecureStore */}
      <Pressable onPress={clearTasks} style={styles.clearButton}>
        <Text style={styles.buttonText}>Clear Tasks</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6a0dad",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  clearButton: {
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  list: {
    marginTop: 10,
  },
});
