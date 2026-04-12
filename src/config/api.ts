import { Platform } from "react-native";

const API_BASE_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://192.168.100.5:3000";

export default API_BASE_URL;