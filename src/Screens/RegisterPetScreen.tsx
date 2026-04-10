import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Componentes y Activos (Siguiendo la estructura de MyPetsScreen)
import Footer from "../components/Footer";
const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");

const RegisterPetScreen = () => {
  const router = useRouter();

  // Estado unificado para el formulario basado en requerimientos
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    raza: "",
    edad: "",
    sexo: "", // 'Masculino' | 'Femenino'
    tamano: "",
    vacunado: null, // boolean
    condicionesMedicas: null, // boolean
    vetNombre: "",
    vetTelefono: "",
    cuidados: "",
  });

  const handleInputChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    // Aquí iría la lógica de persistencia o envío a API
    console.log("Datos capturados:", formData);
    Alert.alert("Éxito", "Mascota registrada correctamente (Simulado)");
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Fijo (Consistencia visual con MyPets) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={Logo} style={styles.headerLogo} resizeMode="contain" />
          <Text style={styles.headerTitle}>PetLodge</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={LogoutIcon} style={styles.logoutIcon} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezado del Formulario */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Registro de Mascota</Text>
          <Text style={styles.subtitle}>Completa los datos de tu mascota</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Información Básica</Text>

          <Text style={styles.label}>Nombre de la mascota</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la mascota"
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
                placeholder="Raza"
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

          <Text style={styles.sectionTitle}>Estado de Vacunación</Text>
          <View style={styles.selectorRow}>
            <TouchableOpacity
              style={[
                styles.selectorBtn,
                formData.vacunado === true && styles.selectorBtnActive,
              ]}
              onPress={() => handleInputChange("vacunado", true)}
            >
              <Text
                style={
                  formData.vacunado === true ? styles.selectorTextActive : null
                }
              >
                Sí
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectorBtn,
                formData.vacunado === false && styles.selectorBtnActiveRed,
              ]}
              onPress={() => handleInputChange("vacunado", false)}
            >
              <Text
                style={
                  formData.vacunado === false ? styles.selectorTextActive : null
                }
              >
                No
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Veterinario de Confianza</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre del veterinario"
            onChangeText={(v) => handleInputChange("vetNombre", v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            onChangeText={(v) => handleInputChange("vetTelefono", v)}
          />

          <Text style={styles.sectionTitle}>Cuidados Especiales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Datos alimenticios o comportamiento"
            multiline
            numberOfLines={4}
            onChangeText={(v) => handleInputChange("cuidados", v)}
          />

          {/* Botones de Acción */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.btnRegister]}
              onPress={handleSave}
            >
              <Text style={styles.btnTextWhite}>Registrar Mascota</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.btnCancel]}
              onPress={() => router.back()}
            >
              <Text style={styles.btnTextRed}>Cancelar</Text>
            </TouchableOpacity>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 100 },
  titleContainer: { marginBottom: 20 },
  mainTitle: { color: "#101828", fontSize: 28, fontWeight: "700" },
  subtitle: { color: "#4A5565", fontSize: 16 },
  formCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
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
  selectorBtnActive: { backgroundColor: "#10B981", borderColor: "#10B981" },
  selectorBtnActiveRed: { backgroundColor: "#EF4444", borderColor: "#EF4444" },
  selectorTextActive: { color: "white", fontWeight: "600" },
  buttonContainer: { marginTop: 30 },
  actionBtn: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  btnRegister: { backgroundColor: "#10B981" },
  btnCancel: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  btnTextWhite: { color: "white", fontWeight: "700", fontSize: 16 },
  btnTextRed: { color: "#EF4444", fontWeight: "700", fontSize: 16 },
});

export default RegisterPetScreen;
