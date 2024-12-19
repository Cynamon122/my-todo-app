import React from "react";
import { View, Text, Pressable } from "react-native";

export default function TaskItem({ task, onDelete }) {
  return (
    <View className="flex-row items-center justify-between bg-yellow-100 p-3 rounded mb-2 border border-gray-300">
      <Text className="text-lg font-medium">{task.name}</Text>
      <Pressable onPress={() => onDelete(task.id)} className="bg-red-200 px-3 py-1 rounded">
        <Text className="text-red-800 font-bold">Delete</Text>
      </Pressable>
    </View>
  );
}
