import React, { Component, useState } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity,Share,ScrollView } from "react-native"
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SidebarModal from "./SidebarModal";
export default function Afiliados({ route }) {
    const navigation = useNavigation();
    const { usuario, affiliateBonus, datosafiliados, cuentaBancaria, inversionesPorFecha } = route.params || {};

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
    const compartirNumero = async () => {
        try {
          const result = await Share.share({
            message: `¡Mi número de afiliado es: *${usuario.codigo_afiliado}*! Registrate con el y obten grandes beneficios! usa el enlace:  `+`https://appcomin.com/registro?codigo_afiliado=${encodeURIComponent(usuario.codigo_afiliado)}`
          });
    
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // Compartido con actividad específica (por ejemplo, WhatsApp)
              console.log(`Compartido con actividad: ${result.activityType}`);
            } else {
              // Compartido
              console.log('Compartido correctamente');
            }
          } else if (result.action === Share.dismissedAction) {
            // Cancelado
            console.log('Compartir cancelado');
          }
        } catch (error) {
          console.error('Error al compartir:', error.message);
        }
      };
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
         navigation.navigate(screen, { usuario: usuario,affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria });
      };
    return (

        <View style={styles.container}>
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
                    <Text style={styles.textDerecha}>¡Tu número de afiliado! Compártelo con hasta 7 personas y recibe un % de beneficio por cada uno que se una.</Text>
                    <Text style={styles.textDerecha2}>Numero:</Text>
                    <Text style={styles.textDerecha1}>{usuario.codigo_afiliado}</Text>
                </View>
                
            </View>
            <TouchableOpacity style={styles.cajaBoton1} onPress={compartirNumero}>
        <Text style={styles.TextoBoton}>Compartir</Text>
      </TouchableOpacity>
            <View style={styles.containerDivider}>

                <View style={styles.divider} />
            </View>
            <View>
  <View style={{flex: 1,height:10}}>
  <Text style={{ alignItems: 'center', left: 135, fontSize: 22, top: 20 }}>Tus afiliados</Text>
  </View>
  {/* Iterar sobre los afiliados y mostrar su información */}
  <ScrollView style={{height: '45%', marginBottom:40}}>
  {datosafiliados.map((afiliado, index) => (
        <View style={styles.barradoble} key={index}>
          <View>
            {/* Mostrar la foto del afiliado */}
            {imageErrorss[index] ? (
              // Mostrar un icono en lugar de la imagen si hay un error
              <Image
                source={require("../assets/usuario1.jpg")}
                style={styles.profileImage2}
              />
            ) : (
              // Intenta cargar la imagen
              <Image
                source={{
                  uri: `http://192.168.1.72:3000/uploads/${afiliado.id}.jpg`,
                }}
                style={styles.profileImage2}
                onError={() => handleImageError(index)} // Manejar error de carga de imagen
              />
            )}
          </View>
      <View style={styles.moneyBar}>
        {/* Mostrar el nombre del afiliado */}
        <Text style={{color:'white'}}>{afiliado.nombre}</Text>
      </View>
      <View style={styles.moneyBar1}>
        {/* Mostrar el nombre del afiliado */}
        <Text style={{color:'white'}}>{Math.round(afiliado.bono * 100) / 100}</Text>
      </View>
    </View>
  ))}
  </ScrollView>
</View>
           
            <View style={styles.containernav}>
                <TouchableOpacity style={styles.leftIcon} onPress={() => navigation.navigate('Cartera', { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })}>
                    <Ionicons name="wallet" size={30} color="white" />
                    <Text style={styles.textnavbar}>Cartera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.centerIcon} onPress={() => navigation.navigate('Inversiones', { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })}>
                    <Ionicons name="analytics" size={30} color="white" />
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
        left:20,

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
        shadowRadius: 3.84
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
    moneyBar: {
        backgroundColor: '#7192b3', // Color de fondo verde
        borderWidth: 1,
        width: 150,
        marginLeft: 20,
        borderColor: 'black', // Color del borde verde oscuro
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 20,
        alignSelf: 'center', // Alinear al centro horizontalmente
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      moneyBar1: {
        backgroundColor: '#7171B3', // Color de fondo verde
        borderWidth: 1,
        width: 120,
        marginLeft: 10,
        borderColor: 'black', // Color del borde verde oscuro
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginVertical: 20,
        alignSelf: 'center', // Alinear al centro horizontalmente
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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

})