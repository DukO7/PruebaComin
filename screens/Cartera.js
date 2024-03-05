import React, { useState,useEffect } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity,FlatList  } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CreditCardImage from '../assets/tarjeta.png'
import SidebarModal from "./SidebarModal";
export default function Cartera({ route }) {
    const [dates, setDates] = useState([]);
const [inversions, setInversions] = useState([]);
    useEffect(() => {
        const filteredDates = Object.keys(inversionesPorFecha);
        setDates(filteredDates);
        if (showDeposits) {
          const filteredInversions = [];
          filteredDates.forEach(date => {
            const inversionsForDate = inversionesPorFecha[date];
            const filteredInversionsForDate = inversionsForDate.filter(inversion => inversion.descripcion.includes('transferencia SPEI'));
            filteredInversions.push(...filteredInversionsForDate);
          });
          setInversions(filteredInversions);
        } else {
          const filteredInversions = [];
          filteredDates.forEach(date => {
            const inversionsForDate = inversionesPorFecha[date];
            const filteredInversionsForDate = inversionsForDate.filter(inversion => inversion.descripcion.includes('Retiro de cuenta'));
            filteredInversions.push(...filteredInversionsForDate);
          });
          setInversions(filteredInversions);
        }
      }, [showDeposits, inversionesPorFecha]);
    const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del SidebarModal
    const inversionsByDate = {};
inversions.forEach(inversion => {
  const date = new Date(inversion.fecha_creacion).toISOString().split('T')[0];
  if (!inversionsByDate[date]) {
    inversionsByDate[date] = [];
  }
  inversionsByDate[date].push(inversion);
});
    const uniqueDates = Object.keys(inversionsByDate);
    const openModal = () => {
      setIsModalVisible(true);
    };
  
    const closeModal = () => {
      setIsModalVisible(false);
    };

    const handlePress1 = (screen) => {
        console.log("Navigating to", screen);
        closeModal(); 
         navigation.navigate(screen, { usuario: usuario,affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria });
      };

    const navigation = useNavigation();
    const { usuario,affiliateBonus,datosafiliados,inversionesPorFecha,cuentaBancaria} = route.params;
    console.log('esto estoy recibiendo en cuenta banco:',cuentaBancaria);
    const handlePress = (screenName) => {
        navigation.navigate(screenName);
    };

    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    const [showDeposits, setShowDeposits] = useState(true);
    const [imageError, setImageError] = useState(false);
    return (
        <View style={styles.container}>
            <View style={styles.header1}>
                <View style={styles.profileInfo1}>
                {imageError ? (
            
            <Image
              source={require("../assets/usuario1.jpg")}
              style={styles.profileImage}
            />
          ) : (
            
            <Image
              source={{
                uri: `http://192.168.1.72:3000/uploads/${usuario.id}.jpg`,
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


            <View style={styles.profileSection}>
            <View style={styles.creditCard}>
      <Image source={CreditCardImage} style={styles.creditCardImage} />
      <Text style={styles.balanceText}>Balance</Text>
      <Text style={styles.balanceAmount}>$ {(usuario.saldo || 0) + (affiliateBonus || 0)}</Text>
      <View style={styles.cardContent}>
        
        <Text style={styles.cardNameText}>{cuentaBancaria.nombre_cuenta}</Text>
      </View>
      <Text style={styles.cardNumberText}>{cuentaBancaria.numero_tarjeta}</Text>
    </View>
            </View>
            

            <View style={styles.containerdatos}>
                <View style={styles.textContainer1}>
                    <Text style={styles.textDerecha2}>Movimientos</Text>

                </View>

            </View>
            <View style={styles.profileInfo}>
  <View style={styles.archivo} onTouchEnd={() => setShowDeposits(true)}>
    <Text style={{ color: 'white', marginLeft: 20, fontWeight: 'bold', }}>Depositos</Text>
  </View>
  <View style={styles.archivo1} onTouchEnd={() => setShowDeposits(false)}>
    <Text style={{ color: 'black', marginLeft: 30, fontWeight: 'bold', }}>Retiros</Text>
  </View>
</View>
<FlatList
  data={Object.entries(inversionesPorFecha)} // Convertimos el objeto a un array de pares clave-valor
  extraData={showDeposits} // Pasamos 'showDeposits' como información adicional
  renderItem={({ item }) => {
    const filteredInversions = showDeposits
      ? item[1].filter(inversion => inversion.descripcion.includes('Transferencia SPEI'))
      : item[1].filter(inversion => inversion.descripcion.includes('Retiro de cuenta'));

    return (
      <View >
        <FlatList
          data={uniqueDates} // Filtramos las inversiones según el valor de 'showDeposits'
          renderItem={({ item }) => (
        <View style={styles.containerDivider}>
          <View style={styles.textDivider}>
            <Text>{item}</Text>
            <View style={styles.divider} />
          </View>
        </View>
        )}
        keyExtractor={item => item} // Clave única para cada elemento
      />
        <FlatList
          data={filteredInversions} // Filtramos las inversiones según el valor de 'showDeposits'
          renderItem={({ item: inversion }) => (
            <View style={styles.containerdatos}>
              <Text style={styles.textContainer}>{inversion.descripcion}</Text>
              <Text style={styles.textDerecha}>${inversion.cantidad}</Text>
            </View>
          )}
          keyExtractor={inversion => inversion.id.toString()} // Clave única para cada elemento
        />
      </View>
    )
  }}
  keyExtractor={(item, index) => index.toString()} // Clave única para cada elemento
/>
       <View style={styles.containernav}>
                <TouchableOpacity style={styles.leftIcon} onPress={() => navigation.navigate('Cartera', { usuario: usuario, affiliateBonus:affiliateBonus,datosafiliados:datosafiliados,inversionesPorFecha:inversionesPorFecha,cuentaBancaria:cuentaBancaria })}>
                    <Ionicons name="wallet" size={30} color="#7494b3" />
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
    );
}

const styles = StyleSheet.create({
    archivo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1d2027',
        borderWidth: 1,
        width: 130,
        marginLeft: 50,
        borderColor: 'black',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 30,
        fontWeight: 'bold',
    },
    archivo1: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        textAlign: 'center',
        width: 130,
        marginLeft: 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 30,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },

    creditCard: {
        width: 400,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top:-80
    },
    creditCardImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    balanceText: {
        position: 'absolute',
        bottom: 40,
        right: 50,
        fontSize: 15,
        color: 'white',
      },
      balanceAmount: {
        position: 'absolute',
        bottom: 10,
        right: 40,
        fontSize: 20,
        textAlign:'left',
        color: 'white',
      },
      cardContent: {
        position: 'absolute',
        top: 10,
        left: 50,
      },
      cardNumberText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: .5,
        position: 'absolute',
        bottom: 10,
        left: 50,
      },
      cardNameText: {
        fontSize: 16,
        color: 'white',
      },

    container: {
        flex: 1,
        backgroundColor: 'white',

    },
    header1: {
        backgroundColor: '#1d2027',
        height: 170,
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
    profileInfo1: {
        flexDirection: 'row',
        alignItems: 'center',
        top: -35
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
        alignItems: 'left',
        left: 40
    },
    textContainer1: {
        flex: 1,
        alignItems: 'center',
        marginTop:70
    },
    text: {
        fontSize: 18,
        color: 'black'
    },
    textDerecha: {
        fontSize: 18,
        color: 'black',
        right:80


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
        textAlign: 'left',
        right: 10,
        marginTop: 20,

    },
    containerDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
    },
    textDivider: {
        marginRight: 10,
        marginLeft: 10,
        width:400
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
        marginRight:70,
        position:'relative',
        zIndex:1
    },
    menuItem: {
        padding: 10,
        backgroundColor:'white',
        
        
        
    },
    menuText: {
        fontSize: 18,
    },
    menuButton: {
        position: 'absolute', 
        top: 20,
        right: 20,
        zIndex: 1,
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
        marginTop: 20
    },
    TextoBoton: {
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },
});