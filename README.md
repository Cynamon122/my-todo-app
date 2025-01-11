# To-Do List App

## Opis projektu
To-Do List App to mobilna aplikacja stworzona za pomocą **React Native** i **Expo**. Jej głównym celem jest umożliwienie użytkownikom zarządzania zadaniami oraz dodawania notatek w formie tekstu, zdjęć i wideo. Projekt został zrealizowany jako zadanie zaliczeniowe z dodatkowymi funkcjonalnościami i optymalizacjami.

## Funkcjonalności

1. **Zarządzanie zadaniami:**
   - Dodawanie, edytowanie i usuwanie zadań.
   - Wyświetlanie listy zadań z wykorzystaniem komponentu **FlatList**.
   - Animacje dodawania i usuwania zadań z użyciem **React Native Reanimated**.

2. **Notatki i multimedia:**
   - Dodawanie notatek tekstowych, zdjęć i wideo do zadań.
   - Obsługa kamery urządzenia za pomocą **Expo Camera**.
   - Możliwość nagrywania i odtwarzania wideo z użyciem **expo-video**.

3. **Przechowywanie danych:**
   - Lokalna pamięć wykorzystująca **AsyncStorage** do trwałego zapisu danych o zadaniach.

4. **Stylizacja:**
   - Responsywny i estetyczny interfejs użytkownika stworzony z użyciem **NativeWind (TailwindCSS)**.

5. **Nawigacja:**
   - Nawigacja między ekranami zrealizowana przy użyciu **Expo Router**.

## Wymagania

- **Node.js** (zalecana wersja LTS).
- **Expo CLI**: Globalnie zainstalowany za pomocą `npm install -g expo-cli`.
- Emulator (np. Android Studio lub Xcode) lub urządzenie z aplikacją **Expo Go**.

## Instalacja i uruchomienie

1. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

2. **Uruchom aplikację:**
   ```bash
   expo start
   ```

3. **Testuj aplikację na urządzeniu:**
   - Pobierz aplikację **Expo Go** na swoje urządzenie.
   - Zeskanuj kod QR wyświetlony w terminalu lub Expo DevTools.

4. **Testuj na emulatorze:**
   - Wybierz opcję „Run on Android device/emulator” lub „Run on iOS simulator” w Expo DevTools.

## Struktura projektu

- **`index.jsx`**: Główny ekran aplikacji z listą zadań.
- **`[id].jsx`**: Szczegóły zadania, w tym notatki i status.
- **`cameraScreen.jsx`**: Obsługa kamery i nagrywania wideo.
- **`TaskItem.jsx`**: Komponent reprezentujący pojedyncze zadanie.
- **`useStore.js`**: Zarządzanie stanem aplikacji z użyciem Zustand.

## Technologie

- **React Native**
- **Expo**
- **AsyncStorage**
- **React Native Reanimated**
- **NativeWind (TailwindCSS)**
- **Expo Camera**
- **expo-video**

## Autor
Projekt został zrealizowany jako część zadania zaliczeniowego.
