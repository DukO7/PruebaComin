import React, { Component, useState, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  BackHandler,
  Linking
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation,useIsFocused } from "@react-navigation/native";
import LastConnection from "../backend/LastConnection";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import SidebarModal from "./SidebarModal";
import { Skeleton } from '@rneui/themed';
export default function Home({ route }) {
  const isFocused = useIsFocused();
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del SidebarModal
    const [isLoading, setIsLoading] = useState(true);
  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handlePress1 = (screen) => {
    console.log("Navigating to", screen);
    closeModal(); // Cierra el SidebarModal después de presionar un elemento
     navigation.navigate(screen, { usuario: usuario,affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria });
  };
  const navigation = useNavigation();
  const { usuario, affiliateBonus,datosafiliados,inversionesPorFecha,cuentaBancaria} = route.params;
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

    const handleCustomScheme = async (url) => {
      // Lógica para manejar los esquemas personalizados
      if (url.startsWith('tuapp://checkout/success')) {
        // Manejar compra exitosa
      } else if (url.startsWith('tuapp://checkout/failure')) {
        // Manejar compra fallida
      } else if (url.startsWith('tuapp://stripe/success')) {
        // Manejar pago exitoso de Stripe
      } else if (url.startsWith('tuapp://stripe/cancel')) {
        navigation.navigate("Cancel");
      }
    };
    // const handleIncomingLink = ({ url }) => {
    //   handleCustomScheme(url);
    // };
    // Linking.addEventListener('url', handleIncomingLink);

    // // Verificar y manejar el enlace inicial al inicio de la aplicación
    // Linking.getInitialURL().then((url) => {
    //   if (url) {
    //     handleCustomScheme(url);
    //   }
    // });
    // return () => {backHandler.remove();
    //   Linking.removeEventListener('url', handleIncomingLink);}

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [isFocused]);


  const handleNavigateBack = () => {
    // Aquí puedes agregar la navegación de regreso al login
    console.log("Regresando al login...");
    navigation.navigate("Login");
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

  const handleFileChange = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Permission to access media library is required!"
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }

    if (!pickerResult.assets[0].uri) {
      Alert.alert("Error", "Selected image URI is undefined");
      return;
    }
    console.log("URI:", pickerResult.assets[0].uri);
    setSelectedFile(pickerResult.assets[0].uri);
    const formData = new FormData();
    formData.append("foto_usuario", {
      uri: pickerResult.assets[0].uri,
      type: "image/jpeg",
      name: "profile_image.jpg",
    });
    formData.append("id", usuario.id);
    try {
      const response = await axios.post(
        "http://192.168.1.72:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImageUrl(response.data.imageUrl);

      setTimeout(() => {
        handleRefresh();
        console.log("se actualizo correctamente");
      }, 2000);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const [imageError, setImageError] = useState(false);

  const [isSidebarVisible, setIsSidebarVisible] = React.useState(false);
  const handleSidebarClose = () => {
    setIsSidebarVisible(false);
  };
  const SkeletonScreen = () => {
    return (
      <View style={{ flex: 1 }}>
      <View style={styles.container}>
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
     
        </View>

        <View style={styles.profileSection}>
        <Skeleton circle width={40} height={40} style={styles.profileImage}/>
          <TouchableOpacity
            onPress={handleFileChange}
            style={styles.profileImage2}
          >
            <Ionicons name="camera" size={30} color="white" />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
    style={styles.profileTitle}
  />
            <Skeleton
    animation="wave"
    width={170}
    height={30}
    style={styles.profileName}
  />
            <Skeleton
    animation="wave"
    width={80}
    height={20}
    
  />
          </View>
        </View>
        
        {/* Linea */}
        <View style={styles.containerDivider}>
          <View style={styles.textDivider}>
          <Skeleton
    animation="wave"
    width={80}
    height={20}
  />
           
  
          </View>
          <View style={styles.divider} />
        </View>
        {/* Fin Linea */}

        <View style={{ justifyContent: "flex-start", flex: 1 }}>
          <View style={styles.containerdatos}>
            <View style={styles.textContainer}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
  />
            </View>
            <View style={styles.line}></View>
            <View style={styles.textContainer1}>
              <Skeleton
    animation="wave"
    width={80}
    height={20}
    style={styles.textDerecha}
  />
            </View>
          </View>

          <View style={styles.containerdatos}>
            <View style={styles.textContainer}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
  />
            </View>

            <View style={styles.line}></View>
            <View style={styles.textContainer1}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
    style={styles.textDerecha}
  />
            </View>
          </View>

          {/* Linea */}
          <View style={styles.containerDivider}>
            <View style={styles.textDivider}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
  />
            </View>
            <View style={styles.divider} />
          </View>
          {/* Fin Linea */}

          <View style={styles.containerdatos}>
            <View style={styles.textContainer}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
  />
            </View>
            <View style={styles.line}></View>
            <View style={styles.textContainer1}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
    style={styles.textDerecha}
  />
            </View>
          </View>

          <View style={styles.containerdatos}>
            <View style={styles.textContainer}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
  />
            </View>
            <View style={styles.line}></View>
            <View style={styles.textContainer1}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
    style={styles.textDerecha}
  />
            </View>
          </View>

          <View style={styles.containerdatos}>
            <View style={styles.textContainer}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
  />
            </View>
            <View style={styles.line}></View>
            <View style={styles.textContainer1}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
    style={styles.textDerecha}
  />
            </View>
          </View>

          <View style={styles.containerdatos}>
            <View style={styles.textContainer}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
  />
            </View>
            <View style={styles.line}></View>
            <View style={styles.textContainer1}>
            <Skeleton
    animation="wave"
    width={80}
    height={20}
    style={styles.textDerecha}
  />
            </View>
          </View>
        </View>

        <View style={styles.containernav}>
          <TouchableOpacity
            style={styles.leftIcon}
            onPress={() => navigation.navigate("Cartera", { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })}
          >
            <Ionicons name="wallet" size={30} color="white" />
            <Text style={styles.textnavbar}>Cartera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.centerIcon}
            onPress={() =>
              navigation.navigate("Inversiones", { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })
            }
          >
            <Ionicons name="analytics" size={30} color="white" />
            <Text style={styles.textnavbar2}>Inversiones</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={() => navigation.navigate("Retirar", { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })}
          >
            <Ionicons name="arrow-back" size={30} color="white" />
            <Text style={styles.textnavbar2}>Retirar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SidebarModal
        isVisible={isModalVisible} // Pasa el estado de visibilidad al SidebarModal
        onClose={closeModal} // Pasa la función para cerrar el SidebarModal al componente
        onPress={handlePress1} // Pasa la función para manejar la navegación al componente
        usuario={usuario}
      />
    </View>
    );
  };

  const MainScreen =()=>{
      
   return(
    <View style={{ flex: 1 }}>
    <View style={styles.container}>
      {/* Sección de perfil */}
      <View style={styles.header1}>
        {/* Aquí puedes personalizar el contenido del header */}
        {/* <View style={styles.containermenu} >
                  <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>

                      <Ionicons name="menu" size={30} color="white" />
                  </TouchableOpacity>
                  {showMenu && (
                      <View style={styles.overlay}>
                          <View style={styles.menu}>
                              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home', { usuario: usuario })}>
                                  <Text style={styles.menuText}>Mis datos</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                  style={styles.menuItem}
                                  onPress={onPressLogout}
                              >
                                  <Text style={styles.menuText}>Cerrar sesion</Text>
                              </TouchableOpacity>

                          </View>
                      </View>
                  )}
              </View> */}
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
   
      </View>

      <View style={styles.profileSection}>
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
        <TouchableOpacity
          onPress={handleFileChange}
          style={styles.profileImage2}
        >
          <Ionicons name="camera" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.profileTitle}>PERFIL</Text>

          <Text style={styles.profileName}>
            {usuario.nombre
              .split(" ")
              .slice(0, 2)
              .concat(
                usuario.nombre
                  .split(" ")
                  .slice(2)
                  .map((word) => word[0])
              )
              .join(" ")}
          </Text>
          <LastConnection />
        </View>
      </View>
      
      {/* Linea */}
      <View style={styles.containerDivider}>
        <View style={styles.textDivider}>
          <Text>DATOS DE TU CUENTA</Text>
         

        </View>
        <View style={styles.divider} />
      </View>
      {/* Fin Linea */}

      <View style={{ justifyContent: "flex-start", flex: 1 }}>
        <View style={styles.containerdatos}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Cuenta</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.textContainer1}>
            <Text style={styles.textDerecha}>{cuentaBancaria.nombre_cuenta}</Text>
          </View>
        </View>

        <View style={styles.containerdatos}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>No. De Cnta</Text>
          </View>

          <View style={styles.line}></View>
          <View style={styles.textContainer1}>
            <Text style={styles.textDerecha}>{cuentaBancaria.numero_tarjeta}</Text>
          </View>
        </View>

        {/* Linea */}
        <View style={styles.containerDivider}>
          <View style={styles.textDivider}>
            <Text>DATOS GENERALES</Text>
          </View>
          <View style={styles.divider} />
        </View>
        {/* Fin Linea */}

        <View style={styles.containerdatos}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Direccion</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.textContainer1}>
            <Text style={styles.textDerecha}>{usuario.direccion}</Text>
          </View>
        </View>

        <View style={styles.containerdatos}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Telefono</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.textContainer1}>
            <Text style={styles.textDerecha}>{usuario.telefono}</Text>
          </View>
        </View>

        <View style={styles.containerdatos}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Email</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.textContainer1}>
            <Text style={styles.textDerecha}>
              {usuario.correo_electronico}
            </Text>
          </View>
        </View>

        <View style={styles.containerdatos}>
          <View style={styles.textContainer}>
            <Text style={styles.text}>Cuenta Vinculada</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.textContainer1}>
            <Text style={styles.textDerecha}>vgm@direcciondecorreo.com</Text>
          </View>
        </View>
      </View>

      <View style={styles.containernav}>
        <TouchableOpacity
          style={styles.leftIcon}
          onPress={() => navigation.navigate("Cartera", { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })}
        >
          <Ionicons name="wallet" size={30} color="white" />
          <Text style={styles.textnavbar}>Cartera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.centerIcon}
          onPress={() =>
            navigation.navigate("Inversiones", { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })
          }
        >
          <Ionicons name="analytics" size={30} color="white" />
          <Text style={styles.textnavbar2}>Inversiones</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rightIcon}
          onPress={() => navigation.navigate("Retirar", { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })}
        >
          <Ionicons name="arrow-back" size={30} color="white" />
          <Text style={styles.textnavbar2}>Retirar</Text>
        </TouchableOpacity>
      </View>
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
  
  return (
    <View style={{ flex: 1 }}>
      {isLoading ? <SkeletonScreen /> : null}
      {!isLoading && <MainScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
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
    width: 120,
    height: 120,
    borderRadius: 80,
    position: "absolute",
    marginLeft: 20,
    bottom: 30,
    left: 0,
    zIndex: 1,
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
    left: 165,
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
    fontSize: 18,
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
    marginTop: 20,
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
});
