import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const PaymentScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const sendPaymentDataToServer = async (firstName, lastName, email) => {
    try {
      const response = await axios.post('http://192.168.1.65:3000/process_payment', {
        payerFirstName: firstName,
        payerLastName: lastName,
        email: email
      });

      console.log('Respuesta del servidor:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error al enviar los datos del pago al servidor:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    try {
      await sendPaymentDataToServer(firstName, lastName, email);

      Alert.alert('Pago exitoso', 'El pago se ha enviado correctamente.');
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      Alert.alert('Error', 'Ocurrió un error al procesar el pago. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Nombre"
        value={firstName}
        onChangeText={text => setFirstName(text)}
      />
      <TextInput
        placeholder="Apellido"
        value={lastName}
        onChangeText={text => setLastName(text)}
      />
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
      />
      <Button
        title="Pagar"
        onPress={handlePayment}
      />
    </View>
  );
};

export default PaymentScreen;
