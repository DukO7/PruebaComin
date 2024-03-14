import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Alert, Switch } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CustomAlert from './CustomAlert';
import * as LocalAuthentication from 'expo-local-authentication';
import jwtDecode from 'jwt-decode';
export default function Login(props) {
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [useBiometric, setUseBiometric] = useState(true);

    useEffect(() => {
        
        const loadSavedCredentials = async () => {
            try {
                const savedUsername = await AsyncStorage.getItem("email");
                const savedPassword = await AsyncStorage.getItem("password");
                
                if (savedUsername && savedPassword) {
                    setEmail(savedUsername);
                    setPassword(savedPassword);
                    setRememberMe(true);
                    
                }
            } catch (error) {
                console.error("Error loading saved credentials: ", error);
            }
        };

        loadSavedCredentials();

        // Check for biometric authentication availability
        LocalAuthentication.hasHardwareAsync()
            .then(hasHardware => {
                if (hasHardware) {
                    LocalAuthentication.supportedAuthenticationTypesAsync()
                        .then(supportedTypes => {
                            if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                                setUseBiometric(false);
                            }
                        })
                        .catch(error => console.log('Error checking supported authentication types:', error));
                }
            })
            .catch(error => console.log('Error checking hardware availability:', error));

        // Clean up resources when unmounting the component
        return () => {
            // No cleanup needed for LocalAuthentication
        };
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleBiometric = () => {
        setUseBiometric(!useBiometric);
    };

    const saveToken = async (token) => {
        try {
          if (token) {
            await AsyncStorage.setItem("token", token);
            console.log("Token guardado correctamente");
          } else {
            console.error("El token es nulo o indefinido");
          }
        } catch (error) {
          console.error("Error al guardar el token:", error);
        }
      };

      const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.1.72:3000/login', { correo_electronico: email, password });
            console.log('Respuesta del servidor:', response.data);
            if (response.status === 200 && response.data) {
                if (response.data.usuario) {
                    const usuario = response.data.usuario;
                    console.log('esto recibo de verificado',usuario.correoElectronicoVerificado)
                    if (usuario.correoElectronicoVerificado == 0) {
                        Alert.alert('Error', 'Tu correo electrónico aún no ha sido verificado. Por favor, verifica tu correo electrónico antes de iniciar sesión.');
                        return; // Detener el proceso de inicio de sesión
                    }else{
                        await saveToken(response.data.token); // Guardar el token en AsyncStorage
                        await AsyncStorage.setItem("usuario", JSON.stringify(usuario));
                        console.log('datos recibidos de handleLogin', JSON.stringify(usuario));
                        console.log('datos del token recibidos o guarados', response.data.token);
        
                        // Verificar si el usuario tiene afiliados y actualizar su saldo
                        const afiliados = await axios.post('http://192.168.1.72:3000/update-balance', {usuarioId: usuario.id,codigoAfiliado: usuario.codigo_afiliado});
                        console.log('este dato se envia a update',usuario.codigo_afiliado);
                        const affiliateBonus= afiliados.data.affiliateBonus;
                        const datosafiliados = afiliados.data.datosafiliados;
                        const inversionesPorFecha= afiliados.data.inversionesPorFecha;
                        const cuentaBancaria=afiliados.data.cuenta;
                        console.log('son datos de banco:',cuentaBancaria);
                        console.log('este es el usuario que se manda:',usuario.id);
                        console.log('Inversiones por fecha:',inversionesPorFecha);
                        console.log('este es el que se envia de los afiliados:',affiliateBonus,datosafiliados);
                        await login(usuario,affiliateBonus,datosafiliados,inversionesPorFecha,cuentaBancaria);
                    }
    
                   
                } else {
                    Alert.alert('Error', 'No se recibieron los datos del usuario');
                }
            } else {
                Alert.alert('Error', 'No se recibieron los datos del usuario o el token');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            Alert.alert('Error', 'Error al iniciar sesión');
        }
    };
    

    const login = async (usuario,affiliateBonus,datosafiliados,inversionesPorFecha,cuentaBancaria) => {
        try {
            setTimeout(() => {
                props.navigation.navigate('Home', { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria  });
                setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                    }, 3000);
            }, 2000);

            if (rememberMe) {
                try {
                    await AsyncStorage.setItem("correo_electronico", email);
                    await AsyncStorage.setItem("password", password);
                } catch (error) {
                    console.error("Error saving credentials: ", error);
                }
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'El usuario o la contraseña son incorrectas');
        }
    };
    const handleShowAlert = () => {
        // setShowAlert(true);
        // Aquí puedes realizar cualquier acción necesaria antes o después de mostrar el alerta
      };

      const verifyToken = (token) => {
        try {
            console.log('este es el token que se verificara: ',token);
            const decoded = jwtDecode(token);
          return decoded;
        } catch (error) {
          console.error('Error al verificar el token:', error);
          return null;
        }
      };

      
    
      
      const loginWithBiometric = async () => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticación biométrica requerida',
    });
    if (result.success) {
      // Si la autenticación biométrica es exitosa, envía el token al servidor
      const token = await AsyncStorage.getItem("token");
      console.log('token recuperado para loginwithbiometric', token);
      if (token) {
        // Verificar el token antes de enviarlo al servidor
        const decoded = token;
        if (decoded) {
          // Si el token es válido, envíalo al servidor
          const response = await axios.post('http://192.168.1.72:3000/autenticacion-biometrica', { token });
          if (response.status === 200) {
            // Si la autenticación biométrica es exitosa, navega a la pantalla principal
            props.navigation.navigate('Home');
          } else {
            // Manejar el caso si la autenticación biométrica falla en el servidor
            Alert.alert('Error', 'Autenticación biométrica fallida en el servidor');
          }
        } else {
          // Manejar el caso si el token no es válido
          Alert.alert('Error', 'El token de sesión no es válido');
        }
      } else {
        // Manejar el caso si no se encuentra el token en AsyncStorage
        Alert.alert('Error', 'No se encontró el token de sesión');
      }
    } else {
      // Si la autenticación biométrica falla, muestra un mensaje de error
      Alert.alert('Error', 'Autenticación biométrica fallida. Por favor, inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error en la autenticación biométrica:', error);
    Alert.alert('Error', 'Hubo un error en la autenticación biométrica. Por favor, inténtalo de nuevo.');
  }
};

    const handleLoginAndShowAlert = () => {
        handleLogin();
      };

    return (
        <View style={styles.father}>
            <CustomAlert visible={showAlert} message="Iniciando Sesión..." />
            <Text style={styles.Titulo}>
                INICIAR SESIÓN
            </Text>

            <View style={styles.tarjeta}>
                {!useBiometric && (
                    <View style={styles.cajaTexto}>
                        <TextInput placeholder='Usuario / ID' style={{ paddingHorizontal: 65 }} onChangeText={(text) => setEmail(text)}  autoCapitalize='none'/>
                        <Ionicons name='person' size={35} color='white' style={styles.iconoUsuario} />
                    </View>
                )}

                {!useBiometric && (
                    <View style={styles.cajaTexto}>
                        <TextInput
                            placeholder='Contraseña'
                            style={{ paddingHorizontal: 65 }}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            autoCapitalize='none'
                        />
                        <Ionicons name='lock-closed-outline' size={35} color='white' style={styles.iconoUsuario} />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconoMostrar}>
                            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={35} color='gray' />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.FatherBoton}>
                    {!useBiometric && (
                        <TouchableOpacity style={styles.cajaBoton} onPress={handleLoginAndShowAlert}>
                            <Text style={styles.TextoBoton}>
                                Entrar
                            </Text>
                        </TouchableOpacity>
                    )}

                    {useBiometric && (
                        <TouchableOpacity style={styles.cajaBoton} onPress={loginWithBiometric}>
                            <Text style={styles.TextoBoton}>
                                Entrar con Huella
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.checkbox}>
                    <View style={{ flexDirection: "row", alignItems: "center", color: 'white' }}>
                        <Text style={{ color: 'white' }}>Recordarme</Text>
                        <Switch
                            value={rememberMe}
                            onValueChange={(newValue) => setRememberMe(newValue)}
                        />
                    </View>

                    <Text style={styles.olvid}>
                        ¿Olvidaste tu usuario o contraseña?
                    </Text>
                </View>

                <View style={styles.checkbox}>
                    <View style={{ flexDirection: "row", alignItems: "center", color: 'white' }}>
                        <Text style={{ color: 'white' }}>Usar autenticación biométrica</Text>
                        <Switch
                            value={useBiometric}
                            onValueChange={toggleBiometric}
                        />
                    </View>
                </View>

                <View style={styles.divider}>
                </View>

                <View style={styles.checkbox}>
                    <Text style={styles.regis}>
                        ¿No tienes cuenta?
                    </Text>
                    <TouchableOpacity style={styles.registerButton} onPress={() => props.navigation.navigate('Registro')}>
                        <Text style={styles.TextoBoton2}>Registrate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    father: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1d2027'
    },
    profile: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: 'white'
    },
    tarjeta: {
        margin: 20,
        backgroundColor: '#1d2027',
        borderRadius: 20,
        width: '90%',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    cajaTexto: {
        paddingVertical: 17,
        backgroundColor: 'white',
        borderRadius: 15,
        marginVertical: 10
    },
    FatherBoton: {
        alignItems: 'center',
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
    Titulo: {
        color: 'white',
        fontSize: 30,
    },
    footerText: {
        color: 'white',
        margin: 20,
        marginLeft: 8,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        color: 'white'
    },
    olvid: {
        color: 'white'
    },
    divider: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        marginTop: 20,
    },
    regis: {
        color: 'white',
        alignItems: 'center',
        textAlign: 'center',
        paddingLeft: 60,
        marginTop: 15
    },
    TextoBoton2: {
        marginTop: 15,
        fontSize: 16,
        color: '#394554',
        textDecorationLine: 'underline',
        paddingLeft: 10,
        textAlign: 'center'
    },
    iconoMostrar: {
        position: 'absolute',
        right: 10,
        top: 15
    },
    iconoUsuario: {
        position: 'absolute',
        left: 2,
        top: 4,
        backgroundColor: '#1d2027',
        padding: 10,
        borderRadius: 10,
    }
});
