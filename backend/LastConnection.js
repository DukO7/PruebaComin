import React from 'react';
import { Text, StyleSheet } from 'react-native';

const LastConnection = ({ lastConnection }) => {
  // Convertir la fecha a un objeto de fecha
  const date = new Date();
  
  // Obtener los componentes de fecha individuales
  const day = date.getDate();
  const month = date.getMonth() + 1; // Los meses comienzan desde 0
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Formatear la fecha y hora
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
  
  return (
    <Text style={styles.lastConnection}>Última conexión: {formattedDate}</Text>
  );
};

const styles = StyleSheet.create({
  lastConnection: {
    fontSize: 14,
    color: 'gray',
  },
});

export default LastConnection;
