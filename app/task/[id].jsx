import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, FlatList, SafeAreaView } from "react-native";
import useStore from "../../store/useStore";

export default function TaskDetails() {
  const { id } = useLocalSearchParams();
  const { tasks, updateTask } = useStore();
  const router = useRouter();

  const task = tasks.find((t) => t.id === id);

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(task?.notes || []);
  const [status, setStatus] = useState(task?.status || "Do zrobienia");
  const [isEditing, setIsEditing] = useState(null);
  const [editedNote, setEditedNote] = useState("");

  useEffect(() => {
    setNotes(task?.notes || []);
    setStatus(task?.status || "Do zrobienia");
  }, [task]);

  const getFormattedDate = () => {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, "0")}.${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${now.getFullYear()} ${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const addNote = () => {
    if (note.trim()) {
      const newNote = { text: note, date: getFormattedDate() };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      updateTask(id, { notes: updatedNotes });
      setNote("");
    }
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    updateTask(id, { notes: updatedNotes });
  };

  const startEditing = (index) => {
    setIsEditing(index);
    setEditedNote(notes[index].text);
  };

  const saveEditedNote = () => {
    const updatedNotes = [...notes];
    updatedNotes[isEditing] = { ...updatedNotes[isEditing], text: editedNote };
    setNotes(updatedNotes);
    updateTask(id, { notes: updatedNotes });
    setIsEditing(null);
    setEditedNote("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5">
        <Text className="text-2xl font-bold text-center mb-4">{task?.name}</Text>

        <Text className="text-lg mb-2">Status:</Text>
        <View className="flex-row mb-4">
          {["Do zrobienia", "W trakcie", "Gotowe"].map((item) => (
            <Pressable
              key={item}
              onPress={() => {
                setStatus(item);
                updateTask(id, { status: item });
              }}
              className={`p-2 mr-2 rounded-lg ${
                item === "Do zrobienia"
                  ? "bg-red-100"
                  : item === "W trakcie"
                  ? "bg-yellow-100"
                  : "bg-green-100"
              } ${status === item ? "border-2 border-purple-600" : "border border-gray-300"}`}
            >
              <Text
                className={`${
                  status === item ? "text-purple-600 font-bold" : "text-gray-800"
                }`}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-lg mb-2">Add a Note:</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Write your note here..."
          className="border border-gray-300 rounded-lg p-2 mb-4"
        />
        <Pressable onPress={addNote} className="bg-gray-300 p-3 rounded-lg mb-4">
          <Text className="text-gray-800 font-bold text-center">Add</Text>
        </Pressable>

        <FlatList
          data={notes}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View className="bg-yellow-50 p-3 rounded-lg mb-3">
              {isEditing === index ? (
                <>
                  <TextInput
                    value={editedNote}
                    onChangeText={setEditedNote}
                    className="border border-gray-300 rounded-lg p-2 mb-2"
                  />
                  <View className="flex-row justify-end">
                    <Pressable onPress={saveEditedNote} className="bg-green-200 p-2 rounded-lg mr-2">
                      <Text className="text-green-800 font-bold">Save</Text>
                    </Pressable>
                    <Pressable onPress={() => setIsEditing(null)} className="bg-gray-300 p-2 rounded-lg">
                      <Text className="text-gray-800 font-bold">Cancel</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Text className="text-sm text-gray-500 mb-1">{item.date}</Text>
                  <Text className="text-gray-800 mb-2">{item.text}</Text>
                  <View className="flex-row justify-end">
                    <Pressable
                      onPress={() => startEditing(index)}
                      className="bg-blue-100 p-2 rounded-lg mr-2"
                    >
                      <Text className="text-blue-800 font-bold">Edit</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteNote(index)}
                      className="bg-red-200 p-2 rounded-lg"
                    >
                      <Text className="text-red-500 font-bold">Delete</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          )}
        />

        <Pressable
          onPress={() => router.back()}
          className="bg-gray-300 p-3 rounded-lg mt-4"
        >
          <Text className="text-gray-800 font-bold text-center">← Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
