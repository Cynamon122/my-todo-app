import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, FlatList, SafeAreaView } from "react-native";
import useStore from "../../store/useStore";
import "../../global.css"; // Upewnij się, że ścieżka jest poprawna

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
      .padStart(2, "0")}.${now.getFullYear()} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
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
        {/* Tytuł zadania */}
        <Text className="text-2xl font-bold text-center mb-3">{task?.name}</Text>

        {/* Status */}
        <Text className="text-base mt-2">Status:</Text>
        <View className="flex-row mt-2">
          {/* Przyciski statusów z przypisanymi stałymi kolorami */}
          <Pressable
            onPress={() => {
              setStatus("Do zrobienia");
              updateTask(id, { status: "Do zrobienia" });
              console.log("Status changed to: Do zrobienia");
            }}
            className={`px-3 py-2 mr-2 rounded border ${
              status === "Do zrobienia" ? "border-2 border-grey-300" : "border-gray-300"
            } bg-red-200`}
          >
            <Text className="text-gray-800">Do zrobienia</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setStatus("W trakcie");
              updateTask(id, { status: "W trakcie" });
              console.log("Status changed to: W trakcie");
            }}
            className={`px-3 py-2 mr-2 rounded border ${
              status === "W trakcie" ? "border-2 border-grey-300" : "border-gray-300"
            } bg-yellow-200`}
          >
            <Text className="text-gray-800">W trakcie</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setStatus("Gotowe");
              updateTask(id, { status: "Gotowe" });
              console.log("Status changed to: Gotowe");
            }}
            className={`px-3 py-2 mr-2 rounded border ${
              status === "Gotowe" ? "border-2 border-grey-300-700" : "border-gray-300"
            } bg-green-200`}
          >
            <Text className="text-gray-800">Gotowe</Text>
          </Pressable>
        </View>

        {/* Dodawanie notatki */}
        <Text className="text-base mt-4">Add a Note:</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Write your note here..."
          className="border border-gray-300 rounded px-3 py-2 mt-1"
        />
        <Pressable
          onPress={addNote}
          className="bg-gray-300 py-2 px-3 rounded items-center mt-3"
        >
          <Text className="text-gray-800 text-base">Add</Text>
        </Pressable>

        {/* Lista notatek */}
        <FlatList
          data={notes}
          keyExtractor={(_, index) => index.toString()}
          className="mt-3"
          renderItem={({ item, index }) => (
            <View className="bg-yellow-100 p-3 rounded mt-2">
              {isEditing === index ? (
                <>
                  <TextInput
                    value={editedNote}
                    onChangeText={setEditedNote}
                    className="border border-gray-300 px-2 py-1 rounded"
                  />
                  <View className="flex-row justify-end mt-2">
                    <Pressable
                      onPress={saveEditedNote}
                      className="bg-green-400 px-2 py-1 rounded mr-2"
                    >
                      <Text className="text-white">Save</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setIsEditing(null)}
                      className="bg-gray-300 px-2 py-1 rounded"
                    >
                      <Text className="text-gray-800">Cancel</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Text className="text-xs text-gray-500">{item.date}</Text>
                  <Text className="text-base text-gray-800 mb-2">{item.text}</Text>
                  <View className="flex-row justify-end">
                    <Pressable
                      onPress={() => startEditing(index)}
                      className="bg-blue-200 px-2 py-1 rounded mr-2"
                    >
                      <Text className="text-gray-800">Edit</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteNote(index)}
                      className="bg-red-200 py-1 px-2 rounded-lg"
                    
                    >
                      <Text className="text-black">Delete</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          )}
          ListEmptyComponent={<Text className="text-center text-gray-400 mt-4">No notes yet!</Text>}
        />

        {/* Przycisk powrotu */}
        <View className="absolute bottom-8 left-5 right-5">
          <Pressable
            onPress={() => router.back()}
            className="bg-gray-300 py-3 rounded items-center"
          >
            <Text className="text-gray-800 text-base">← Back</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
