import React from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  icon: ImageSourcePropType;
  type?: "primary" | "secondary" | "danger";
}

const CustomButtonIcon = ({
  title,
  onPress,
  icon,
  type = "primary",
}: Props) => {
  const isPrimary = type === "primary";
  const isDanger = type === "danger";

  const bgColor = isPrimary ? "#00A63E" : isDanger ? "#E7000B" : "#155DFC";

  // Sombra un poco más profunda para que destaque
  const shadowColor = isPrimary ? "#008236" : isDanger ? "#A50008" : "#0D47C2";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          shadowColor: shadowColor,
          // --- SOLUCIÓN PARA WEB ---
          ...Platform.select({
            web: {
              // @ts-ignore: boxShadow para navegadores
              boxShadow: `0px 5px 12px ${shadowColor}73`,
            },
          }),
        },
      ]}
    >
      <View style={styles.content}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create<{
  button: ViewStyle;
  content: ViewStyle;
  icon: ImageStyle;
  text: TextStyle;
}>({
  button: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",

    // --- MANTENEMOS MÓVIL ---
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.45,
    shadowRadius: 6,
    elevation: 8,

    // Margen para que Android no corte la sombra en contenedores pequeños
    marginVertical: 4,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
});

export default CustomButtonIcon;
