import React, { Component, useState,useEffect } from "react";
import { View, Text, Button, StyleSheet,TouchableOpacity,Alert,Image
 } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import moment from 'moment';
import { openBrowserAsync } from 'expo-web-browser';
const Pasarela = ({ route }) => {
    const { usuario, affiliateBonus, datosafiliados, inversionesPorFecha, cuentaBancaria,textInputValue,textInputValue1} = route.params;
    console.log('esto estoy recibiendo de seleccion',textInputValue);
    console.log('esto estoy recibiendo de seleccion2',textInputValue1);
    const navigation = useNavigation();
    const [checkoutUrl, setCheckoutUrl] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const PaymentService = {
        async createPayment() {
            const url = "https://api.mercadopago.com/checkout/preferences";

            const body = {
                payer_email: usuario.correo_electronico,
                items: [
                    {
                        title: "Inversion",
                        description: "Inversion Fintech",
                        picture_url: "http://www.myapp.com/myimage.jpg",
                        category_id: "services",
                        quantity: 1,
                        unit_price: parseFloat(textInputValue.mxnValue)
                    }
                ],
                back_urls: {
                    failure: "/failure",
                    pending: "/pending",
                    success: "http://localhost:8081/Inversiones"
                },
                auto_return:"approved",
            };

            const payment = await axios.post(url, body, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer TEST-6676272883606931-030303-e2bd63f42733b12c4d2a1ec2e105725d-1708323573`
                }
            });

            return payment;
        },
        checkPaymentStatus(preferenceId) {
            const url = `https://api.mercadopago.com/checkout/preferences/${preferenceId}`;
            axios.get(url, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer TEST-6676272883606931-030303-e2bd63f42733b12c4d2a1ec2e105725d-1708323573`
              }
            }).then((response) => {
              const { status } = response.data;
        
              if (status === 'approved') {
                console.log('El pago fue exitoso.');
              } else if (status === 'pending') {
                console.log('El pago está pendiente.');
              } else if (status === 'rejected') {
                console.log('El pago fue rechazado.');
              }
            }).catch((error) => {
              console.error(error);
            });
          }
    };
    const handlePress3 = async () => {
        try {
            if(textInputValue){
                setShowAlert(true);
                const payment = await PaymentService.createPayment();
                console.log(payment.data.init_point);
                const timestamp = new Date().getTime();
                const fechaMySQL = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
                console.log('esta es la fecha que guardara:',timestamp);
               
                console.log('insertado con exito',payment.data.init_point);
                await openBrowserAsync(payment.data.init_point);
                PaymentService.checkPaymentStatus(payment.data.id);
                await axios.post('http://192.168.1.72:3000/Act_inversion', {
                  usuarioId: usuario.id,
                  saldo: textInputValue, 
                  fecha_inicio:fechaMySQL ,
              });
                console.log('datos recibidos',payment.data.id)
                setShowAlert(false);
            }else{
                Alert.alert('No hay cantidad seleccionada')
            }
        } catch (error) {
            console.error(error);
        }
    };


    const getAccounts = async () => {
      try {
        const authString = `:`;
        const authBuffer = Buffer.from(authString, 'utf8');
        const authBase64 = authBuffer.toString('base64');
    
        const response = await axios.get('https://api.bitso.com/v3/accounts', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${authBase64}`,
          },
        });
    
        return response.data.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    };
    
    const getAccountByCurrency = (accounts, currency) => {
      return accounts.find((account) => account.currency === currency);
    };
    
    const initiateTransfer = async (fromCurrency, toCurrency, amount) => {
      const accounts = await getAccounts();
    
      const fromAccount = getAccountByCurrency(accounts, fromCurrency);
      const toAccount = getAccountByCurrency(accounts, toCurrency);
    
      if (!fromAccount || !toAccount) {
        console.error('One or both of the accounts were not found');
        return;
      }
    
      try {
        const response = await axios.post('http://192.168.1.72:3000/transfer', {
          from_account: fromAccount.id,
          to_account: toAccount.id,
          amount,
          currency: fromCurrency,
        });
    
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const handleCheckout = async () => {
      console.log('esta siendo llamado');
      const res = await fetch('http://192.168.1.72:3000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_usuario:usuario.id,
          amount: textInputValue.mxnValue+textInputValue1,
          porcentaje:textInputValue.additionalValue,
          afiliado:textInputValue.valorafiliado,
          currency: 'mxn',
          paymentMethodType: 'card',
          paymentMethod: 'pm_card_visa',
          confirm: true
        })
      });
      const data = await res.json();
      setCheckoutUrl(data.url);
      console.log('esto recibo de await',data.url);
      navigation.navigate('Spei2',{usuario,checkoutUrl:data.url})
    };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Elige una opción de pago:</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Pagar con Mercado Pago"
          onPress={handlePress3}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Pagar con SPEI"
          onPress={handleCheckout}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Pagar con Bitso (Criptomonedas)"
          onPress={() => navigation.navigate('Bitso')}
        />
      </View>
      <View style={styles.containernav}>
                <TouchableOpacity style={styles.leftIcon} onPress={() => navigation.navigate('Cartera', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria })}>
                    <Ionicons name="wallet" size={30} color="white"/>
                    <Text style={styles.textnavbar}>Cartera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.centerIcon} onPress={() => navigation.navigate('Inversiones', { usuario: usuario, affiliateBonus: affiliateBonus, datosafiliados: datosafiliados, inversionesPorFecha: inversionesPorFecha, cuentaBancaria: cuentaBancaria })}>
                    <Ionicons name="analytics" size={30} color="white"/>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    width: '80%',
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
textnavbar: {
    color: 'white',
    alignItems: 'center',
    right: 5
},
textnavbar2: {
    color: 'white',
    alignItems: 'center',
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
});

export default Pasarela;