import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
export default function Registro(props) {
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);
  const [showAfiliadoInput, setShowAfiliadoInput] = useState(false);
  const [password, setPassword] = useState('');
  const [repassword, setrePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo_electronico, setcorreo_electronico] = useState('');
  const [codigoAfiliado, setCodigoAfiliado] = useState('');
  const [numero_afiliado_referente, setnumero_afiliado_referente] = useState('');
  const [error, setError] = useState('');
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  const initials = nombre
  .split(' ') // Dividir el nombre en palabras
  .map(word => word.charAt(0).toUpperCase()) // Obtener la primera letra de cada palabra y convertirla en mayúscula
  .join(''); // Unir las iniciales

  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const codigoAfiliado1 = `${initials}${randomNumber}`;

  const handleRegistro = () => {
    // Aquí debes construir los datos del formulario para enviar al servidor
    const data = {
      nombre: nombre,
      telefono: telefono,
      correo_electronico: correo_electronico,
      password: password,
      codigoAfiliado: codigoAfiliado1,
      numero_afiliado_referente: showAfiliadoInput ? numero_afiliado_referente : null
    };

    // Realizar la solicitud HTTP POST al backend
    axios.post('https://a3af-2806-10a6-16-2dc5-813d-4b98-3ea8-9707.ngrok-free.app/registro', data)
    .then(response => {
      // Manejar la respuesta del servidor si es necesario
      console.log('Registro exitoso:', response.data);
      enviarCorreoDeVerificacion(correo_electronico);
      Alert.alert('Registro exitoso', '¡Tu registro ha sido exitoso!', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
    })
    .catch(error => {
      // Manejar errores si ocurren
      console.error('Error al registrar:', error);
      if (error.response && error.response.data && error.response.data.error) {
        Alert.alert('Error', error.response.data.error);
      } else {
        Alert.alert('Error', 'Hubo un error al registrar. Por favor, inténtalo de nuevo.');
      }
    });
  };

  const toggleAfiliadoInput = (value) => {
    setShowAfiliadoInput(value);
  };

  const showFields = () => {
    setIsVisible(true);
  };

  const enviarCorreoDeVerificacion = async (correo_electronico) => {
    const url = 'https://a3af-2806-10a6-16-2dc5-813d-4b98-3ea8-9707.ngrok-free.app/sendVerificationEmail'; // Reemplaza esto con la URL de tu servidor
  
    const requestBody = {
      userEmail: correo_electronico, // Correo electrónico del usuario
       // Enlace de verificación generado por tu backend
    };
  
    try {
      const response = await axios.post(url, requestBody);
  
      if (response.status === 200) {
        console.log('Correo electrónico de verificación enviado correctamente');
        // Realizar cualquier acción adicional después de enviar el correo electrónico
      } else {
        console.error('Error al enviar el correo electrónico de verificación:', response.statusText);
        // Manejar el error de alguna manera
      }
    } catch (error) {
      console.error('Error de red:', error);
      // Manejar el error de red de alguna manera
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>REGISTRARSE</Text>
      <Animatable.View animation="fadeIn" style={styles.card} isVisible={isVisible}>
        <Animatable.View animation="fadeInUp" style={styles.inputContainer}>
          <TextInput
            placeholder="Nombre"
            style={styles.input}
            onChangeText={text => setNombre(text)}
          />
        </Animatable.View>
        <Animatable.View animation="fadeInUp" style={styles.inputContainer}>
          <TextInput
            placeholder="Teléfono"
            style={styles.input}
            onChangeText={text => setTelefono(text)}
          />
        </Animatable.View>
        <Animatable.View animation="fadeInUp" style={styles.inputContainer}>
          <TextInput
            placeholder="Correo electrónico"
            style={styles.input}
            onChangeText={text => setcorreo_electronico(text)}
          />
        </Animatable.View>
        <Animatable.View animation="fadeInUp" style={styles.inputContainer}>
          <TextInput
            placeholder="Contraseña"
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconoMostrar}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={35} color='gray' />
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View animation="fadeInUp" style={styles.inputContainer}>
          <TextInput
            placeholder="Repetir Contraseña"
            style={styles.input}
            secureTextEntry={!showPassword1}
            value={repassword}
            onChangeText={text => setrePassword(text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility1} style={styles.iconoMostrar}>
            <Ionicons name={showPassword1 ? 'eye-off' : 'eye'} size={35} color='gray' />
          </TouchableOpacity>
        </Animatable.View>
        {showAfiliadoInput && (
          <Animatable.View animation="fadeInUp" style={styles.inputContainer}>
            <TextInput
              placeholder="Código de afiliado"
              style={styles.input}
              onChangeText={text => setnumero_afiliado_referente(text)}
            />
          </Animatable.View>
        )}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegistro}>
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </Animatable.View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.checkboxLabel}>¿Tiene un código de afiliado?</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={showAfiliadoInput ? "#7192b3" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleAfiliadoInput}
          value={showAfiliadoInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d2027'
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginBottom: 20
  },
  card: {
    backgroundColor: '#1d2027',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '90%'
  },
  iconoMostrar: {
    position: 'absolute',
    right: 10,
    top: 7
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 30,
    marginBottom: 10
  },
  input: {
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  registerButton: {
    backgroundColor: '#7192b3',
    borderRadius: 15,
    paddingVertical: 20,
    width: '100%',
    marginTop: 20
  },
  registerButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18
  },
  showButton: {
    backgroundColor: '#7192b3',
    borderRadius: 15,
    paddingVertical: 20,
    width: '100%',
    marginTop: 20
  },
  showButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  checkboxLabel: {
    color: 'white',
    marginRight: 10
  }
});
