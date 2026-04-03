import React from "react";
import { View } from "react-native";
import LoginScreen from "../src/Screens/RegisterScreen";

export default function Page() {
  return (
    <View className="flex-1 justify-center items-center">
      {/* Aquí renderizamos tu pantalla de login */}
      <LoginScreen />
    </View>
  );
}
