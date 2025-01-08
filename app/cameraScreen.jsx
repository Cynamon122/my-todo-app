import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraScreen() {
  // ---------- STANY ----------
  const [permission, requestPermission] = useCameraPermissions(); // Uprawnienia do kamery
  const [facing, setFacing] = useState("back"); // Kierunek kamery
  const [torchOn, setTorchOn] = useState(false); // Stan latarki
  const [zoom, setZoom] = useState(0); // Zoom kamery
  const [sliderVisible, setSliderVisible] = useState(false); // Widoczność slidera
  const sliderAnim = useRef(new Animated.Value(0)).current; // Animacja slidera
  const [isRecording, setIsRecording] = useState(false); // Nagrywanie w toku
  const [videoUri, setVideoUri] = useState(null); // URI wideo

  const cameraRef = useRef(null); // Referencja do kamery
  const router = useRouter(); // Nawigacja
  const { id } = useLocalSearchParams(); // Pobieranie parametrów z URL

  // ---------- UŻYCIE EFEKTÓW ----------
  useEffect(() => {
    if (id) loadVideoUri();
  }, [id]);

  // ---------- FUNKCJE ----------

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo.uri) {
          console.log("Photo taken:", photo.uri);

          // Zapisz URI w AsyncStorage
          await AsyncStorage.setItem(`photoUri-${id}`, photo.uri);

          // Nawiguj do TaskDetails
          router.push(`/task/${id}`);
        } else {
          Alert.alert("Error", "Failed to retrieve photo URI.");
        }
      } catch (error) {
        console.error("Error taking photo:", error);
        Alert.alert("Error", "Failed to take photo.");
      }
    }
  };


  // Zapisz URI wideo do pamięci
  const saveVideoUri = async (uri) => {
    try {
      await AsyncStorage.setItem(`videoUri-${id}`, uri);
      console.log("Video URI saved successfully:", uri);
    } catch (error) {
      console.error("Failed to save video URI:", error);
    }
  };

  // Wczytaj URI wideo z pamięci
  const loadVideoUri = async () => {
    try {
      const savedUri = await AsyncStorage.getItem(`videoUri-${id}`);
      if (savedUri) {
        setVideoUri(savedUri);
        console.log("Loaded saved Video URI:", savedUri);
      }
    } catch (error) {
      console.error("Failed to load video URI:", error);
    }
  };

  // Przełącz kierunek kamery (przód/tył)
  const toggleCameraFacing = () => setFacing((prev) => (prev === "back" ? "front" : "back"));

  // Przełącz stan latarki
  const toggleTorch = () => setTorchOn((prev) => !prev);

  // Pokaż lub ukryj slider zoomu z animacją
  const toggleSlider = () => {
    setSliderVisible((prev) => !prev);
    Animated.timing(sliderAnim, {
      toValue: sliderVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Rozpocznij nagrywanie wideo
  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync();
        if (video.uri) {
          setVideoUri(video.uri);
          saveVideoUri(video.uri);
          router.push({
            pathname: "/task/[id]",
            params: { id, videoUri: video.uri },
          });
        } else {
          Alert.alert("Error", "Failed to retrieve video URI.");
        }
      } catch (error) {
        console.error("Error during recording:", error);
        Alert.alert("Error", "Failed to start recording.");
      } finally {
        setIsRecording(false);
      }
    }
  };

  // Zatrzymaj nagrywanie
  const stopRecording = () => {
    if (cameraRef.current) {
      try {
        cameraRef.current.stopRecording();
        setIsRecording(false);
      } catch (error) {
        console.error("Error stopping recording:", error);
        Alert.alert("Error", "Failed to stop recording.");
      }
    }
  };

  // ---------- RENDEROWANIE ----------

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to access the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        zoom={zoom}
        style={styles.camera}
        facing={facing}
        mode="video"
        enableTorch={torchOn}
      />
      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
        style={styles.overlay}
      >
        {/* Ikona Zoom */}
        <View style={styles.zoomControl}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleSlider}>
            <Ionicons name="search-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Slider Zoom z animacją */}
        <Animated.View
          style={[
            styles.zoomContainer,
            {
              opacity: sliderAnim,
              transform: [
                {
                  translateY: sliderAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.zoomLabel}>Zoom: {zoom.toFixed(2)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            value={zoom}
            onValueChange={(val) => setZoom(val)}
            minimumTrackTintColor="#1e90ff"
            maximumTrackTintColor="#fff"
            thumbTintColor="#1e90ff"
          />
        </Animated.View>

        {/* Kontrolki nagrywania, latarki i zmiany kamery */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse-outline" size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleTorch}>
            <Ionicons name={torchOn ? "flashlight" : "flashlight-outline"} size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={40} color="#1e90ff" />
          </TouchableOpacity>

          {isRecording ? (
            <TouchableOpacity style={styles.iconButton} onPress={stopRecording}>
              <Ionicons name="stop-circle-outline" size={40} color="#ff4040" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.iconButton} onPress={startRecording}>
              <Ionicons name="radio-button-on-outline" size={40} color="#ff4040" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

// ---------- STYLE ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  zoomControl: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  zoomContainer: {
    position: "absolute",
    bottom: 100,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  slider: {
    width: "80%",
    height: 40,
  },
  zoomLabel: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 20,
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
});