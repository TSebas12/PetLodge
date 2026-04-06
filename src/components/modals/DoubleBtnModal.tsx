import React from "react";
import {
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomButton from "../CustomButton";

interface Props {
  visible: boolean;
  icon: ImageSourcePropType;
  title: string;
  subtitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DoubleBtnModal = ({
  visible,
  icon,
  title,
  subtitle,
  onClose,
  onConfirm,
}: Props) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Image
              source={icon}
              style={styles.imageIcon}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textGroup}>
            <Text style={styles.titleText}>{title}</Text>
          </View>

          <View style={styles.contentGroup}>
            <Text style={styles.subtitleText}>{subtitle}</Text>

            <View style={styles.buttonContainer}>
              {/* Usando tu CustomButton */}
              <View style={styles.flexBtn}>
                <CustomButton
                  title="Cancelar"
                  onPress={onClose}
                  type="secondary"
                />
              </View>
              <View style={styles.flexBtn}>
                <CustomButton
                  title="Confirmar"
                  onPress={onConfirm}
                  type="danger"
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    padding: 14,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.12)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    gap: 8,
  },
  iconContainer: { width: 24, height: 24, marginBottom: 4 },
  imageIcon: { width: 24, height: 24 },
  textGroup: { alignSelf: "stretch" },
  titleText: {
    color: "#101828",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 30,
  },
  contentGroup: { alignSelf: "stretch", gap: 16 },
  subtitleText: {
    color: "#4A5565",
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 22.4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    width: "100%",
  },
  flexBtn: {
    flex: 1,
  },
});

export default DoubleBtnModal;
