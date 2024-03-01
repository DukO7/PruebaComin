import React from "react";
import { Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LogoutButton() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Eliminar los datos de usuario almacenados localmente
      await AsyncStorage.removeItem("usuario");
      // Redirigir al usuario a la pantalla de inicio de sesión
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert('Error', 'Error al cerrar sesión');
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <Text>Cerrar Sesión</Text>
    </TouchableOpacity>
  );
}
