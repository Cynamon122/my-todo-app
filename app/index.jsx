import React, { useEffect } from "react";
import { SafeAreaView, View, Text, FlatList, Pressable, TextInput, Alert } from "react-native";
import Animated, { Layout, SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from "react-native-reanimated";
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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4 bg-white">
        <Text className="text-2xl font-bold text-center mb-4">To-Do List</Text>

        <View className="flex-row mb-4">
          <TextInput
            value={task}
            onChangeText={setTask}
            placeholder="Add a new task..."
            className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
          />
          <Pressable onPress={handleAddTask} className="bg-gray-300 py-2 px-4 rounded-lg">
            <Text className="font-bold text-gray-800">Add</Text>
          </Pressable>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Animated.View
              entering={SlideInRight.springify()}
              exiting={SlideOutRight.springify()}
              layout={Layout.springify()}
              className={`flex-row justify-between items-center p-4 rounded-lg mb-2 border border-gray-300 shadow ${getBackgroundColorClass(item.status)}`}
            >
              <Pressable onPress={() => router.push(`/task/${item.id}`)} className="flex-1">
                <Text className="text-lg text-gray-800">{item.name}</Text>
                <Text className="text-sm text-gray-500">Status: {item.status}</Text>
              </Pressable>
              <Pressable onPress={() => deleteTask(item.id)} className="bg-red-200 py-1 px-2 rounded-lg">
                <Text className="text-black">Delete</Text>
              </Pressable>
            </Animated.View>
          )}
          ListEmptyComponent={<Text className="text-center text-gray-400">No tasks yet!</Text>}
        />

        <Pressable onPress={confirmClearTasks} className="mt-4 bg-red-200 py-3 rounded-lg">
          <Text className="text-center text-red-500 font-bold">Clear All Tasks</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
