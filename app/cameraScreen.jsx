import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const cameraRef = useRef(null);
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      loadVideoUri();
    }
  }, [id]);

  const saveVideoUri = async (uri) => {
    try {
      await AsyncStorage.setItem(`videoUri-${id}`, uri);
      console.log("Video URI saved successfully:", uri);
    } catch (error) {
      console.error("Failed to save video URI:", error);
    }
  };

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

  if (!permission) {
    return <View style={styles.container} />;
  }

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

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
    console.log("Camera facing toggled to:", facing === "back" ? "front" : "back");
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        console.log("Recording started...");
        const video = await cameraRef.current.recordAsync();
        console.log("Video URI captured:", video.uri);

        if (video.uri) {
          setVideoUri(video.uri);
          saveVideoUri(video.uri); // Save video URI
          router.push({ pathname: "/task/[id]", params: { id, videoUri: video.uri } });
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

  const stopRecording = () => {
    if (cameraRef.current) {
      try {
        cameraRef.current.stopRecording();
        setIsRecording(false);
        console.log("Recording stopped.");
      } catch (error) {
        console.error("Error stopping recording:", error);
        Alert.alert("Error", "Failed to stop recording.");
      }
    }
  };

  return (
    <View style={styles.container}>
      
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        mode="video"
      />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.buttonText}>Flip Camera</Text>
        </TouchableOpacity>
        {isRecording ? (
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopRecording}>
            <Text style={styles.buttonText}>Stop Recording</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={startRecording}>
            <Text style={styles.buttonText}>Start Recording</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#1e90ff",
    alignItems: "center",
  },
  stopButton: {
    backgroundColor: "#ff4d4d",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
});
