import Constants from "expo-constants";
import { Platform } from "react-native";

const manifestExtra =
  (Constants.expoConfig || {}).extra ||
  (Constants.manifest || {}).extra ||
  (Constants.manifest2 || {}).extra ||
  {};

const API_BASE_URL =
  manifestExtra.API_BASE_URL ||
  (Platform.OS === "web" ? "https://petlodge-backend.onrender.com" : "");

if (!API_BASE_URL) {
  console.warn(
    "Advertencia: API_BASE_URL no está definido en expo.extra. Configura la URL del backend en app.json o en Expo config.",
  );
} else {
  console.log("API_BASE_URL cargado:", API_BASE_URL);
}

export default API_BASE_URL;
