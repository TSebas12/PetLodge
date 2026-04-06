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
  onConfirm: () => void;
}

const SingleBtnModal = ({
  visible,
  icon,
  title,
  subtitle,
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
              {/* Botón único que ocupa todo el ancho */}
              <CustomButton
                title="Continuar"
                onPress={onConfirm}
                type="primary"
              />
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
    width: "100%",
    marginTop: 8,
  },
});

export default SingleBtnModal;
