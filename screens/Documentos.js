import React, { Component, useState, useEffect } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity, Alert, Modal, ActivityIndicator } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SidebarModal from "./SidebarModal";
import { Skeleton } from '@rneui/themed';
export default function Documentos({ route }) {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);
    const [showAlert, setShowAlert] = useState(true); // Estado para controlar la visibilidad del alert
    const navigation = useNavigation();
    const { usuario, affiliateBonus, datosafiliados, cuentaBancaria } = route.params;
    const [imageError1, setImageError1] = useState(false);

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
        navigation.navigate(screen, { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, cuentaBancaria: cuentaBancaria });
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

        <View style={styles.container}>
            <View style={styles.header1}>
                <LoadingModal visible={isLoading} />
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
                                uri: `http://192.168.1.72:3000/uploads/${usuario.id}.jpg`,
                            }}
                            style={styles.profileImage}
                            onError={() => setImageError1(true)} // Manejar error de carga de imagen
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
                    <Text style={styles.title}>Verificación de Identidad</Text>
                    <Text style={styles.subtitle}>Interfaz para saber el estatus de mi documentacion</Text>
                </View>
            </View>

            <View style={styles.containerDivider}>

                <View style={styles.divider} />
                {showAlert && (usuario.verificado_ine === 0 || usuario.verificado_curp === 0) && (
                    Alert.alert(
                        "Verificar Datos",
                        "Para realizar inversiones y depósitos, debes verificar tus datos.",

                        [
                            {
                                text: "OK",
                                onPress: () => setShowAlert(false),
                            }
                        ]
                    )
                )}
            </View>

            {/* {usuario.verificado_ine === 0 && (
                <TouchableOpacity style={styles.cajaBoton} onPress={() => navigation.navigate('Verificacion', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados })}>
                    <Text style={styles.TextoBoton}>
                        Verificar INE
                    </Text>
                </TouchableOpacity>
            )} */}

            {/* {usuario.verificado_curp === 0 && (
                <TouchableOpacity style={styles.cajaBoton} onPress={() => navigation.navigate('VerificacionC', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados })}>
                    <Text style={styles.TextoBoton}>
                        Verificar CURP
                    </Text>
                </TouchableOpacity>
            )} */}

            {isLoading ? ( // Si isLoading es true, muestra el esqueleto
                <>

                    <View style={{ flexDirection: 'row', left: 70, marginTop: 40 }}>
                        <Skeleton
                            animation="wave"
                            width={240}
                            height={20}

                        />
                    </View>


                    <View style={{ flexDirection: 'row', left: 70, marginTop: 20 }}>
                        <Skeleton
                            animation="wave"
                            width={240}
                            height={20}

                        />
                    </View>

                </>
            ) : ( // Si isLoading es false, muestra el contenido real
                <>
                    {usuario.verificado_ine === 1 && (
                        <View style={{ flexDirection: 'row', left: 70, marginTop: 40 }}>
                            <Text style={styles.TextoValidado}>
                                Documento INE validado
                            </Text>
                            <Ionicons name="checkmark-circle-outline" size={24} color="green" />
                        </View>
                    )}
                    {usuario.verificado_curp === 1 && (
                        <View style={{ flexDirection: 'row', left: 70, marginTop: 20 }}>
                            <Text style={styles.TextoValidado}>
                                Documento CURP validado
                            </Text>
                            <Ionicons name="checkmark-circle-outline" size={24} color="green" />
                        </View>
                    )}
                </>
            )}
            <View>


            </View>

            <View style={styles.containernav}>
                <TouchableOpacity style={styles.leftIcon} onPress={() => navigation.navigate('Cartera', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, cuentaBancaria: cuentaBancaria })}>
                    <Ionicons name="wallet" size={30} color="white" />
                    <Text style={styles.textnavbar}>Cartera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.centerIcon} onPress={() => navigation.navigate('Inversiones', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, cuentaBancaria: cuentaBancaria })}>
                    <Ionicons name="analytics" size={30} color="white" />
                    <Text style={styles.textnavbar2}>Inversiones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightIcon} onPress={() => navigation.navigate('Retirar', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, cuentaBancaria: cuentaBancaria })}>
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

    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
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

    cajaBoton: {
        backgroundColor: '#04d500',
        borderRadius: 15,
        paddingVertical: 20,
        width: 230,
        marginTop: 30,
        left: 80
    },

    TextoBoton: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },
    TextoValidado: {
        textAlign: 'center',
        color: 'black',
        fontSize: 20
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

    image: {
        width: 200,
        height: 120,
        resizeMode: "cover",
        borderRadius: 10,
    },

})