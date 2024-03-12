import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons';
const API_URL = 'http://192.168.1.72:3000'; // Reemplaza con la URL de tu servidor

const PaymentScreen = (textInputValue) => {
    const {createPaymentMethod} = useStripe();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState(null);
  const cardElementRef = useRef(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardDatos, setDatostarjeta] = useState(false);
  const handleCardElementChange = (cardDetails) => {
    console.log('Datos de la tarjeta:', cardDetails);
    setDatostarjeta(cardDetails);
    if (cardDetails.complete) {
      setCardComplete(true);
    } else {
      setCardComplete(false);
    }
  };
  const fetchPaymentIntentClientSecret = async () => {
    setLoading(true);

    const response = await fetch(`${API_URL}/create-payment-intent2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'mxn'
      }),
    });

    const { clientSecret } = await response.json();
    setPaymentIntentClientSecret(clientSecret);

    setLoading(false);
  };

  const handlePayPress = async () => {
    
    if (!cardComplete) {
      console.log('Completa los detalles de la tarjeta antes de realizar el pago');
      return;
    }
    const pm = await createPaymentMethod({ type: "Card" });

    console.log(pm);
    setLoading(true);
    await fetchPaymentIntentClientSecret();
    await initPaymentSheet({
      paymentIntentClientSecret,
    });
    await presentPaymentSheet();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.productName}>Monto a Invertir: {textInputValue.route.params.textInputValue}</Text>
      <Text style={styles.productName}>Por favor introduce tus datos bancarios</Text>
      <CardField
        ref={cardElementRef}
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={handleCardElementChange}
        onFocus={(focusedField) => {
          console.log('focusField', focusedField);
        }}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: cardComplete && !loading ? '#000000' : '#CCCCCC' }]}
        onPress={handlePayPress}
        disabled={!cardComplete || loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Procesando...' : 'Pagar'}</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      <View style={styles.containernav}>
                <TouchableOpacity style={styles.leftIcon} onPress={() => navigation.navigate('Cartera', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria })}>
                    <Ionicons name="wallet" size={30} color="white"/>
                    <Text style={styles.textnavbar}>Cartera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.centerIcon} onPress={() => navigation.navigate('Inversiones', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria })}>
                    <Ionicons name="analytics" size={30} color="#7494b3"/>
                    <Text style={styles.textnavbar2}>Inversiones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rightIcon} onPress={() => navigation.navigate('Retirar', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria })}>
                    <Ionicons name="arrow-back" size={30} color="white"/>
                    <Text style={styles.textnavbar2}>Retirar</Text>
                </TouchableOpacity>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 30,
    top:20
  },
  productName: {
    fontSize: 18,
    marginBottom: 10,
    textAlign:'center'
  },
  button: {
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
},leftIcon: {
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
},textnavbar: {
    color: 'white',
    alignItems: 'center',
    right: 5
},
textnavbar2: {
    color: 'white',
    alignItems: 'center',
},
});

export default PaymentScreen;
