import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList, SafeAreaView, Alert } from "react-native";
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
  const { id } = useLocalSearchParams(); // Pobierz `id` taska
  const [videoUri, setVideoUri] = useState(null);
  const { tasks, updateTask } = useStore(); // Pobieranie tasków i funkcji aktualizacji ze store
  const router = useRouter();

  const task = tasks.find((t) => t.id === id); // Znajdź odpowiedni task na podstawie ID

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(task?.notes || []);
  const [status, setStatus] = useState(task?.status || "Do zrobienia");
  const [isEditing, setIsEditing] = useState(null);
  const [editedNote, setEditedNote] = useState("");

  const scale = useSharedValue(1);

  useEffect(() => {
    if (!id) {
      Alert.alert("Error", "Task ID is missing!");
      router.push("/"); // Przekierowanie na stronę główną
      return;
    }

    // Załaduj URI wideo z pamięci
    loadVideoUri(id);

    // Zaktualizuj lokalny stan na podstawie taska
    setNotes(task?.notes || []);
    setStatus(task?.status || "Do zrobienia");
  }, [id, task]);

  const saveVideoUri = async (taskId, uri) => {
    try {
      await AsyncStorage.setItem(`videoUri-${taskId}`, uri);
      console.log(`Video URI saved for task ${taskId}:`, uri);
    } catch (error) {
      console.error("Failed to save video URI:", error);
    }
  };

  const loadVideoUri = async (taskId) => {
    try {
      const savedUri = await AsyncStorage.getItem(`videoUri-${taskId}`);
      if (savedUri) {
        console.log(`Video URI loaded for task ${taskId}:`, savedUri);
        setVideoUri(savedUri);
      } else {
        console.log(`No saved video URI for task ${taskId}`);
      }
    } catch (error) {
      console.error("Failed to load video URI:", error);
    }
  };

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

  const animateScale = () => {
    scale.value = withSpring(1.1, {}, () => {
      scale.value = withSpring(1);
    });
  };

  const scaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      entering={SlideInLeft.springify()} // Animacja wejścia
      exiting={SlideOutLeft.springify()} // Animacja wyjścia
      layout={Layout.springify()}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 p-5">
          <Text className="text-2xl font-bold text-center mb-3">{task?.name || "Task Details"}</Text>

          {/* Status */}
          <Text className="text-base mt-2">Status:</Text>
          <View className="flex-row mt-2">
            <Animated.View style={scaleStyle}>
              <Pressable
                onPress={() => {
                  setStatus("Do zrobienia");
                  updateTask(id, { status: "Do zrobienia" });
                  animateScale();
                }}
                className={`px-3 py-2 mr-2 rounded border ${
                  status === "Do zrobienia" ? "border-2 border-gray-400" : "border-gray-300"
                } bg-red-200`}
              >
                <Text className="text-gray-800">Do zrobienia</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={scaleStyle}>
              <Pressable
                onPress={() => {
                  setStatus("W trakcie");
                  updateTask(id, { status: "W trakcie" });
                  animateScale();
                }}
                className={`px-3 py-2 mr-2 rounded border ${
                  status === "W trakcie" ? "border-2 border-gray-400" : "border-gray-300"
                } bg-yellow-200`}
              >
                <Text className="text-gray-800">W trakcie</Text>
              </Pressable>
            </Animated.View>

            <Animated.View style={scaleStyle}>
              <Pressable
                onPress={() => {
                  setStatus("Gotowe");
                  updateTask(id, { status: "Gotowe" });
                  animateScale();
                }}
                className={`px-3 py-2 mr-2 rounded border ${
                  status === "Gotowe" ? "border-2 border-gray-400" : "border-gray-300"
                } bg-green-200`}
              >
                <Text className="text-gray-800">Gotowe</Text>
              </Pressable>
            </Animated.View>
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
              <Animated.View
                layout={Layout.springify()}
                className="bg-yellow-100 p-3 rounded mt-2"
              >
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
                shouldPlay={false}
                onLoad={() => console.log("Video loaded successfully")}
                onError={(e) => console.error("Video error:", e)}
              />
            </View>
          ) : (
            <Text className="text-center text-gray-400 mt-4">No video recorded yet!</Text>
          )}

          {/* Przycisk powrotu */}
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
