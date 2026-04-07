import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// 1. Agregamos value y onChangeText a la Interface
interface Props {
  label: string;
  placeholder?: string;
  isPassword?: boolean;
  icon?: ImageSourcePropType;
  editable?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

const CustomInput = ({
  label,
  placeholder,
  isPassword,
  icon,
  editable = true,
  value,
  onChangeText,
  keyboardType = "default",
}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholder={placeholder}
          secureTextEntry={isPassword}
          editable={editable}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor="rgba(10, 10, 10, 0.50)"
          style={[styles.input, !editable && styles.inputDisabled]}
        />
        {icon && (
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    color: "#364153",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    lineHeight: 20,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DC",
    borderRadius: 10,
    paddingLeft: 48,
    fontSize: 16,
    color: "#101828",
    backgroundColor: "white",
  },
  inputDisabled: {
    backgroundColor: "#F9FAFB",
  },
  icon: {
    width: 20,
    height: 20,
    position: "absolute",
    left: 16,
  },
});

export default CustomInput;
