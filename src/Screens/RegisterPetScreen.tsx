import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Componentes del proyecto
import CustomButton from "../components/CustomButton"; //
import Footer from "../components/Footer";

// Activos (Siguiendo MyPetsScreen y EditProfile)
const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");

const RegisterPetScreen = () => {
  const router = useRouter();

  // Estado basado en los requerimientos del PDF (Funcionalidad 2)
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    raza: "",
    edad: "",
    sexo: "",
    tamano: "",
    vacunado: null,
    condicionesMedicas: null,
    vetNombre: "",
    vetTelefono: "",
    cuidados: "",
  });

  const handleInputChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    // Aquí se conectará luego con la API de MongoDB
    console.log("Datos de mascota listos para push:", formData);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header consistente con EditProfileScreen  */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={Logo} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>PetLodge</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <Image source={LogoutIcon} style={styles.logoutIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Títulos alineados con la estética de EditProfile  */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Registro de Mascota</Text>
          <Text style={styles.subtitle}>
            Ingresa los datos requeridos por PetLodge
          </Text>
        </View>

        {/* Tarjeta de Formulario similar a la de Mi Perfil  */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información Básica</Text>

          <Text style={styles.label}>Nombre de la mascota</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Max"
            onChangeText={(v) => handleInputChange("nombre", v)}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Tipo</Text>
              <TextInput
                style={styles.input}
                placeholder="Perro, Gato..."
                onChangeText={(v) => handleInputChange("tipo", v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Raza</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Beagle"
                onChangeText={(v) => handleInputChange("raza", v)}
              />
            </View>
          </View>

          <Text style={styles.label}>Sexo</Text>
          <View style={styles.selectorRow}>
            {["Masculino", "Femenino"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.selectorBtn,
                  formData.sexo === option && styles.selectorBtnActive,
                ]}
                onPress={() => handleInputChange("sexo", option)}
              >
                <Text
                  style={[
                    styles.selectorText,
                    formData.sexo === option && styles.selectorTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Veterinario de Confianza</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del profesional"
            onChangeText={(v) => handleInputChange("vetNombre", v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono de contacto"
            keyboardType="phone-pad"
            onChangeText={(v) => handleInputChange("vetTelefono", v)}
          />

          <Text style={styles.sectionTitle}>Cuidados Especiales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Alimentación, alergias o comportamiento..."
            multiline
            numberOfLines={4}
            onChangeText={(v) => handleInputChange("cuidados", v)}
          />

          {/* Sección de Botones usando CustomButton.tsx [cite: 5, 6] */}
          <View style={styles.buttonSection}>
            <CustomButton
              title="Registrar Mascota"
              type="primary"
              onPress={handleSave}
            />
            <View style={{ height: 12 }} />
            <CustomButton
              title="Cancelar"
              type="danger"
              onPress={() => router.back()}
            />
          </View>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerLogo: { width: 32, height: 32 },
  headerTitle: {
    color: "#101828",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
  logoutIcon: { width: 20, height: 20, tintColor: "#4A5565" },
  scrollContent: { paddingHorizontal: 16, paddingTop: 30, paddingBottom: 120 },
  titleContainer: { width: "100%", marginBottom: 24 },
  mainTitle: {
    color: "#101828",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
  },
  subtitle: { color: "#4A5565", fontSize: 16, marginTop: 8 },
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#101828",
    marginTop: 20,
    marginBottom: 12,
  },
  label: { fontSize: 14, color: "#4A5565", marginBottom: 6 },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row" },
  selectorRow: { flexDirection: "row", marginBottom: 16 },
  selectorBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 8,
  },
  selectorBtnActive: { backgroundColor: "#155DFC", borderColor: "#155DFC" },
  selectorText: { color: "#4A5565", fontWeight: "500" },
  selectorTextActive: { color: "white", fontWeight: "600" },
  buttonSection: {
    width: "100%",
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
});

export default RegisterPetScreen;
