import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const useStore = create((set, get) => ({
  task: "",
  tasks: [],

  // Aktualizacja pola tekstowego
  setTask: (newTask) => set({ task: newTask }),

  // Dodawanie nowego zadania
  addTask: async () => {
    const { task, tasks } = get();
    if (!task.trim()) return;

    const updatedTasks = [...tasks, { id: Date.now().toString(), name: task }];

    try {
      await SecureStore.setItemAsync("tasks", JSON.stringify(updatedTasks));
      set({ tasks: updatedTasks, task: "" });
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  },

  // Usuwanie zadania
  deleteTask: async (taskId) => {
    const updatedTasks = get().tasks.filter((task) => task.id !== taskId);

    try {
      await SecureStore.setItemAsync("tasks", JSON.stringify(updatedTasks));
      set({ tasks: updatedTasks });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },

  // Odczyt zadań przy starcie aplikacji
  loadTasks: async () => {
    try {
      const savedTasks = await SecureStore.getItemAsync("tasks");
      if (savedTasks) set({ tasks: JSON.parse(savedTasks) });
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  },

  // Wyczyszczenie zadań
  clearTasks: async () => {
    try {
      await SecureStore.deleteItemAsync("tasks");
      set({ tasks: [] });
    } catch (error) {
      console.error("Error clearing tasks:", error);
    }
  },
}));

export default useStore;
