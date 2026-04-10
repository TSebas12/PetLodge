import axios from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Componentes del proyecto
import CustomButton from "../components/CustomButton";
import Footer from "../components/Footer";
import LoadingModal from "../components/modals/LoadingModal";
import SingleBtnModal from "../components/modals/SingleBtnModal";

// Activos
const Logo = require("../../assets/LogoPetLodge.webp");
const LogoutIcon = require("../../assets/IconoSalida.webp");
const IconoAlerta = require("../../assets/IconoAlerta.webp");
const IconoCheck = require("../../assets/IconoCheck.webp");

const RegisterPetScreen = () => {
  const router = useRouter();

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    msg: "",
    icon: IconoCheck,
  });

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    raza: "",
    edad: "",
    sexo: "",
    tamano: "",
    vacunado: null as boolean | null,
    condicionesMedicas: null as boolean | null,
    vetNombre: "",
    vetTelefono: "",
    cuidados: "",
  });

  const handleInputChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    // Validación básica
    if (!formData.nombre || !formData.tipo) {
      setModalConfig({
        title: "Atención",
        msg: "El nombre y el tipo de mascota son obligatorios.",
        icon: IconoAlerta,
      });
      setModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      // 1. Obtener la sesión para saber quién es el dueño
      let session = null;
      if (Platform.OS === "web") {
        session = localStorage.getItem("userSession");
      } else {
        session = await SecureStore.getItemAsync("userSession");
      }

      if (!session) throw new Error("No hay sesión activa");
      const user = JSON.parse(session);

      // 2. Configurar URL (Asegúrate que coincida con tu backend)
      const API_URL =
        Platform.OS === "android"
          ? "http://10.0.2.2:3000"
          : "http://localhost:3000";

      // 3. Enviar datos al endpoint (Funcionalidad 2 del proyecto)
      const response = await axios.post(`${API_URL}/api/pets`, {
        ...formData,
        ownerId: user._id, // Relacionamos la mascota con el usuario logueado
      });

      if (response.status === 201 || response.status === 200) {
        setModalConfig({
          title: "¡Éxito!",
          msg: "Mascota registrada correctamente.",
          icon: IconoCheck,
        });
        setModalVisible(true);
        // Esperamos un momento y volvemos
        setTimeout(() => {
          setModalVisible(false);
          router.back();
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setModalConfig({
        title: "Error",
        msg: "No se pudo registrar la mascota. Intenta de nuevo.",
        icon: IconoAlerta,
      });
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>Registro de Mascota</Text>
          <Text style={styles.subtitle}>Completa la ficha de tu mascota</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            onChangeText={(v) => handleInputChange("nombre", v)}
            placeholder="Nombre"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Tipo</Text>
              <TextInput
                style={styles.input}
                onChangeText={(v) => handleInputChange("tipo", v)}
                placeholder="Ej: Perro"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Raza</Text>
              <TextInput
                style={styles.input}
                onChangeText={(v) => handleInputChange("raza", v)}
                placeholder="Ej: Beagle"
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

          <Text style={styles.sectionTitle}>Cuidados Especiales</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Alimentación o alergias..."
            onChangeText={(v) => handleInputChange("cuidados", v)}
          />

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

      {/* Modales de feedback consistentes con el resto de la app */}
      <LoadingModal visible={loading} />
      <SingleBtnModal
        visible={modalVisible}
        onConfirm={() => setModalVisible(false)} // Cambiado de onClose a onConfirm
        title={modalConfig.title}
        subtitle={modalConfig.msg} // Cambiado de msg a subtitle
        icon={modalConfig.icon}
      />
      <Footer />
    </SafeAreaView>
  );
};

// ... (Estilos iguales a los anteriores)
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
