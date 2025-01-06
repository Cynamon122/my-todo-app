import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  SafeAreaView,
  Alert,
} from "react-native";
import { Video } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Layout,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStore from "../../store/useStore";
import "../../global.css";

export default function TaskDetails() {
  // ---------- STANY ----------
  const { id } = useLocalSearchParams(); // Pobierz ID taska z parametrów URL
  const { tasks, updateTask } = useStore(); // Pobieranie tasków i funkcji aktualizacji ze store
  const router = useRouter(); // Nawigacja

  const task = tasks.find((t) => t.id === id); // Znajdź odpowiedni task na podstawie ID
  const [videoUri, setVideoUri] = useState(null); // URI wideo
  const [note, setNote] = useState(""); // Nowa notatka
  const [notes, setNotes] = useState(task?.notes || []); // Lista notatek
  const [status, setStatus] = useState(task?.status || "Do zrobienia"); // Status zadania
  const [isEditing, setIsEditing] = useState(null); // Edytowanie notatki
  const [editedNote, setEditedNote] = useState(""); // Tekst edytowanej notatki

  const scale = useSharedValue(1); // Wartość dla animacji skalowania

  // ---------- EFEKTY ----------
  useEffect(() => {
    if (!id) {
      Alert.alert("Error", "Task ID is missing!");
      router.push("/"); // Przekierowanie na stronę główną
    } else {
      loadVideoUri(id); // Wczytaj URI wideo
      setNotes(task?.notes || []); // Zaktualizuj lokalny stan notatek
      setStatus(task?.status || "Do zrobienia"); // Zaktualizuj status
    }
  }, [id, task]);

  // ---------- FUNKCJE POMOCNICZE ----------

  // Zapisz URI wideo do pamięci
  const saveVideoUri = async (taskId, uri) => {
    try {
      await AsyncStorage.setItem(`videoUri-${taskId}`, uri);
      console.log(`Video URI saved for task ${taskId}:`, uri);
    } catch (error) {
      console.error("Failed to save video URI:", error);
    }
  };

  // Wczytaj URI wideo z pamięci
  const loadVideoUri = async (taskId) => {
    try {
      const savedUri = await AsyncStorage.getItem(`videoUri-${taskId}`);
      if (savedUri) {
        setVideoUri(savedUri);
        console.log(`Video URI loaded for task ${taskId}:`, savedUri);
      }
    } catch (error) {
      console.error("Failed to load video URI:", error);
    }
  };

  // Dodaj nową notatkę
  const addNote = () => {
    if (note.trim()) {
      const newNote = { text: note, date: getFormattedDate() };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      updateTask(id, { notes: updatedNotes });
      setNote("");
    }
  };

  // Usuń notatkę
  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    updateTask(id, { notes: updatedNotes });
  };

  // Rozpocznij edytowanie notatki
  const startEditing = (index) => {
    setIsEditing(index);
    setEditedNote(notes[index].text);
  };

  // Zapisz edytowaną notatkę
  const saveEditedNote = () => {
    const updatedNotes = [...notes];
    updatedNotes[isEditing] = { ...updatedNotes[isEditing], text: editedNote };
    setNotes(updatedNotes);
    updateTask(id, { notes: updatedNotes });
    setIsEditing(null);
    setEditedNote("");
  };

  // Pobierz aktualną datę w sformatowanej postaci
  const getFormattedDate = () => {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, "0")}.${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${now.getFullYear()} ${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  };

  // Animacja skalowania przy zmianie statusu
  const animateScale = () => {
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // ---------- RENDEROWANIE ----------
  return (
    <Animated.View
      entering={SlideInLeft.springify()}
      exiting={SlideOutLeft.springify()}
      layout={Layout.springify()}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-5">
          {/* Nazwa zadania */}
          <Text className="text-2xl font-bold text-center mb-3">
            {task?.name || "Task Details"}
          </Text>

          {/* Status zadania */}
          <Text className="text-base mt-2">Status:</Text>
          <View className="flex-row mt-2">
            {["Do zrobienia", "W trakcie", "Gotowe"].map((statusName) => (
              <Animated.View key={statusName} style={scaleStyle}>
                <Pressable
                  onPress={() => {
                    setStatus(statusName);
                    updateTask(id, { status: statusName });
                    animateScale();
                  }}
                  className={`px-3 py-2 mr-2 rounded border ${
                    status === statusName
                      ? "border-2 border-gray-400"
                      : "border-gray-300"
                  } ${statusName === "Do zrobienia" ? "bg-red-200" : statusName === "W trakcie" ? "bg-yellow-200" : "bg-green-200"}`}
                >
                  <Text className="text-gray-800">{statusName}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>

          {/* Dodawanie notatek */}
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
          {/* Otwieranie kamery */}
          <Pressable
            onPress={() => {
              router.push({ pathname: "/cameraScreen", params: { id } });
            }}
            className="bg-blue-200 py-2 px-3 rounded items-center mt-3"
          >
            <Text className="text-center text-blue-600">Open Camera</Text>
          </Pressable>


          {/* Lista notatek */}
          <FlatList
            data={notes}
            keyExtractor={(_, index) => index.toString()}
            className="mt-3"
            renderItem={({ item, index }) => (
              <Animated.View layout={Layout.springify()} className="bg-yellow-100 p-3 rounded mt-2">
                {isEditing === index ? (
                  <>
                    <TextInput
                      value={editedNote}
                      onChangeText={setEditedNote}
                      className="border border-gray-300 px-2 py-1 rounded"
                    />
                    <View className="flex-row justify-end mt-2">
                      <Pressable onPress={saveEditedNote} className="bg-green-400 px-2 py-1 rounded mr-2">
                        <Text className="text-white">Save</Text>
                      </Pressable>
                      <Pressable onPress={() => setIsEditing(null)} className="bg-gray-300 px-2 py-1 rounded">
                        <Text className="text-gray-800">Cancel</Text>
                      </Pressable>
                    </View>
                  </>
                ) : (
                  <>
                    <Text className="text-xs text-gray-500">{item.date}</Text>
                    <Text className="text-base text-gray-800 mb-2">{item.text}</Text>
                    <View className="flex-row justify-end">
                      <Pressable onPress={() => startEditing(index)} className="bg-blue-200 px-2 py-1 rounded mr-2">
                        <Text className="text-gray-800">Edit</Text>
                      </Pressable>
                      <Pressable onPress={() => deleteNote(index)} className="bg-red-200 py-1 px-2 rounded-lg">
                        <Text className="text-black">Delete</Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </Animated.View>
            )}
            ListEmptyComponent={<Text className="text-center text-gray-400 mt-4">No notes yet!</Text>}
          />

          {/* Wideo */}
          {videoUri ? (
            <View className="mt-4">
              <Text className="text-lg font-bold">Recorded Video:</Text>
              <Video
                source={{ uri: videoUri }}
                style={{
                  height: 200,
                  borderRadius: 8,
                  marginTop: 8,
                  marginBottom: 70,
                  width: "100%",
                }}
                useNativeControls
                resizeMode="contain"
              />
            </View>
          ) : (
            <Text className="text-center text-gray-400 mt-4">No video recorded yet!</Text>
          )}

          {/* Powrót */}
          <View className="absolute bottom-8 left-5 right-5">
            <Pressable
              onPress={() => router.push("/")}
              className="bg-gray-300 py-3 rounded items-center"
            >
              <Text className="text-gray-800 text-base">← Back</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
