import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Klucz dla przechowywania danych zadań w AsyncStorage
const TASKS_KEY = "tasks";

// Tworzenie globalnego store za pomocą Zustand
const useStore = create((set, get) => ({
  // ---------- STANY ----------
  tasks: [], // Lista zadań
  task: "", // Aktualna treść nowego zadania

  // ---------- AKCJE ----------
  
  // Dodanie nowego zadania
  addTask: async () => {
    const { tasks, task } = get();
    if (!task.trim()) return; // Nie dodawaj pustego zadania

    const newTask = {
      id: Date.now().toString(), // Unikalne ID na podstawie czasu
      name: task, // Nazwa zadania
      notes: [], // Pusta lista notatek
      status: "Do zrobienia", // Domyślny status
    };

    const updatedTasks = [...tasks, newTask];
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks)); // Zapis do AsyncStorage
    set({ tasks: updatedTasks, task: "" }); // Aktualizacja stanu
  },

  // Aktualizacja zadania (np. zmiana statusu lub dodanie notatek)
  updateTask: async (id, updates) => {
    const { tasks } = get();
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    );

    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks)); // Zapis do AsyncStorage
    set({ tasks: updatedTasks }); // Aktualizacja stanu
  },

  // Usuwanie zadania
  deleteTask: async (id) => {
    const { tasks } = get();
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks)); // Zapis do AsyncStorage
    set({ tasks: updatedTasks }); // Aktualizacja stanu
  },

  // Wczytywanie zadań z AsyncStorage
  loadTasks: async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(TASKS_KEY);
      set({ tasks: storedTasks ? JSON.parse(storedTasks) : [] }); // Ustawienie zadań w stanie
    } catch (e) {
      console.error("Error loading tasks:", e);
    }
  },

  // Usuwanie wszystkich zadań
  clearTasks: async () => {
    await AsyncStorage.removeItem(TASKS_KEY); // Usunięcie z AsyncStorage
    set({ tasks: [] }); // Reset listy zadań w stanie
  },

  // Aktualizacja treści nowego zadania
  setTask: (newTask) => set({ task: newTask }),
}));

export default useStore;
