import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated,Easing,Image } from "react-native";

const SidebarModal = ({ isVisible, onClose, onPress,usuario }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(0.2)),
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.back(0.2)),
        useNativeDriver: true
      }).start();
    }
  }, [isVisible]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-250, 0] // Ancho del modal
  });
  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5] // Opacidad de la interfaz principal
  });
  const [imageError, setImageError] = useState(false);
  return (
  
    <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <View style={styles.profileInfo}>
        {imageError ? (
            // Mostrar un icono en lugar de la imagen si hay un error
            <Image
              source={require("../assets/usuario1.jpg")}
              style={styles.profileImageDraw}
            />
            
          ) : (
            // Intenta cargar la imagen
            <Image
              source={{
                uri: `http://192.168.1.72:3000/uploads/${usuario.id}.jpg`,
              }}
              style={styles.profileImageDraw}
              onError={() => setImageError(true)} // Manejar error de carga de imagen
            />
          )}

            </View>
            <Text style={styles.textHeader1}>{usuario.nombre}</Text>
      </View>
      <TouchableOpacity style={styles.item} onPress={() => onPress("Home")}>
        <Text style={styles.menuText}>Mi Perfil</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => onPress("Datos")}>
        <Text style={styles.menuText}>Mis datos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => onPress("Documentos")}>
        <Text style={styles.menuText}>Mis Documentos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => onPress("DatosBanco")}>
        <Text style={styles.menuText}>Mi cartera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => onPress("Afiliados")}>
        <Text style={styles.menuText}>Afiliados</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => onPress("Configuracion")}>
        <Text style={styles.menuText}>Configuraciones</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1d2027',
    width: 250,
    height: "91%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9999,
    
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop:55,
    left:95
  },
  closeButton: {
    backgroundColor: "#555",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    marginTop: 20,
    marginLeft: 20
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  menuText: {
    fontSize: 18,
    color: 'white',
    right: 12,
    paddingVertical: 10, // Espacio vertical alrededor del texto
    paddingHorizontal: 30, // Espacio horizontal alrededor del texto
    backgroundColor: '#333', // Color de fondo del texto
    borderRadius: 5,
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
profileImageDraw: {
    width: 100,
    height: 100,
    borderRadius: 80,
    marginLeft: 70,
    top: 40,
    left: 0,
    borderColor: 'white',
    borderWidth: 3,
},
textHeader1: {
    color: 'white',
    marginLeft: 20,
    marginTop: 50,
    fontWeight: 'bold',
},
});

export default SidebarModal;
