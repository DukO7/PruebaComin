import React, { Component, useState,useEffect } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity, Alert, Linking, TextInput,Modal,ActivityIndicator } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import SidebarModal from "./SidebarModal";
import axios from 'axios';
import { openBrowserAsync } from 'expo-web-browser';
import CustomAlert from './CustomAlert';
import moment from 'moment';
import { Picker } from '@react-native-picker/picker';
import { Skeleton } from '@rneui/themed';
export default function Inversiones({ route }) {
    const [selectedPlan, setSelectedPlan] = useState('');
    const [selectedAdditionalPlan, setSelectedAdditionalPlan] = useState('');
    const [cuentaBancaria1, SetcuentaBancaria] = useState(0);
    const isFocused = useIsFocused();
    const { usuario, affiliateBonus, datosafiliados, inversionesPorFecha} = route.params;
    const [exchangeRates, setExchangeRates] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    // const [updatedUser, setUpdatedUser] = useState(usuario);
    // useEffect(() => {
    //     const fetchUserData = async () => {
    //       try {
    //         const response = await axios.post('http://192.168.1.71:3000/usuarios', {
    //             usuarioId: usuario.id,
    //         });
    //         console.log('datos regresados de usuarios', response.data);
    //         if (response.data.data) {
    //           setUpdatedUser(response.data.data);
    //           console.log('son los datos que recibo:', updatedUser);
    //         } else {
    //           console.error('No se recibieron datos del servidor');
    //         }
    //       } catch (error) {
    //         console.error(error);
    //       }
    //     };
    //     fetchUserData();
    //   }, [usuario]);
    // console.log('son los datos que recibo:',updatedUser);
    useEffect(() => {
        const fetchData = async () => {
            try {
              // Supongamos que obtienes el usuario de alguna manera
              const afiliados = await axios.post('https://a3af-2806-10a6-16-2dc5-813d-4b98-3ea8-9707.ngrok-free.app/update-balance', { usuarioId: usuario.id, codigoAfiliado: usuario.codigo_afiliado, porcentaje:usuario.porcentaje,porcentaje_afiliado:usuario.porcentaje_afiliado });
              SetcuentaBancaria (afiliados.data.cuenta);
              console.log('Esto se recibe1:', cuentaBancaria1);
            } catch (error) {
              console.error('Error al obtener los datoss:', error);
            }
          };
          fetchData();
        fetchExchangeRates();

        const timeout = setTimeout(() => {
            setIsLoading(false);
          }, 1000);
          return () => clearTimeout(timeout);
      }, [isFocused]);


      const fetchExchangeRates = async () => {
        try {
          const response = await fetch('https://open.er-api.com/v6/latest/USD');
          const data = await response.json();
          setExchangeRates(data.rates);
        } catch (error) {
          console.error('Error fetching exchange rates:', error);
        }
      };
    
      const calculateMXNValue = (usdValue) => {
        return Math.round(usdValue * exchangeRates.MXN);
      };
    const [showAlert, setShowAlert] = useState(false);
    const [textInputValue, setTextInputValue] = useState("");
    
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del SidebarModal
    // const PaymentService = {
    //     async createPayment() {
    //         const url = "https://api.mercadopago.com/checkout/preferences";

    //         const body = {
    //             payer_email: usuario.correo_electronico,
    //             items: [
    //                 {
    //                     title: "Inversion",
    //                     description: "Inversion Fintech",
    //                     picture_url: "http://www.myapp.com/myimage.jpg",
    //                     category_id: "services",
    //                     quantity: 1,
    //                     unit_price: parseFloat(textInputValue)
    //                 }
    //             ],
    //             back_urls: {
    //                 failure: "/failure",
    //                 pending: "/pending",
    //                 success: "http://localhost:8081/Inversiones"
    //             }
    //         };

    //         const payment = await axios.post(url, body, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer APP_USR-6676272883606931-030303-f63bc9cd7ddd140d4497371a37bd2576-1708323573`
    //             }
    //         });

    //         return payment;
    //     },
    //     checkPaymentStatus(preferenceId) {
    //         const url = `https://api.mercadopago.com/checkout/preferences/${preferenceId}`;
        
    //         axios.get(url, {
    //           headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer APP_USR-6676272883606931-030303-f63bc9cd7ddd140d4497371a37bd2576-1708323573`
    //           }
    //         }).then((response) => {
    //           const { status } = response.data;
        
    //           if (status === 'approved') {
    //             console.log('El pago fue exitoso.');
    //           } else if (status === 'pending') {
    //             console.log('El pago está pendiente.');
    //           } else if (status === 'rejected') {
    //             console.log('El pago fue rechazado.');
    //           }
    //         }).catch((error) => {
    //           console.error(error);
    //         });
    //       }
    // };


    
// const CoinbaseWalletSDK = require('@coinbase/wallet-sdk');
// const fromAddress='35rESwPXsvdS7MS8nZsUPWQPdvsk6ZifzT';
// const toAddress='35rESwPXsvdS7MS8nZsUPWQPdvsk6ZifzT';
// const amount='100';
// const currency='MXN';
// const client = new CoinbaseWalletSDK.Client({
//   apiKey: 'CxrVfc5bLoldXnLS',
//   apiSecret: 'tmH3WdF8kgRDGfdMXQHfKSwBLWM2upMv'
// });

// const createTransaction = async (req, res) => {
//   try {
//     const { fromAddress, toAddress, amount, currency } = req.body;

//     // Crear una nueva transacción
//     const transaction = await client.paymentMethods.send({
//       paymentMethodId: fromAddress,
//       amount: {
//         amount: parseFloat(amount).toString(),
//         currency
//       },
//       to: toAddress,
//       description: 'Depósito con criptomonedas'
//     });

//     // Verificar que la transacción se haya creado correctamente
//     if (transaction.id) {
//       res.status(201).json({ message: 'Transacción creada exitosamente', transaction });
//     } else {
//       res.status(400).json({ error: 'Error al crear la transacción' });
//     }
//   } catch (error) {
//     console.error('Error al crear la transacción:', error);
//     res.status(500).json({ error: 'Error interno del servidor' });
//   }
// };
    const handlePress3 = async () => {
        try {
            if(selectedAdditionalPlan){
                setShowAlert(true);
                const payment = await PaymentService.createPayment();
                console.log(payment.data.init_point);
                const timestamp = new Date().getTime();
                const fechaMySQL = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
                console.log('esta es la fecha que guardara:',timestamp);
                await axios.post('https://a3af-2806-10a6-16-2dc5-813d-4b98-3ea8-9707.ngrok-free.app/Act_inversion', {
                    usuarioId: usuario.id,
                    saldo: selectedAdditionalPlan, 
                    fecha_inicio:fechaMySQL ,
                });
                console.log('insertado con exito');
                await openBrowserAsync(payment.data.init_point);
                PaymentService.checkPaymentStatus(payment.data.id);
                console.log('datos recibidos',payment.data.id)
                setShowAlert(false);
            }else{
                Alert.alert('No hay cantidad seleccionada')
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleInvertirClick = () => {
        console.log('antes de verificar', usuario.verificado_ine)
        const entero = parseInt(usuario.verificado_ine, 10);
        console.log('antes de segundo', entero)
        if (entero == 0) {
            alert('Verificación requerida, Para realizar este proceso, primero debe verificar su cuenta.');
            navigation.navigate('IneyCurp', {
                usuario: usuario,
                affiliateBonus: affiliateBonus,
                datosafiliados: datosafiliados,
                inversionesPorFecha: inversionesPorFecha,
                cuentaBancaria: cuentaBancaria1,
            });
        } else {
            if(selectedPlan){
                navigation.navigate('Pasarela', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria1,textInputValue:selectedPlan,textInputValue1:selectedAdditionalPlan });
            }else{
                Alert.alert('Para continuar por favor introduce monto a invertir');
            }
            
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
        closeModal(); 
        navigation.navigate(screen, { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria1 });
    };

    const navigation = useNavigation();

    const handlePress = (screenName) => {
        navigation.navigate(screenName);
    };
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    const [imageError, setImageError] = useState(false);

    const SkeletonScreen = ()=>{
        return(
            <View style={styles.container}>
            <View style={styles.header1}>
            <CustomAlert visible={showAlert} message="Redirigiendo..." />
            <LoadingModal visible={isLoading} />
            <View style={styles.profileInfo}>
                    {imageError ? (
                        <Image
                            source={require("../assets/usuario1.jpg")}
                            style={styles.profileImage}
                        />
                    ) : (
                        
                        <Image
                            source={{
                                uri: `https://a3af-2806-10a6-16-2dc5-813d-4b98-3ea8-9707.ngrok-free.app/uploads/${usuario.id}.jpg`,
                            }}
                            style={styles.profileImage}
                            onError={() => setImageError(true)}
                        />
                    )}
                    <Text style={styles.textHeader1}>{usuario.nombre}</Text>
                </View>
                <View style={styles.containermenu}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => {
                            if (isModalVisible) {
                                
                                closeModal();
                            } else {
                                
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
                <Skeleton
    animation="wave"
    width={130}
    height={20}
    style={styles.textDerecha}
  />
<Skeleton
    animation="wave"
    width={130}
    height={20}
    style={styles.textDerecha2}
  />
          <Skeleton
    animation="wave"
    width={130}
    height={20}
    style={styles.textDerecha1}
  />          
                    
                </View>
            </View>
            <View style={styles.containerDivider}>

                <View style={styles.divider} />
            </View>
            {/* <View style={styles.archivo}>
                <Image source={require('../assets/archivo1.png')} style={styles.profileImage1} />
                <Text style={{ color: 'white', marginLeft: 10 }}> Archivo Cargado </Text>
            </View> */}
             <View style={styles.picker}>
             <Skeleton
    animation="wave"
    width={120}
    height={20}
    style={styles.picker}
  />  
        <Skeleton
    animation="wave"
    width={130}
    height={20}
    style={styles.picker}
  />  
    </View>
            {/* <View style={styles.barradoble}>
                <TextInput
                    style={styles.moneyBar}
                    onChangeText={setTextInputValue}
                    value={textInputValue}
                    placeholder="Monto a invertir"
                    keyboardType="numeric"
                />
            </View> */}

            <View style={styles.FatherBoton}>

                <TouchableOpacity style={styles.cajaBoton} onPress={handleInvertirClick} >

                    <Text style={styles.TextoBoton}>
                        Invertir
                    </Text>
                </TouchableOpacity>

            </View>
            <View style={styles.containernav}>
                <TouchableOpacity style={styles.leftIcon} onPress={() => navigation.navigate('Cartera', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria1 })}>
                    <Ionicons name="wallet" size={30} color="white"/>
                    <Text style={styles.textnavbar}>Cartera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.centerIcon} onPress={() => navigation.navigate('Inversiones', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria1 })}>
                    <Ionicons name="analytics" size={30} color="#7494b3"/>
                    <Text style={styles.textnavbar2}>Inversiones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightIcon} onPress={() => navigation.navigate('Retirar', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha })}>
                    <Ionicons name="arrow-back" size={30} color="white"/>
                    <Text style={styles.textnavbar2}>Retirar</Text>
                </TouchableOpacity>
            </View>
            <SidebarModal
                isVisible={isModalVisible}
                onClose={closeModal} 
                onPress={handlePress1} 
                usuario={usuario}
            />
        </View>
        );
    }
    const LoadingModal = ({ visible }) => (
        <Modal transparent={true} visible={visible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          </View>
        </Modal>
      );

      const starterPlan = { mxnValue: calculateMXNValue(500), additionalValue: 5.7, valorAfiliado: 6 };
    const MainScreen = ()=>{
        return(
            <View style={styles.container}>
            <View style={styles.header1}>
            <CustomAlert visible={showAlert} message="Redirigiendo..." />
            
                <View style={styles.profileInfo}>
                    {imageError ? (
                        <Image
                            source={require("../assets/usuario1.jpg")}
                            style={styles.profileImage}
                        />
                    ) : (
                        
                        <Image
                            source={{
                                uri: `https://a3af-2806-10a6-16-2dc5-813d-4b98-3ea8-9707.ngrok-free.app/uploads/${usuario.id}.jpg`,
                            }}
                            style={styles.profileImage}
                            onError={() => setImageError(true)}
                        />
                    )}
                    <Text style={styles.textHeader1}>{usuario.nombre}</Text>
                </View>
                <View style={styles.containermenu}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => {
                            if (isModalVisible) {
                                
                                closeModal();
                            } else {
                                
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
                    <Text style={styles.textDerecha1}>$ {cuentaBancaria1.saldo_afiliados}</Text>
                </View>
            </View>
            <View style={styles.containerDivider}>

                <View style={styles.divider} />
            </View>
            {/* <View style={styles.archivo}>
                <Image source={require('../assets/archivo1.png')} style={styles.profileImage1} />
                <Text style={{ color: 'white', marginLeft: 10 }}> Archivo Cargado </Text>
            </View> */}
             <View style={styles.picker}>
      <Picker
        selectedValue={selectedPlan}
        onValueChange={(itemValue) => setSelectedPlan(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Seleccionar plan" value="" />
        <Picker.Item label="STARTER" value={calculateMXNValue(500)}/>
        <Picker.Item label="AVANZADO" value={calculateMXNValue(1000)} />
        <Picker.Item label="PREMIER" value={calculateMXNValue(3500)} />
      </Picker>
      <Picker
        selectedValue={selectedAdditionalPlan}
        onValueChange={(itemValue) => setSelectedAdditionalPlan(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Seleccionar plan adicional" value="" />
        <Picker.Item label={`+200 USD (aprox. MXN ${calculateMXNValue(200)})`} value={calculateMXNValue(200)} />
        <Picker.Item label={`+500 USD (aprox. MXN ${calculateMXNValue(500)})`} value={calculateMXNValue(500)} />
        <Picker.Item label={`+1000 USD (aprox. MXN ${calculateMXNValue(1000)})`} value={calculateMXNValue(1000)} />
        <Picker.Item label={`+2500 USD (aprox. MXN ${calculateMXNValue(2500)})`} value={calculateMXNValue(2500)} />
        <Picker.Item label={`+5000 USD (aprox. MXN ${calculateMXNValue(5000)})`} value={calculateMXNValue(5000)} />
        <Picker.Item label={`+10000 USD (aprox. MXN ${calculateMXNValue(10000)})`} value={calculateMXNValue(10000)} />
      </Picker>
    </View>
            {/* <View style={styles.barradoble}>
                <TextInput
                    style={styles.moneyBar}
                    onChangeText={setTextInputValue}
                    value={textInputValue}
                    placeholder="Monto a invertir"
                    keyboardType="numeric"
                />
            </View> */}

            <View style={styles.FatherBoton}>

                <TouchableOpacity style={styles.cajaBoton} onPress={handleInvertirClick} >

                    <Text style={styles.TextoBoton}>
                        Invertir
                    </Text>
                </TouchableOpacity>


            </View>
            <View style={styles.containernav}>
                <TouchableOpacity style={styles.leftIcon} onPress={() => navigation.navigate('Cartera', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria1 })}>
                    <Ionicons name="wallet" size={30} color="white"/>
                    <Text style={styles.textnavbar}>Cartera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.centerIcon} onPress={() => navigation.navigate('Inversiones', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria1 })}>
                    <Ionicons name="analytics" size={30} color="#7494b3"/>
                    <Text style={styles.textnavbar2}>Inversiones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightIcon} onPress={() => navigation.navigate('Retirar', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha })}>
                    <Ionicons name="arrow-back" size={30} color="white"/>
                    <Text style={styles.textnavbar2}>Retirar</Text>
                </TouchableOpacity>
            </View>
            <SidebarModal
                isVisible={isModalVisible}
                onClose={closeModal} 
                onPress={handlePress1} 
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
    archivo: {
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
    picker: {
        width: '100%',
        marginBottom: 20,
        borderColor: '#ccc',
        borderRadius: 10,
        
      },
     
    barradoble: {
        alignItems: 'center',
        right: 20
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
        top: 20,
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
        textAlign: 'center',
        marginLeft: 10,
        borderColor: 'black',
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 30,
        marginLeft: 35
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
        marginTop: 50
    },
    TextoBoton: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },

})