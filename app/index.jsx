import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  Layout,
  SlideInRight,
  SlideOutRight
} from "react-native-reanimated";
import useStore from "../store/useStore";

export default function Home() {
  // ---------- STANY I FUNKCJE ZE STORE ----------
  const { tasks, loadTasks, deleteTask, clearTasks, addTask, setTask, task } = useStore(); // Task management
  const router = useRouter(); // Nawigacja

  useEffect(() => {
    loadTasks(); // Ładowanie zadań przy starcie aplikacji
  }, []);

  // ---------- FUNKCJE POMOCNICZE ----------

  // Potwierdzenie usunięcia wszystkich zadań
  const confirmClearTasks = () => {
    Alert.alert("Confirm", "Are you sure you want to delete all tasks?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => clearTasks() },
    ]);
  };

  // Dodanie nowego zadania
  const handleAddTask = () => {
    if (task.trim()) {
      addTask();
      setTask("");
    } else {
      Alert.alert("Error", "Task name cannot be empty.");
    }
  };

  // Kolor tła w zależności od statusu zadania
  const getBackgroundColorClass = (status) => {
    switch (status) {
      case "Do zrobienia":
        return "bg-red-100";
      case "W trakcie":
        return "bg-yellow-100";
      case "Gotowe":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  // ---------- RENDEROWANIE ----------
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4 bg-white">
        {/* Nagłówek */}
        <Text className="text-2xl font-bold text-center mb-4">To-Do List</Text>

        {/* Pole dodawania nowego zadania */}
        <View className="flex-row mb-4">
          <TextInput
            value={task}
            onChangeText={setTask}
            placeholder="Dodaj nowe zadanie..."
            className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
          />
          <Pressable onPress={handleAddTask} className="bg-gray-300 py-2 px-4 rounded-lg">
            <Text className="font-bold text-gray-800">Dodaj</Text>
          </Pressable>
        </View>

        {/* Lista zadań */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Animated.View
              entering={SlideInRight.springify()} // Animacja wejścia
              exiting={SlideOutRight.springify()} // Animacja wyjścia
              layout={Layout.springify()} // Płynna zmiana układu
              className={`flex-row justify-between items-center p-4 rounded-lg mb-2 border border-gray-300 shadow ${getBackgroundColorClass(item.status)}`}
            >
              {/* Szczegóły zadania */}
              <Pressable onPress={() => router.push(`/task/${item.id}`)} className="flex-1">
                <Text className="text-lg text-gray-800">{item.name}</Text>
                <Text className="text-sm text-gray-500">Status: {item.status}</Text>
              </Pressable>

              {/* Usuń zadanie */}
              <Pressable onPress={() => deleteTask(item.id)} className="bg-red-200 py-1 px-2 rounded-lg">
                <Text className="text-black">Usuń</Text>
              </Pressable>
            </Animated.View>
          )}
          ListEmptyComponent={<Text className="text-center text-gray-400">Brak zadań!</Text>}
        />

        {/* Usuń wszystkie zadania */}
        <Pressable onPress={confirmClearTasks} className="mt-4 bg-red-200 py-3 rounded-lg">
          <Text className="text-center text-red-500 font-bold">Usuń wszystkie zadania</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}