import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_KEY = "tasks";

const useStore = create((set, get) => ({
  tasks: [],

  // Dodanie nowego zadania
  addTask: async () => {
    const { tasks, task } = get();
    if (!task.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      name: task,
      notes: [],
      status: "Do zrobienia",
    };

    const updatedTasks = [...tasks, newTask];
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks, task: "" });
  },

  // Aktualizacja zadania (dodanie notatek, zmiana statusu)
  updateTask: async (id, updates) => {
    const { tasks } = get();
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    );

    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  // Usuwanie zadań
  deleteTask: async (id) => {
    const { tasks } = get();
    const updatedTasks = tasks.filter((task) => task.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    set({ tasks: updatedTasks });
  },

  // Wczytywanie zadań z AsyncStorage
  loadTasks: async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(TASKS_KEY);
      set({ tasks: storedTasks ? JSON.parse(storedTasks) : [] });
    } catch (e) {
      console.error("Error loading tasks:", e);
    }
  },

  clearTasks: async () => {
    await AsyncStorage.removeItem(TASKS_KEY);
    set({ tasks: [] });
  },

  task: "",
  setTask: (newTask) => set({ task: newTask }),
}));

export default useStore;

