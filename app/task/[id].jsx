import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, SafeAreaView } from "react-native";
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{task?.name}</Text>

        <Text style={styles.label}>Status:</Text>
        <View style={styles.statusContainer}>
          {["Do zrobienia", "W trakcie", "Gotowe"].map((item) => (
            <Pressable
              key={item}
              onPress={() => {
                setStatus(item);
                updateTask(id, { status: item });
              }}
              style={[
                styles.statusButton,
                { backgroundColor: item === "Do zrobienia" ? "#ffcccc" :
                                 item === "W trakcie" ? "#fff4cc" : "#d4edda" },
                status === item && styles.statusButtonSelected,
              ]}
            >
              <Text style={styles.statusText}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Add a Note:</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Write your note here..."
          style={styles.input}
        />
        <Pressable onPress={addNote} style={styles.addButton}>
          <Text style={styles.addText}>Add</Text>
        </Pressable>

        <FlatList
          data={notes}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.noteContainer}>
              {isEditing === index ? (
                <>
                  <TextInput
                    value={editedNote}
                    onChangeText={setEditedNote}
                    style={styles.editInput}
                  />
                  <View style={styles.editButtons}>
                    <Pressable onPress={saveEditedNote} style={styles.saveButton}>
                      <Text style={styles.saveText}>Save</Text>
                    </Pressable>
                    <Pressable onPress={() => setIsEditing(null)} style={styles.cancelButton}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.noteDate}>{item.date}</Text>
                  <Text style={styles.noteText}>{item.text}</Text>
                  <View style={styles.noteActions}>
                    <Pressable onPress={() => startEditing(index)} style={styles.editButton}>
                      <Text style={styles.editText}>Edit</Text>
                    </Pressable>
                    <Pressable onPress={() => deleteNote(index)} style={styles.deleteButton}>
                      <Text style={styles.deleteText}>Delete</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          )}
        />

        <View style={styles.backButtonContainer}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  label: { fontSize: 16, marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10, marginTop: 5 },
  addButton: { backgroundColor: "#ccc", padding: 10, borderRadius: 5, alignItems: "center", marginTop: 10 },
  addText: { color: "#333", fontSize: 16 },
  noteContainer: { backgroundColor: "#fff8e1", padding: 10, borderRadius: 5, marginTop: 5 },
  noteDate: { fontSize: 12, color: "#888" },
  noteText: { fontSize: 16, color: "#333", marginBottom: 5 },
  noteActions: { flexDirection: "row", justifyContent: "flex-end" },
  editButton: { marginRight: 10, backgroundColor: "#add8e6", padding: 5, borderRadius: 5 },
  editText: { color: "#333" },
  deleteButton: { backgroundColor: "#ff4d4d", padding: 5, borderRadius: 5 },
  deleteText: { color: "#fff" },
  editInput: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 5, marginTop: 5 },
  editButtons: { flexDirection: "row", justifyContent: "flex-end", marginTop: 5 },
  saveButton: { backgroundColor: "#a0e6a0", padding: 5, borderRadius: 5, marginRight: 5 },
  saveText: { color: "#fff" },
  cancelButton: { backgroundColor: "#ddd", padding: 5, borderRadius: 5 },
  cancelText: { color: "#333" },
  backButtonContainer: { position: "absolute", bottom: 30, left: 20, right: 20 },
  backButton: { backgroundColor: "#ddd", padding: 10, borderRadius: 5, alignItems: "center" },
  backText: { fontSize: 16, color: "#333" },
  statusContainer: { flexDirection: "row", marginTop: 10 },
  statusButton: { padding: 10, marginRight: 10, borderRadius: 5, borderWidth: 1, borderColor: "#ddd" },
  statusButtonSelected: { borderWidth: 2, borderColor: "#6a0dad" },
  statusText: { color: "#333" },
});
