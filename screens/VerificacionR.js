import React, { Component, useState,useEffect } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity,Alert,Button,ActivityIndicator } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SidebarModal from "./SidebarModal";
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Buffer } from 'buffer';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import CustomAlert from './CustomAlert';
export default function VerificacionR({ route,onRequestClose  }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [loading, setLoading] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUri, setPhotoUri] = useState(null);
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Se necesita permiso para acceder a la cámara.');
            } else {
                setHasPermission(true);
            }
        })();
    }, []);
 
    const [ineImage, setIneImage] = useState(null); // Estado para almacenar la imagen de la INE
    const [showAlert, setShowAlert] = useState(false); // Estado para controlar la visibilidad del alert
    const [verified, setVerified] = useState(false); // Estado para verificar si el usuario ha verificado sus datos

    const navigation = useNavigation();
    const { usuario, affiliateBonus,datosafiliados } = route.params;
    const handlePress = (screenName) => {
        navigation.navigate(screenName);
    };
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    const [imageError, setImageError] = useState(false);
    const [imageError1, setImageError1] = useState(false);

    const [imageErrorss, setImageErrorss] = useState(Array(datosafiliados.length).fill(false));
    const handleImageError = (index) => {
        const newImageErrors = [...imageErrorss];
        newImageErrors[index] = true;
        setImageErrorss(newImageErrors);
      };
    
      const [isModalVisible, setIsModalVisible] = useState(false); 

      const openModal = () => {
        setIsModalVisible(true);
      };
    
      const closeModal = () => {
        setIsModalVisible(false);
      };
      const handlePress1 = (screen) => {
        console.log("Navigating to", screen);
        closeModal();
         navigation.navigate(screen, { usuario: usuario,affiliateBonus:affiliateBonus,datosafiliados:datosafiliados });
      };
      const takePicture = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            setPhotoUri(photo.uri);
        }
    };
    
      
    const validateIne = (text) => {
        // Convertir el texto a minúsculas para hacer la búsqueda sin distinción entre mayúsculas y minúsculas
        const lowerCaseText = text.toLowerCase();
      
        // Obtener el nombre del usuario y dividirlo en palabras clave
        const keywords = usuario.nombre.toLowerCase().split(' ');
      
        // Contador para llevar el registro de cuántas palabras clave están presentes en el texto
        let count = 0;
        console.log('datos separados usuario:',keywords);
        // Verificar cuántas palabras clave están presentes en el texto
        keywords.forEach(keyword => {
          if (lowerCaseText.includes(keyword)) {
            count++;
          }
        });
      
        // Devolver true si al menos dos palabras clave están presentes
        return count >= 2;
      };
      
      const extractTextFromImage = async () => {
        if (!photoUri) {
          console.log("No se ha tomado ninguna foto.");
          return;
        }
        setShowAlert(true);
        console.log("Ruta de la imagen:", photoUri);
      
        try {
          const imageAsset = await FileSystem.getInfoAsync(photoUri);
          const imageBase64 = imageAsset.size > 1000000 ? await reduceImage(photoUri) : await FileSystem.readAsStringAsync(photoUri, { encoding: FileSystem.EncodingType.Base64 });
          
          const text = await detectTextFromImage(imageBase64);
      
          if (text) {
            console.log("Texto extraído:", text);
      
            const isValidIne = validateIne(text);
            console.log("Es INE válida:", isValidIne);
      
            if (isValidIne) {
                // Actualizar el campo verificado_ine en la base de datos
                try {
                    await axios.post('http://192.168.1.71:3000/actualizar_verificado_ine', {
                        usuarioId: usuario.id,
                        verificadoIne: true, // O 1, dependiendo del tipo en tu base de datos
                    });
                    // Si la actualización fue exitosa, mostrar una alerta
                    setShowAlert(false);
                    Alert.alert('Éxito', 'Verificacion exitosa!.');
                    navigation.navigate('IneyCurp3',{ usuario: usuario,affiliateBonus:affiliateBonus,datosafiliados:datosafiliados });
                } catch (error) {
                    console.error('Error al actualizar verificado_ine:', error);
                    Alert.alert('Error', 'No se pudo actualizar el campo verificado_ine. Inténtalo de nuevo más tarde.');
                }
            } else {
                setShowAlert(false);
                alert('Verifica el enfoque de la toma');
            }
        } else {
            setShowAlert(false);
            Alert.alert('Verifica el enfoque de la toma');
            console.log('No se pudo detectar texto en la imagen.');
        }
    } catch (error) {
        setShowAlert(false);
        console.error("Error al extraer texto:", error);
        alert("Error al extraer texto de la imagen.");
    }
      };
      const reduceImage = async (photoUri) => {
        const reducedImage = await ImageManipulator.manipulateAsync(
          photoUri,
          [
            { resize: { width: 1200, height: 900 } },
            { crop: { originX: 0, originY: 0, width: 600, height: 450 } },
            { resize: { width: 600 } },
          ],
          { base64: true }
        );
      
        console.log("Tamaño de la imagen reducida:", Buffer.byteLength(reducedImage.base64, 'base64'), "píxeles");
        return `data:image/jpeg;base64,${reducedImage.base64}`;
      };
     
      const detectTextFromImage = async (imageBase64) => {
        try {
          const response = await axios.post('https://api.ocr.space/parse/image', {
            apikey: 'K85082677388957',
            language: 'spa',
            isOverlayRequired: false,
            filetype: 'jpeg',
            base64image: imageBase64,
          }, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          });
      
          if (response.data.IsErroredOnProcessing) {
            console.error('Error al detectar texto:', response.data.ErrorMessage);
            return null;
          }
      
          return response.data.ParsedResults[0].ParsedText;
        } catch (error) {
          console.error('Error al detectar texto:', error);
          return null;
        }
      };

      const handlellamar = async()=>{
        extractTextFromImage();
        subirdocumentos();
    }
    const subirdocumentos= async()=>{
        const formData = new FormData();
        formData.append("Documento", {
          uri: photoUri,
          type: "image/jpeg",
          name: "profile_image.jpg",
        });
        formData.append("id", usuario.id);
        await axios.post(
            "http://192.168.1.71:3000/documentos_ine",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          
    }

    return (

        <View style={styles.container}>
            <CustomAlert visible={showAlert} message="Verificando..." />
            <View style={styles.header1}>
                
            <View style={styles.profileInfo}>
            {imageError1 ? (
            // Mostrar un icono en lugar de la imagen si hay un error
            <Image
              source={require("../assets/usuario1.jpg")}
              style={styles.profileImage}
            />
          ) : (
            // Intenta cargar la imagen
            <Image
              source={{
                uri: `http://192.168.1.65:3000/uploads/${usuario.id}.jpg`,
              }}
              style={styles.profileImage}
              onError={() => setImageError1(true)} // Manejar error de carga de imagen
            />
          )}
        <Text style={styles.textHeader1}>{usuario.nombre}</Text>
    </View>
               
                <View style={styles.containermenu}>
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
            </View>

            <View style={styles.containerdatos}>
            {hasPermission === null ? (
    <Text>Solicitando permiso para acceder a la cámara...</Text>
) : hasPermission === false ? (
    <Text>No se ha concedido permiso para acceder a la cámara.</Text>
) : (
    <View style={{height:670}}>
        {photoUri ? (
            <View style={styles.photoContainer}>
                <Text style={{bottom:30,fontWeight:'bold'}}>Verifica que la INE (Parte Reversa) se visualice nitidamente</Text>
                <Image source={{ uri: photoUri }} style={styles.photo} />
                <TouchableOpacity style={styles.retakeButton} onPress={() => setPhotoUri(null)}>
                    <Text style={styles.retakeText}>Tomar otra</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.retakeButton1} onPress={handlellamar}>
                    <Text style={styles.retakeText}>Siguiente</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <Camera
                style={{ flex: 1 }}
                type={Camera.Constants.Type.back}
                ref={(ref) => setCameraRef(ref)}
            />
        )}
        {!photoUri && <Button title="Tomar Foto" onPress={takePicture} />}
    </View>
)}
            </View>
            
            <View>
 
  

  {/* Iterar sobre los afiliados y mostrar su información */}
  
</View>
           
            <View style={styles.containernav}>
                <TouchableOpacity style={styles.leftIcon} onPress={() => navigation.navigate('Cartera', { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados })}>
                    <Ionicons name="wallet" size={30} color="white" />
                    <Text style={styles.textnavbar}>Cartera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.centerIcon} onPress={() => navigation.navigate('Inversiones', { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados })}>
                    <Ionicons name="analytics" size={30} color="white" />
                    <Text style={styles.textnavbar2}>Inversiones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightIcon} onPress={() => navigation.navigate('Retirar', { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados })}>
                    <Ionicons name="arrow-back" size={30} color="white" />
                    <Text style={styles.textnavbar2}>Retirar</Text>
                </TouchableOpacity>
            </View>
            <SidebarModal
        isVisible={isModalVisible} // Pasa el estado de visibilidad al SidebarModal
        onClose={closeModal} // Pasa la función para cerrar el SidebarModal al componente
        onPress={handlePress1} // Pasa la función para manejar la navegación al componente
        usuario={usuario}
      />
        </View>
    )
}

const styles = StyleSheet.create({
    retakeText: {
        color: 'white',
        fontSize: 16,
    },
    photo: {
        width: 350,
        height: 250,
        resizeMode: 'cover',
        borderRadius: 20,
    },
    retakeButton: {
        position: 'absolute',
        top:400,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 10,
    },
    retakeButton1: {
        top:50,
        backgroundColor: '#7192b3',
        padding: 10,
        paddingHorizontal:70,
        width:220,
        borderRadius: 10,
    },
    photoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        top:40
    },
    archivo:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black',
        borderWidth: 1,
        width: 270,
        marginLeft: 50,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 30,
    },
    barradoble:{
        flexDirection: 'row',
        alignItems: 'center',
        left:50,

    },
    container: {
        flex: 1,
        backgroundColor: 'white',

    },
    header1: {
        backgroundColor: '#1d2027',
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textHeader1: {
        color: 'white',
        marginLeft: 10,
        marginTop:40
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    profileImage1: {
        width: 30,
        height: 30,
        left: 0,
        borderWidth: 2, 
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 80,
        marginLeft: 20,
        top:20,
        left: 0,
        borderColor: 'white',
        borderWidth: 2,
    },
    profileImage2: {
        width: 70,
        height: 70,
        borderRadius: 40, // Para que la imagen sea redonda
        borderWidth: 1,
        borderColor: '#fff', // Borde blanco
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },

    profileInfo: {
        flexDirection: 'row',
    alignItems: 'center',
    },
    profileTitle: {
        fontSize: 18,
        alignContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    lastConnection: {
        fontSize: 10,
        color: 'gray',
    },
    divider: {
        borderBottomColor: 'lightgray',
        borderBottomWidth: 1,
        marginBottom: 0,
        flex: 1,
        height: 1,
    },
    optionsSection: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        color: 'white',
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    textDerecha: {
        fontSize: 18,
        color: 'black',


    },
    textDerecha2: {
        fontSize: 18,
        color: 'black',
        marginTop: 20

    },
    textDerecha1: {
        fontSize: 22,
        color: 'black',
        fontWeight: 'bold',
        marginTop: 10

    },
    line: {
        width: 1,
        height: 40,
        backgroundColor: 'gray',
        marginRight: 10
    },
    containerdatos: {
        textAlign: 'center',
        bottom:20,
        width:410,
        height:300,
        flex:1

    },
    containerDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
    },
    textDivider: {
        marginRight: 10, // Espacio entre el texto y el Divider
        marginLeft: 20
    },
    containernav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1d2027',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    
    leftIcon: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centerIcon: {
        flex: 1,
        alignItems: 'center',
    },
    rightIcon: {
        flex: 1,
        alignItems: 'flex-end',
    },
    textnavbar: {
        color: 'white',
        alignItems: 'center',
        right: 5
    },
    textnavbar2: {
        color: 'white',
        alignItems: 'center',
    },
    containermenu: {
        position: 'absolute',
        top: 30,
        right: 20,
    },
    iconContainer: {
        padding: 100,
    },
    menu: {
        backgroundColor: 'gray',
        borderRadius: 5,
        padding: 0,
        top: 60,
    },
    menuItem: {
        padding: 10,
    },
    menuText: {
        fontSize: 18,
    },
    menuButton: {
        position: 'absolute', // Icono de menú con posición absoluta
        top: 20, // Ajusta la posición superior según sea necesario
        right: 20, // Ajusta la posición derecha según sea necesario
        zIndex: 1, // Asegura que el icono esté por encima del resto del contenido
    },
    // moneyBar: {
    //     backgroundColor: 'white',
    //     borderWidth: 1,
    //     width: 150,
    //     marginLeft: 10,
    //     borderColor: 'black',
    //     paddingHorizontal: 10,
    //     paddingVertical: 5,
    //     borderRadius: 5,
    //     marginTop: 30,
    //     marginLeft:35
    // },
    
    FatherBoton: {
        alignItems: 'center',

    },
    cajaBoton: {
        backgroundColor: '#04d500',
        borderRadius: 15,
        paddingVertical: 20,
        width: 230,
        marginTop: 30,
        left:80
    },
    cajaBoton1: {
        backgroundColor: '#1d2027',
        borderRadius: 15,
        paddingVertical: 15,
        width: 150,
        left:120,
        marginTop: 20
    },
    TextoBoton: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },
    closeButton: {
        position: "absolute",
        top: 20,
        right: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },
    imageContainer: {
        borderWidth: 1,
        borderColor: "#CCCCCC",
        borderRadius: 10,
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 120,
        resizeMode: "cover",
        borderRadius: 10,
    },
    uploadButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
    },
    uploadText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
})