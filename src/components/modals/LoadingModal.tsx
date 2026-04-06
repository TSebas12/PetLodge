import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

interface Props {
  visible: boolean;
  message?: string;
}

const LoadingModal = ({ visible, message = "Cargando..." }: Props) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* La rueda de carga */}
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    marginTop: 15,
    fontSize: 16,
    color: "#364153",
    fontWeight: "500",
  },
});

export default LoadingModal;
