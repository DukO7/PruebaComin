import React, { Component, useState } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity,Alert } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SidebarModal from "./SidebarModal";
export default function Inversiones({ route }) {
    
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del SidebarModal
    const handleInvertirClick = () => {
        if (usuario.verificacion !== 1) {
          Alert.alert(
            'Verificación requerida',
            'Para realizar este proceso, primero debe verificar su cuenta.',
            [
              { text: 'OK', onPress: () => navigation.navigate('Documentos',{usuario: usuario,affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria}) }
            ]
          );
        } else {
          navigation.navigate('Documentos');
        }
      };
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
    const { usuario, affiliateBonus,datosafiliados,inversionesPorFecha,cuentaBancaria } = route.params;
    const handlePress = (screenName) => {
        navigation.navigate(screenName);
    };
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    const [imageError, setImageError] = useState(false);
    return (

        <View style={styles.container}>
            <View style={styles.header1}>
                
            <View style={styles.profileInfo}>
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
                uri: `http://192.168.1.69:3000/uploads/${usuario.id}.jpg`,
              }}
              style={styles.profileImage}
              onError={() => setImageError(true)} // Manejar error de carga de imagen
            />
          )}
        <Text style={styles.textHeader1}>{usuario.nombre}</Text>
    </View>
                {/* Aquí puedes personalizar el contenido del header */}
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
                <View style={styles.textContainer}>
                    <Text style={styles.textDerecha}>Inversiones</Text>
                    <Text style={styles.textDerecha2}>Balance</Text>
                    <Text style={styles.textDerecha1}>$ {(usuario.saldo || 0) + (affiliateBonus || 0)}</Text>
                </View>
            </View>
            <View style={styles.containerDivider}>

                <View style={styles.divider} />
            </View>
            <View style={styles.archivo}>
                <Image source={require('../assets/archivo1.png')} style={styles.profileImage1}/>
                <Text style={{color:'white',marginLeft:10}}> Archivo Cargado </Text>
            </View>
            <View style={styles.barradoble}>
            <View style={styles.moneyBar}>
                
                <Text > Satrter </Text>
            </View>
            <View style={styles.moneyBar}>
               
                <Text >+500 </Text>
            </View>
            </View>
            <View style={styles.FatherBoton}>

                <TouchableOpacity style={styles.cajaBoton} onPress={handleInvertirClick} >

                    <Text style={styles.TextoBoton}>
                        Invertir
                    </Text>
                </TouchableOpacity>


            </View>
            <View style={styles.containernav}>
                <TouchableOpacity style={styles.leftIcon} onPress={() => navigation.navigate('Cartera', { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })}>
                    <Ionicons name="wallet" size={30} color="white" />
                    <Text style={styles.textnavbar}>Cartera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.centerIcon} onPress={() => navigation.navigate('Inversiones', { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })}>
                    <Ionicons name="analytics" size={30} color="#7494b3" />
                    <Text style={styles.textnavbar2}>Inversiones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightIcon} onPress={() => navigation.navigate('Retirar', { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })}>
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
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 10,
        width: '95%',

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
    moneyBar: {
        backgroundColor: 'white',
        borderWidth: 1,
        width: 150,
        marginLeft: 10,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 30,
        marginLeft:35
    },
    moneyText: {
        marginLeft: 60,
        fontSize: 22,
        fontWeight: 'bold',
        paddingLeft: 10
    },
    FatherBoton: {
        alignItems: 'center',

    },
    cajaBoton: {
        backgroundColor: '#04d500',
        borderRadius: 15,
        paddingVertical: 20,
        width: 230,
        marginTop: 20
    },
    TextoBoton: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },

})