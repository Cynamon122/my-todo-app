import { Slot } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";

export default function Layout() {
  return <Slot />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
