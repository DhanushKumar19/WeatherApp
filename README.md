# Weather App

A cross-platform React Native application that provides real-time weather information, location-based forecasts, and a favorites system. Built with modern state management, native modules, and a clean, user-friendly UI.

## Overview

Weather App allows users to:

- View current weather and 2-day forecasts for their location or any searched city.
- Save favorite locations for quick access.
- Handle location permissions and errors gracefully.

## Features

- **Current Weather:** Fetches weather data for the user's current location using native module.
- **Search:** Search for weather in any city.
- **2-Day Forecast:** Displays a concise forecast grid.
- **Favorites:** Add/remove favorite locations, persisted with Redux and AsyncStorage.
- **Location Permissions:** Robust handling of permission denial and location service status.
- **Animated UI:** Fade-in effects for weather cards.
- **Error Handling:** User-friendly alerts and actionable error screens.

## Technical Implementation

### Core Technologies

- **React Native 0.80+**
- **Redux Toolkit** for state management
- **AsyncStorage** for persistence
- **TypeScript** for type safety
- **Custom Native Module:** Kotlin and Swift based location provider with permission/service checks and timeout handling
- **Weather API Integration:** Fetches data from a weather API (e.g., OpenWeatherMap) via a service layer

### Advanced Features

- **Native Location Module:**
  - Written in Kotlin and Swift, exposes location data to JS via a Promise-based bridge.
  - Handles permission checks, service status, and timeouts.
- **DRY TypeScript Models:**
  - Shared interfaces for weather, forecast, and location data.
- **Animated Weather Cards:**
  - Uses React Native's Animated API for smooth transitions.
- **Error UI:**
  - Detects and displays actionable messages for permission/service errors.

## Prerequisites

- Node.js & npm
- Android Studio (for Android)
- Xcode & CocoaPods (for iOS)

## Setup Instructions

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Android Setup:**

   - Open the `android` folder in Android Studio and build/run the app.

3. **iOS Setup:**

   - Install CocoaPods if not present.
   - Run:
     ```sh
     cd ios
     pod install
     cd ..
     npx react-native run-ios
     ```

4. **API Key Configuration:**
   - Add your weather API key to a `.env` file.
   - Example `.env`:
     ```env
     OPEN_WEATHER_API_KEY=your_api_key_here
     ```

## Native Module Support

- **Android:** Custom location module written in Kotlin (see `android/app/src/java/com/weatherapp/LocationModule.kt`).
- **iOS:** Location support via Swift (see `ios/WeatherApp/LocationModule.swift`).

## Screenshots

| Home Screen - Current Location | Home Screen - Added to Favorite | Home Screen - Search | Detailed Weather | Home Screen - Favorites |
| ----------------------------- | ------------------------------- | ---------------- | ---------------------- | -------------------- |
| ![Current Location](screenshots/1.jpg) | ![Add Favorites](screenshots/2.jpg) | ![Search](screenshots/5.jpg) | ![Detailed Weather](screenshots/3.jpg) | ![Favorites](screenshots/4.jpg) |

## Project Structure

```
WeatherApp/
├── App.tsx
├── src/
│   ├── components/
│   │   └── DetailedWeatherModal.tsx
│   ├── native/
│   │   └── LocationModule.ts
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   └── FavoritesScreen.tsx
│   ├── services/
│   │   └── weatherAPI.ts
│   ├── store/
│   │   ├── favoriteSlice.ts
│   │   └── index.ts
│   ├── types/
│   │   └── weather.ts
│   └── utils/
│       └── networkUtils.ts
├── android/
│   └── app/src/main/java/com/weatherapp/LocationModule.kt
├── ios/
│   └── WeatherApp/
│       └── LocationModule.swift
├── package.json
├── README.md
└── ...
```

## API Integration

- **OpenWeatherMap API**: Current weather and 5-day forecast
- **Endpoints**:
- current: `api.openweathermap.org/data/2.5/weather`
- forecast: `api.openweathermap.org/data/2.5/forecast`
- **Authetication**: API key required
