import { Slot } from "expo-router";
import { StyleSheet } from "react-native";

export default function Layout() {
  // Główny układ aplikacji, w którym Slot dynamicznie wstawia zawartość stron na podstawie ścieżek URL
  return <Slot />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
