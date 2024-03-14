import React, { Component, useState, useRef, useEffect } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Alert } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SidebarModal from "./SidebarModal";
import axios from 'axios';
import CustomAlert from './CustomAlert';
import moment from 'moment';
import differenceInDays from 'date-fns/differenceInDays';
export default function Retirar({ route }) {
    const { usuario, affiliateBonus, datosafiliados, inversionesPorFecha, cuentaBancaria } = route.params;
    const handleInvertirClick = () => {
        const currentDate = new Date();
        const userCreationDate = new Date(usuario.fecha_creacion);
        const daysSinceCreation = differenceInDays(currentDate, userCreationDate);
        console.log('este es el dia',daysSinceCreation);
        // Verificar si la cuenta está verificada
        const isAccountVerified = parseInt(usuario.verificado_ine, 10) !== 0;
    
        // Obtener la fecha de creación de la cuenta (asumiendo que está en el objeto 'usuario')
        const accountCreationDate = new Date(usuario.fecha_creacion);

    
        // Calcular la diferencia en milisegundos entre la fecha actual y la fecha de creación de la cuenta
        const differenceInMilliseconds = currentDate.getTime() - accountCreationDate.getTime();
    
        // Calcular la diferencia en días
        // const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
    
        if (!isAccountVerified) {
            // Mostrar alerta si la cuenta no está verificada
            Alert.alert(
                'Verificación requerida',
                'Para realizar este proceso, primero debe verificar su cuenta.',
                [
                    { text: 'OK', onPress: () => navigation.navigate('IneyCurp', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria }) }
                ]
            );
        } else if (daysSinceCreation < 3) {
            // Mostrar alerta si la cuenta tiene menos de 3 días de antigüedad
            Alert.alert(
                'Espera requerida',
                'Para realizar retiros, tu cuenta debe tener al menos 3 días de antigüedad.',
                [{ text: 'OK' }]
            );
        } else {
            // Si la cuenta está verificada y tiene al menos 3 días de antigüedad, proceder con el retiro
            handleRetirar();
        }
    };
    
    const [showAlert, setShowAlert] = useState(false);
    const navigation = useNavigation();
    
    const drawer = useRef(null);
    const [drawerKey, setDrawerKey] = useState(0);
    const [drawerPosition, setDrawerPosition] = useState('left');
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del SidebarModal

    const openModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const handlePress1 = (screen) => {
        console.log("Navigating to", screen);
        closeModal(); // Cierra el SidebarModal después de presionar un elemento
        navigation.navigate(screen, { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria });
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Esta función se ejecuta cada vez que la pantalla obtiene el enfoque
            // Cambiamos ligeramente la clave del DrawerLayoutAndroid para forzar una actualización
            setDrawerKey(key => key + 1);
            setDrawerPosition('left');
        });

        return unsubscribe;
    }, [navigation]);

    const navigationView = () => (
        <View style={[styles.container, styles.navigationContainer]}>
            <View style={styles.profileInfo}>
                <Image
                    source={{ uri: `http://192.168.1.72:3000/uploads/${usuario.id}.jpg` }}
                    style={styles.profileImageDraw}
                />
            </View>

            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Home', { usuario: usuario })}>
                <Text style={styles.menuText}>Mis datos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} >
                <Text style={styles.menuText1}>Tarjetas</Text>
            </TouchableOpacity>
        </View>
    );
    const handlePress = (screenName) => {
        navigation.navigate(screenName);
    };
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    const openDrawer = () => {
        drawer.current.openDrawer(); // Método para abrir el drawer
    };
    const [imageError, setImageError] = useState(false);
    const [amount, setAmount] = useState('');

    const formatAmount = (value) => {
        // Remover comas existentes para que no interfieran con el formateo
        value = value.replace(/,/g, '');
        // Convertir el valor a un número si no está vacío
        let number = value.trim() === '' ? 0 : parseFloat(value);
        // Formatear el número con comas para separar los miles
        return number.toLocaleString('en-US');
    };

    const handleChange = (text) => {
        setAmount(text);
      };
      const handleRetirar = async () => {
        if(amount){
            setShowAlert(true);
            console.log('se procede a retirar: ',amount);
            console.log('se envia saldo total:',usuario.saldo+affiliateBonus);
            const timestamp = new Date().getTime();
            const fechaMySQL = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
            const datos = await axios.post('http://192.168.1.72:3000/Retirar', {
                usuarioId: usuario.id,
                saldo: amount, 
                saldototal:usuario.saldo+affiliateBonus,
                fecha_inicio:fechaMySQL ,
            });
            
            console.log('fue un exito',datos.data.alerta);
            if(datos.data.alerta==1){
                setShowAlert(false);
                Alert.alert('Monto retirado exitosamente')
            }
            
        }
        else{
            Alert.alert('No haz insertado monto a retirar');
        }
      }
    
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.containerDraw}>
            <CustomAlert visible={showAlert} message="Retirando..." />
            </View>
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
                                    uri: `http://192.168.1.72:3000/uploads/${usuario.id}.jpg`,
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
                        <Text style={styles.textDerecha}>RETIRAR</Text>
                        <Text style={styles.textDerecha2}>Balance</Text>
                        <Text style={styles.textDerecha1}>$ {cuentaBancaria.saldo_afiliados}</Text>
                    </View>
                </View>
                <View style={styles.containerDivider}>

                    <View style={styles.divider} />
                </View>
                <View style={styles.cajaTexto}>
                    <TextInput
                        style={[styles.moneyBar, { textAlign: 'right' }]}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                            // Formatear el texto y actualizar el estado
                            setAmount(formatAmount(text));
                        }}
                        value={amount}
                    />
                    <Image source={require('../assets/moneda.png')} style={styles.iconoUsuario} />
                    <Text style={styles.moneyText1}>  Monto A Retirar </Text>
                </View>
                <View style={styles.FatherBoton}>
                    <TouchableOpacity style={styles.cajaBoton} >

                        <Text style={styles.TextoBoton} onPress={handleInvertirClick}>
                            Retirar
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.containernav}>
                    <TouchableOpacity style={styles.leftIcon} onPress={() => navigation.navigate('Cartera', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria })}>
                        <Ionicons name="wallet" size={30} color="white" />
                        <Text style={styles.textnavbar}>Cartera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.centerIcon} onPress={() => navigation.navigate('Inversiones', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria })}>
                        <Ionicons name="analytics" size={30} color="white" />
                        <Text style={styles.textnavbar2}>Inversiones</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rightIcon} onPress={() => navigation.navigate('Retirar', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria })}>
                        <Ionicons name="arrow-back" size={30} color="#7494b3" />
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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',

    },
    cajaTexto: {
        paddingVertical: 17,
        backgroundColor: 'white',
        borderRadius: 15,flex: 1,
        marginVertical: 10
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
        marginTop: 40
    },

    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 80,
        marginLeft: 20,
        top: 20,
        left: 0,
        borderColor: 'white',
        borderWidth: 2,
    },
    profileImageDraw: {
        width: 100,
        height: 100,
        borderRadius: 80,
        marginLeft: 50,
        top: 40,
        left: 0,
        borderColor: 'white',
        borderWidth: 3,
    },


    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
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

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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

    menu: {
        backgroundColor: 'gray',
        borderRadius: 5,
        padding: 0,
        top: 60,
    },
    menuItem: {
        marginTop: 50,
        marginLeft: 20
    },
    menuText: {
        fontSize: 18,
        color: 'white',
        right: 12,
        top: 10,
        paddingVertical: 10, // Espacio vertical alrededor del texto
        paddingHorizontal: 50, // Espacio horizontal alrededor del texto
        backgroundColor: '#333', // Color de fondo del texto
        borderRadius: 5,
    },
    menuText1: {
        fontSize: 18,
        color: 'white',
        right: 12,
        bottom: 15,
        paddingVertical: 10, // Espacio vertical alrededor del texto
        paddingHorizontal: 50, // Espacio horizontal alrededor del texto
        backgroundColor: '#333', // Color de fondo del texto
        borderRadius: 5,
    },
    menuButton: {
        position: 'absolute', // Icono de menú con posición absoluta
        top: 20, // Ajusta la posición superior según sea necesario
        right: 20, // Ajusta la posición derecha según sea necesario
        zIndex: 1, // Asegura que el icono esté por encima del resto del contenido
    },
    moneyBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        width: 300,
        marginLeft: 50,
        borderColor: 'black',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 30,
        textAlign: 'right'
    },

    moneyText1: {
        marginLeft: 80,
        fontSize: 18,
        bottom: 32
    },
    FatherBoton: {
        flex:2,
        alignItems: 'center',
        top:'45%',
        left:'20%',
        position:'absolute'

    },
    cajaBoton: {
        backgroundColor: '#7192b3',
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
    navigationContainer: {
        backgroundColor: '#ecf0f1',
    },
    containerDraw: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        position: 'absolute', top: 0, zIndex: 2
    },

    navigationContainer: {
        backgroundColor: '#1d2027',
    },
    iconoUsuario: {
        position: 'absolute',
        left: 60,
        top: 55,
        padding: 10,
        borderRadius: 10,
    }
})