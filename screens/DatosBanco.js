import React, { Component, useState, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  BackHandler,
  ScrollView,Modal,ActivityIndicator
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import LastConnection from "../backend/LastConnection";
import * as ImagePicker from "expo-image-picker";
import { Skeleton } from '@rneui/themed';
import axios from "axios";
import SidebarModal from "./SidebarModal";
export default function DatosBanco({ route }) {
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del SidebarModal
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [verified, setVerified] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const openModal = () => {
    setIsModalVisible(true);
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
        setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
}, []);
  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handlePress1 = (screen) => {
    console.log("Navigating to", screen);
    closeModal(); // Cierra el SidebarModal después de presionar un elemento
    navigation.navigate(screen, {
      usuario: usuario,
      affiliateBonus: affiliateBonus,
      datosafiliados: datosafiliados,
      inversionesPorFecha:inversionesPorFecha,
      cuentaBancaria:cuentaBancaria
    });
  };
  const navigation = useNavigation();
  const { usuario, affiliateBonus, datosafiliados,inversionesPorFecha,cuentaBancaria } = route.params;
  const drawer = useRef(null);
  // console.log('esto estoy recibiendo de affiliateBonus:',affiliateBonus);
  // console.log('esto estoy recibiendo de usuario:',usuario);
  // console.log('esto estoy recibiendo de datosafiliados:',datosafiliados);
  const [drawerPosition, setDrawerPosition] = useState("left");
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "¿Estás seguro?",
        "¿Quieres regresar al login?",
        [
          {
            text: "Cancelar",
            onPress: () => null,
            style: "cancel",
          },
          { text: "Sí", onPress: () => handleNavigateBack() },
        ],
        { cancelable: false }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleNavigateBack = () => {
    // Aquí puedes agregar la navegación de regreso al login
    console.log("Regresando al login...");
    navigation.navigate("Login");
  };

  const handlePress = (screenName) => {
    navigation.navigate(screenName);
  };
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const handleLogout = async () => {
    try {
      // Eliminar los datos de usuario almacenados localmente
      await AsyncStorage.removeItem("usuario");
      // Redirigir al usuario a la pantalla de inicio de sesión
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "Error al cerrar sesión");
    }
  };

  const onPressLogout = () => {
    Alert.alert("sirve");
  };

  const [refreshCount, setRefreshCount] = useState(0);

  const handleRefresh = () => {
    // Incrementa el contador de actualización para forzar una re-renderización
    setRefreshCount(refreshCount + 1);
  };
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState(false);

  const [isSidebarVisible, setIsSidebarVisible] = React.useState(false);
  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };

  const insertarDatosUsuario = async (datosUsuario) => {
    try {
      const response = await axios.post('https://a3af-2806-10a6-16-2dc5-813d-4b98-3ea8-9707.ngrok-free.app/act-datosbanco', datosUsuario);
      console.log('Respuesta del servidor:', response.data);
      return response.data; // Puedes devolver la respuesta del servidor si es necesario
    } catch (error) {
      console.error('Error al insertar datos de usuario:', error);
      throw error; // Puedes lanzar el error para manejarlo en la parte que llame a esta función
    }
  };

  const [cuenta, setCuenta] = useState({
    titular: '',
    numero_tarjeta: '',
    nombre_banco: '',
    nombre_cuenta: '',
    numero_cuenta: '',
    //saldo_actual: '',
  });
  const handleChange = (name, value) => {
    setCuenta(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const guardarDatosCuenta = async () => {
    const datosUsuario = {
      titular_cuenta: cuenta.titular,
      numero_tarjeta: cuenta.numero_tarjeta, // Solo se modificará si el campo de teléfono fue modificado
      banco: cuenta.nombre_cuenta, 
      nombre_cuenta: cuenta.nombre_cuenta,
      numero_cuenta: cuenta.numero_cuenta,
      //saldo_afiliados: cuenta.saldo_actual,
      usuarioId: usuario.id
    };

    try {
      const respuesta = await insertarDatosUsuario(datosUsuario);
      console.log('Datos de cuenta insertados correctamente:', respuesta);
      Alert.alert("Éxito", "Datos de cuenta actualizados correctamente", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home", { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria }) // Redirigir a la página Home
        }
      ]);
    } catch (error) {
      console.error('Error al guardar datos de usuario:', error);
      // Manejar el error según sea necesario
      Alert.alert("Error", "Hubo un error al actualizar los datos de cuenta");
    }
  };
  const LoadingModal = ({ visible }) => (
    <Modal transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    </Modal>
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
      <LoadingModal visible={isLoading} />
       
        <View style={styles.header1}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              if (isModalVisible) {
                // Si el modal está abierto, ciérralo
                closeModal();
              } else {
                // Si el modal está cerrado, ábrelo
                openModal();
              }
            }}
          >
            <Ionicons name="menu" size={30} color="white" />
          </TouchableOpacity>
          {imageError ? (
            // Mostrar un icono en lugar de la imagen si hay un error
            <Image
              source={require("../assets/usuario1.jpg")}
              style={styles.profileImage}
            />
          ) : (
            // Intenta cargar la imagen
            <Image
              source={{
                uri: `http://192.168.1.72:3000/uploads/${usuario.id}.jpg`,
              }}
              style={styles.profileImage}
              onError={() => setImageError(true)} // Manejar error de carga de imagen
            />
          )}
          <Text style={styles.textHeader1}>{usuario.nombre}</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Mi Cartera</Text>
            {isLoading ? (
                     <>
    <Skeleton
    animation="wave"
    width={130}
    height={20}
    style={styles.textDerecha}
  />
  </>
  ) : (
    <>
      <LastConnection />
    </>
  )}
            <Text style={{ fontWeight: "bold", marginTop: 10 }}>
              Ingresa tus datos bancarios
            </Text>
            <TouchableOpacity
  style={styles.button}
  onPress={guardarDatosCuenta}
>
  <Text style={styles.buttonText}>Guardar Datos</Text>
</TouchableOpacity>
          </View>
        </View>

        {/* Linea */}
        <ScrollView style={{ height: "100%", marginBottom: 40 }}>
          <View style={styles.containerDivider}>
            <View style={styles.textDivider}>
              <Text>Tarjeta</Text>
            </View>
            <View style={styles.divider} />
          </View>
          {/* Fin Linea */}

          <View style={{ justifyContent: "flex-start", flex: 1 }}>
            <View style={styles.containerdatos}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Titular de la cuenta</Text>
              </View>
              <View style={styles.line}></View>
              <View style={styles.textContainer1}>
                <TextInput placeholder="" style={styles.inputs}value={cuenta.titular}
        onChangeText={text => handleChange('titular', text)} />
              </View>
            </View>

            <View style={styles.containerdatos}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Número de tarjeta</Text>
              </View>

              <View style={styles.line}></View>
              <View style={styles.textContainer1}>
                <TextInput placeholder="" style={styles.inputs}value={cuenta.numero_tarjeta}
        onChangeText={text => handleChange('numero_tarjeta', text)} />
              </View>
            </View>
            <View style={styles.containerdatos}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Nombre del banco</Text>
              </View>
              <View style={styles.line}></View>
              <View style={styles.textContainer1}>
                <TextInput placeholder="" style={styles.inputs} value={cuenta.nombre_banco}
        onChangeText={text => handleChange('nombre_banco', text)}/>
              </View>
            </View>

            <View style={styles.containerdatos}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Nombre de la cuenta</Text>
              </View>
              <View style={styles.line}></View>
              <View style={styles.textContainer1}>
                <TextInput placeholder="" style={styles.inputs}value={cuenta.nombre_cuenta}
        onChangeText={text => handleChange('nombre_cuenta', text)} />
              </View>
            </View>

            <View style={styles.containerdatos}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Número de cuenta bancaria</Text>
              </View>
              <View style={styles.line}></View>
              <View style={styles.textContainer1}>
                <TextInput placeholder="" style={styles.inputs}value={cuenta.numero_cuenta}
        onChangeText={text => handleChange('numero_cuenta', text)} />
              </View>
            </View>

            {/* <View style={styles.containerdatos}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Saldo actual</Text>
              </View>
              <View style={styles.line}></View>
              <View style={styles.textContainer1}>
                <TextInput placeholder="" style={styles.inputs}value={cuenta.saldo_actual}
        onChangeText={text => handleChange('saldo_actual', text)} />
              </View>
            </View> */}
          </View>

          <View style={styles.containerDivider}>
            <View style={styles.textDivider}>
              <Text>Crypto moneda</Text>
            </View>
            <View style={styles.divider} />
          </View>
          <View style={{ justifyContent: "flex-start", flex: 1 }}>
            <View style={styles.containerdatos}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Dirección billetera</Text>
              </View>
              <View style={styles.line}></View>
              <View style={styles.textContainer1}>
                <TextInput
                  placeholder=""
                  value=""
                  style={styles.inputs}
                />
              </View>
            </View>

            <View style={styles.containerdatos}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Dirección de correo electrónico</Text>
              </View>

              <View style={styles.line}></View>
              <View style={styles.textContainer1}>
                <TextInput
                  placeholder=""
                  value="asociado a su cuenta"
                  style={styles.inputs}
                />
              </View>
            </View>
            <View style={styles.containerdatos}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Seleccione la criptomoneda:</Text>
              </View>

              <View style={styles.line}></View>
              <Picker
        selectedValue={selectedCrypto}
        style={styles.textContainer1}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedCrypto(itemValue)
        }>
        <Picker.Item label="Bitcoin (BTC)" value="BTC" />
        <Picker.Item label="Ethereum (ETH)" value="ETH" />
        <Picker.Item label="Litecoin (LTC)" value="LTC" />
        {/* Puedes agregar más opciones aquí */}
      </Picker>
            </View>

            
            <View style={styles.containerdatos}>
              <View style={styles.textContainer}>
                <Text style={styles.text}>Código postal</Text>
              </View>
              <View style={styles.line}></View>
              <View style={styles.textContainer1}>
                <TextInput
                  placeholder=""
                  style={{
                    paddingHorizontal: 10,
                    borderColor: "black",
                    borderWidth: 2,
                    paddingVertical: 5,
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.containernav}>
          <TouchableOpacity
            style={styles.leftIcon}
            onPress={() =>
              navigation.navigate("Cartera", {
                usuario: usuario,
                affiliateBonus: affiliateBonus,
                datosafiliados: datosafiliados,
                cuentaBancaria:cuentaBancaria
              })
            }
          >
            <Ionicons name="wallet" size={30} color="white" />
            <Text style={styles.textnavbar}>Cartera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.centerIcon}
            onPress={() =>
              navigation.navigate("Inversiones", {
                usuario: usuario,
                affiliateBonus: affiliateBonus,
                datosafiliados: datosafiliados,
                cuentaBancaria:cuentaBancaria
              })
            }
          >
            <Ionicons name="analytics" size={30} color="white" />
            <Text style={styles.textnavbar2}>Inversiones</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() =>
              navigation.navigate("Retirar", {
                usuario: usuario,
                affiliateBonus: affiliateBonus,
                datosafiliados: datosafiliados,
                cuentaBancaria: cuentaBancaria
              })
            }
          >
            <Ionicons name="arrow-back" size={30} color="white" />
            <Text style={styles.textnavbar2}>Retirar</Text>
          </TouchableOpacity>
        </View>
        {showAlert && !cuentaBancaria.numero_tarjeta && (
                Alert.alert(
                    "Actualizar Datos de cartera",
                    "Para continuar con cualquier proceso, Inversion y Retirar debe tener su cuenta anexada",
                    [
                        {
                            text: "OK",
                            onPress: () => setShowAlert(false),
                        }
                    ]
                )
            )}
      </View>
      <SidebarModal
        isVisible={isModalVisible} // Pasa el estado de visibilidad al SidebarModal
        onClose={closeModal} // Pasa la función para cerrar el SidebarModal al componente
        onPress={handlePress1} // Pasa la función para manejar la navegación al componente
        usuario={usuario}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    textAlign: "left",
  },
  navigationContainer: {
    backgroundColor: "#ecf0f1",
  },
  containerDraw: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    position: "absolute",
    top: 0,
    zIndex: 2,
  },
  header1: {
    backgroundColor: "#1d2027",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo oscuro semitransparente
    zIndex: 0, // Menú debe estar por encima del overlay
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 80,
    top: 25,
    right: 150,
    borderColor: "white",
    borderWidth: 2,
  },
  profileImage2: {
    borderRadius: 80,
    position: "absolute",
    marginLeft: 100,
    bottom: 30,
    left: 0,
    zIndex: 1,
    backgroundColor: "#7192b2",
    borderColor: "#7192b2",
    borderWidth: 4,
  },

  profileInfo: {
    flex: 1,
    left: 10,
  },
  profileTitle: {
    fontSize: 15,

    marginBottom: 5,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  lastConnection: {
    fontSize: 10,
    color: "gray",
  },
  divider: {
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    marginBottom: 0,
    flex: 1,
    height: 1,
  },
  optionsSection: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "white",
  },
  textContainer: {
    flex: 1,
    alignItems: "left",
    left: 50,
  },
  textContainer1: {
    flex: 1,
    alignItems: "left",
    left: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  textDerecha: {
    fontSize: 14,
    color: "black",
  },
  line: {
    width: 1,
    height: 40,
    backgroundColor: "gray",
    marginRight: 10,
  },
  containerdatos: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "left",
    right: 20,
    marginTop: 20,
  },
  containerDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  textDivider: {
    marginRight: 10, // Espacio entre el texto y el Divider
    marginLeft: 20,
  },
  containernav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1d2027",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  leftIcon: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerIcon: {
    flex: 1,
    alignItems: "center",
  },
  rightIcon: {
    flex: 1,
    alignItems: "flex-end",
  },
  textnavbar: {
    color: "white",
    alignItems: "center",
    right: 5,
  },
  textnavbar2: {
    color: "white",
    alignItems: "center",
  },
  containermenu: {
    position: "absolute",
    top: 30,
    right: 20,
    paddingVertical: 10,
  },
  iconContainer: {
    padding: 100,
  },
  menu: {
    backgroundColor: "gray",
    borderRadius: 5,
    padding: 0,
    top: 60,
    position: "absolute",
  },
  menuItem: {
    padding: 10,
  },
  menuText: {
    fontSize: 18,
  },
  menuButton: {
    position: "absolute", // Icono de menú con posición absoluta
    top: 50, // Ajusta la posición superior según sea necesario
    right: 30, // Ajusta la posición derecha según sea necesario
    zIndex: 1, // Asegura que el icono esté por encima del resto del contenido
  },
  menuButton1: {
    position: "absolute", // Icono de menú con posición absoluta
    top: 50, // Ajusta la posición superior según sea necesario
    left: 337, // Ajusta la posición derecha según sea necesario
    zIndex: 1, // Asegura que el icono esté por encima del resto del contenido
  },
  textHeader1: {
    color: "white",
    right: 10,
    bottom: 10,
  },
  inputs: {
    paddingHorizontal: 10,
    borderColor: "black",
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1d2027',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    width:200
  },
});
