# 🕰️ Timer App

A feature-rich, customizable timer application built using React Native CLI (without Expo).
This app lets you create multiple timers, assign them to categories, set mid-session alerts, and track progress intuitively.

---

🚀✨ Features

✅ Create custom timers with name, duration, category, and optional mid alerts.  
✅ Group timers by category.  
✅ Start, pause, and reset timers individually.  
✅ ⭐ Batch actions on grouped timers (e.g., pause/start all timers in a category).  
✅ 🔔 Mid alerts with sound and notification at specified percentages.  
✅ 📤 Export and share timers as JSON data.  
✅ 💾 Persistent storage using AsyncStorage.  
✅ 🎨 Clean and customizable UI with light/dark theme support.

---

⚡🛠️ Setup

### Prerequisites

- **Node.js** ≥ 18.x
- **Yarn** or **npm**
- **React Native CLI** installed globally
- **Android Studio** (for Android) or Xcode (for iOS)
- **Java JDK** 17+
- Correctly configured **Android NDK** and CMake (if targeting native modules)

---

### 1️⃣ Clone the repository

```bash
git clone
cd timer-app
```

---

### 2️⃣ Install dependencies

```bash
yarn install
# or
npm install
```

---

### 3️⃣ Start Metro bundler

```bash
yarn start
# or
npm run start
```

---

### 4️⃣ Run on Android

```bash
yarn android
# or
npm run android
```

---

### 5️⃣ Run on iOS

```bash
cd ios
pod install
cd ..
yarn ios
# or
npm run ios
```

---

> ⚠️ Make sure you have an Apple machine and Xcode installed for iOS builds.

---

💭💡 Assumptions Made During Development

- **React Native CLI (not Expo)**: The project is built without Expo to allow more granular control over native modules (e.g., `react-native-sound`).
- **AsyncStorage for persistence**: All timer data is stored locally using AsyncStorage; no backend/database integration.
- **Hermes enabled**: The app uses Hermes for faster JS execution and smaller bundle sizes.
- **Sound files included locally**: The alert sound (`message.mp3`) is assumed to be placed in `assets/sound/`.
- **Category list can change**: Users can create new categories, and these are stored along with the timers.
- **One mid-session alert per timer**: Only a single "mid" alert is supported per timer (specified as a percentage of total duration).
- **No background execution**: Timers do not continue running in the background (e.g., when the app is closed or in the background state).
- **CMake / NDK compatibility**: Assumed that the Android NDK and CMake versions are properly configured and compatible with React Native 0.80.
- **iOS build may fail**: This project was built on windows machine, so while running on iOS there is a chance of build issues.

---

## 💡 Additional Notes

- To export timers as a JSON file, a custom function is provided (`exportData`). You can adapt it to integrate with file-sharing or external storage if needed.
- The UI uses Tailwind-style utility classes via `twrnc` for easy styling.
- Sound playback handled using `react-native-sound`. You may need to patch or adjust if using Hermes (as we've done by modifying internal dependency resolution).

---

🚀🔮 Possible Improvements

- Add background timer support using `react-native-background-timer` or similar.
- Add optional notifications when timers complete in the background.
- Support for multi-device sync (e.g., using Firebase or custom backend).
- More advanced sound/vibration customization.
- Adding new categories on the fly.

---

## 💬 Questions or Issues?

Feel free to open an issue or start a discussion in this repository. We welcome contributions and suggestions!

---

### ✨ Happy timing! 💪⏳
