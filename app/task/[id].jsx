import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  Layout,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";
import "../../global.css";
import useStore from "../../store/useStore";

export default function TaskDetails() {
  // ---------- STANY ----------
  const { id } = useLocalSearchParams();
  const { tasks, updateTask } = useStore();
  const router = useRouter();

  const task = tasks.find((t) => t.id === id);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(task?.notes || []);
  const [status, setStatus] = useState(task?.status || "Do zrobienia");
  const [isEditing, setIsEditing] = useState(null); // Index edytowanej notatki
  const [editedContent, setEditedContent] = useState("");

  // ---------- EFEKTY ----------
  useEffect(() => {
    if (!id) {
      Alert.alert("Error", "Task ID is missing!");
      router.push("/");
    } else {
      setNotes(task?.notes || []);
      setStatus(task?.status || "Do zrobienia");
    }
  }, [id, task]);

  // Dodaj zdjęcie po powrocie z kamery
  useEffect(() => {
    const loadPhotoFromStorage = async () => {
      const savedPhotoUri = await AsyncStorage.getItem(`photoUri-${id}`);
      if (savedPhotoUri) {
        addNote("photo", savedPhotoUri);
        await AsyncStorage.removeItem(`photoUri-${id}`); // Usuń zapisane URI po dodaniu
      }
    };
    loadPhotoFromStorage();
  }, []);

  // Dodaj wideo po powrocie z kamery
  useEffect(() => {
    const loadVideoFromStorage = async () => {
      const savedVideoUri = await AsyncStorage.getItem(`videoUri-${id}`);
      if (savedVideoUri) {
        addNote("video", savedVideoUri);
        await AsyncStorage.removeItem(`videoUri-${id}`); // Usuń zapisane URI po dodaniu
      }
    };
    loadVideoFromStorage();
  }, []);

  // ---------- FUNKCJE ----------

  // Dodaj element (tekst, zdjęcie, wideo)
  const addNote = (type = "text", content = "") => {
    if (type === "text" && !note.trim()) return;

    const newNote = {
      id: Date.now().toString(),
      type, // Typ: "text", "photo", "video"
      content,
      date: getFormattedDate(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    updateTask(id, { notes: updatedNotes });
    if (type === "text") setNote("");
  };

  // Usuń notatkę
  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter((item) => item.id !== noteId);
    setNotes(updatedNotes);
    updateTask(id, { notes: updatedNotes });
  };

  // Rozpocznij edytowanie notatki
  const startEditing = (noteId) => {
    const noteToEdit = notes.find((item) => item.id === noteId);
    if (noteToEdit?.type === "text") {
      setIsEditing(noteId);
      setEditedContent(noteToEdit.content);
    }
  };

  // Zapisz edytowaną notatkę
  const saveEditedNote = () => {
    const updatedNotes = notes.map((item) =>
      item.id === isEditing ? { ...item, content: editedContent } : item
    );
    setNotes(updatedNotes);
    updateTask(id, { notes: updatedNotes });
    setIsEditing(null);
    setEditedContent("");
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

  // Otwórz kamerę w trybie zdjęcia
  const openCameraForPhoto = () => {
    router.push({ pathname: "/cameraScreen", params: { id, photoMode: true } });
  };

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
          <Text className="text-2xl font-bold text-center mb-3">
            {task?.name || "Task Details"}
          </Text>

          {/* Status zadania */}
          <Text className="text-base mt-2">Status:</Text>
          <View className="flex-row mt-2">
            {["Do zrobienia", "W trakcie", "Gotowe"].map((statusName) => (
              <Pressable
                key={statusName}
                onPress={() => {
                  setStatus(statusName);
                  updateTask(id, { status: statusName });
                }}
                className={`px-3 py-2 mr-2 rounded border ${status === statusName
                  ? "border-2 border-gray-400"
                  : "border-gray-300"
                  } ${statusName === "Do zrobienia"
                    ? "bg-red-200"
                    : statusName === "W trakcie"
                      ? "bg-yellow-200"
                      : "bg-green-200"
                  }`}
              >
                <Text className="text-gray-800">{statusName}</Text>
              </Pressable>

            ))}
            <Pressable
              onPress={openCameraForPhoto}
              className="bg-blue-200 py-2 px-4 rounded-full items-center flex-row justify-center"
              style={{ alignSelf: "center" }} // Umieszczenie przycisku na środku
            >
              <Ionicons name="camera-outline" size={20} color="#1e40af" style={{ marginRight: 8 }} />
              <Text className="text-blue-800 text-base">Aparat</Text>
            </Pressable>

          </View>

          {/* Dodawanie notatek */}
          <Text className="text-base mt-4">Dodaj notatkę:</Text>
          <View className="flex-row items-center mt-2">
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Twoja notatka..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2"
            />
            <Pressable
              onPress={() => addNote("text", note)}
              className="bg-gray-300 px-4 py-2 rounded-r-lg flex-row items-center justify-center"
            >
              <Ionicons name="add-circle-outline" size={20} color="#424242" />
            </Pressable>
          </View>




          {/* Lista notatek */}
          <FlatList
            data={notes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Animated.View layout={Layout.springify()} className="bg-yellow-100 p-3 rounded mt-2">
                <Text className="text-xs text-gray-500">{item.date}</Text>
                {isEditing === item.id ? (
                  <>
                    <TextInput
                      value={editedContent}
                      onChangeText={setEditedContent}
                      className="border border-gray-300 px-2 py-1 rounded"
                    />
                    <Pressable
                      onPress={saveEditedNote}
                      className="bg-green-300 px-2 py-1 rounded mt-2"
                    >
                      <Text>Save</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    {item.type === "text" && (
                      <Text className="text-base text-gray-800 mb-2">
                        {item.content}
                      </Text>
                    )}
                    {item.type === "photo" && (
                      <Image
                        source={{ uri: item.content }}
                        style={{ width: 100, height: 100, borderRadius: 8 }}
                      />
                    )}
                    {item.type === "video" && (
                      <Video
                        source={{ uri: item.content }}
                        style={{
                          height: 200,
                          borderRadius: 8,
                          marginTop: 8,
                        }}
                        useNativeControls
                        resizeMode="contain"
                      />
                    )}
                  </>
                )}
                <View className="flex-row justify-end">
                  {item.type === "text" && (
                    <Pressable
                      onPress={() => startEditing(item.id)}
                      className="bg-blue-300 px-2 py-1 rounded mr-2"
                    >
                      <Text>Edit</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => deleteNote(item.id)}
                    className="bg-red-300 px-2 py-1 rounded"
                  >
                    <Text>Delete</Text>
                  </Pressable>
                </View>
              </Animated.View>
            )}
            ListEmptyComponent={
              <Text className="text-center text-gray-400 mt-4">No notes yet!</Text>
            }
          />

          {/* Powrót */}
          <Pressable
            onPress={() => router.push("/")}
            className="bg-gray-300 py-3 rounded items-center mt-5"
          >
            <Text className="text-gray-800 text-base">← Powrót</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
