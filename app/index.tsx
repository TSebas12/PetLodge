import React from "react";
import { StyleSheet, View } from "react-native";
import LoginScreen from "../src/screens/LoginScreen";

export default function Page() {
  return (
    <View style={styles.container}>
      {/* Aquí renderizamos tu pantalla de login */}
      <LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
