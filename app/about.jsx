import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, Pressable } from "react-native";
import useStore from "../store/useStore";

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const { tasks, updateTask } = useStore();
  const router = useRouter();

  const task = tasks.find((t) => t.id === id);

  const [note, setNote] = useState(task?.note || "");
  const [status, setStatus] = useState(task?.status || "Do zrobienia");

  const handleSave = () => {
    updateTask(id, { note, status });
    router.back();
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Pressable onPress={() => router.back()} className="mb-4">
        <Text className="text-lg text-purple-600">← Back</Text>
      </Pressable>

      <Text className="text-2xl font-bold mb-4">{task?.name}</Text>

      <Text className="text-lg mb-2">Note:</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Add a note..."
        className="border border-gray-300 rounded-lg p-2 mb-4"
        multiline
      />

      <Text className="text-lg mb-2">Status:</Text>
      <View className="flex-row mt-2">
        {["Do zrobienia", "W trakcie", "Gotowe"].map((item) => (
          <Pressable
            key={item}
            onPress={() => setStatus(item)}
            className={`p-2 mr-2 border rounded-lg ${
              status === item ? "bg-purple-600" : "border-gray-300"
            }`}
          >
            <Text className={`${status === item ? "text-white" : "text-gray-800"}`}>{item}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={handleSave} className="bg-purple-600 p-3 rounded-lg mt-4">
        <Text className="text-white text-center text-lg">Save</Text>
      </Pressable>
    </View>
  );
}
