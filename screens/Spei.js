import React, { useEffect, useState,useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import createPaymentIntent from '../components/createPaymentIntent';

const PaymentScreen = (textInputValue) => {
    const cardElementRef = useRef(null);
    const [cardComplete, setCardComplete] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState(null);

  // useEffect(() => {
  //   fetchPaymentIntentClientSecret();
  // }, []);

  const fetchPaymentIntentClientSecret = async () => {
    
    setLoading(true);
    
    const { clientSecret } = await createPaymentIntent(textInputValue.route.params.textInputValue);
    setPaymentIntentClientSecret(clientSecret);
    console.log('esto es del fecth',clientSecret);
    setLoading(false);
  };
  const handleCardElementChange = (cardDetails) => {
    console.log('cardElement changed', cardDetails.complete);
    // Verificar si los datos de la tarjeta están completos
    if (cardDetails.complete) {
      // Si los datos de la tarjeta están completos, habilita el botón de pago
      setCardComplete(true);
    } else {
      // Si los datos de la tarjeta no están completos, deshabilita el botón de pago
      setCardComplete(false);
    }
  };
  const handlePayPress = async () => {
    console.log('handlePayPress called');
    const datos=cardElementRef.current.getValue();
    console.log('elementos',cardElementRef.current.getValue());
    if (cardElementRef) {
      setLoading(true);
      const { clientSecret } = await createPaymentIntent(textInputValue.route.params.textInputValue);
      setPaymentIntentClientSecret(clientSecret);
      await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
      });
      await presentPaymentSheet();
      setLoading(false);
    } else {
      console.log('Complete los datos de la tarjeta antes de realizar el pago');
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Your UI for selecting products or services */}
      <Text style={styles.productName}>Example Product ($10.00)</Text>
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
  style={styles.button}
  onPress={handlePayPress}
  disabled={!cardComplete || loading}>
  <Text style={styles.buttonText}>asd ${10.0}</Text>
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  productName: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#000000',
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
});

export default PaymentScreen;
