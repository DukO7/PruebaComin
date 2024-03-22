import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from './screens/Home';
import Login from './screens/Login';
import Cartera from './screens/Cartera';
import Inversiones from './screens/Inversiones';
import Retirar from './screens/Retirar';
import Registro from './screens/Registro';
import Afiliados from './screens/Afiliados';
import Datos from './screens/Datos';
import Documentos from './screens/Documentos';
import DatosBanco from './screens/DatosBanco';
LogBox.ignoreLogs(['@firebase/auth:Auth']);
import { TransitionPresets } from '@react-navigation/stack';
import Verificacion from './screens/Verificacion';
import VerificacionC from './screens/VerificacionC';
import IneyCurp from './screens/IneyCurp';
import IneyCurp2 from './screens/IneyCurp2';
import VerificacionR from './screens/VerificacionR';
import IneyCurp3 from './screens/IneyCurp3';
import PaymentScreen from './screens/Pago';
import Pasarela from './screens/Pasarela';
import Spei2 from './screens/Spei2';
import linking from './routes/linking';
export default function App() {
  const Stack =createStackNavigator();
  const Tab= createBottomTabNavigator();

function MyStack() {
  return (
    
      <Stack.Navigator screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,}} >
      <Stack.Screen name="Login" component={Login}
      options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home}
      options={{ headerShown: false }} />
      <Stack.Screen name="Cartera" component={Cartera}
      options={{ headerShown: false }}/>
      <Stack.Screen name="Inversiones" component={Inversiones}
      options={{ headerShown: false }}/>
      <Stack.Screen name="Retirar" component={Retirar}
      options={{ headerShown: false }}/>
      <Stack.Screen name="Registro" component={Registro}
      options={{ headerShown: false }}/>
      <Stack.Screen name="Afiliados" component={Afiliados}
      options={{ headerShown: false }}/>
      <Stack.Screen name="Datos" component={Datos}
      options={{ headerShown: false }}/>
      <Stack.Screen name="Documentos" component={Documentos}
      options={{ headerShown: false }}/>
      <Stack.Screen name="DatosBanco" component={DatosBanco}
      options={{ headerShown: false }}/>
      <Stack.Screen name="Verificacion" component={Verificacion}
      options={{ headerShown: false }}/>
      <Stack.Screen name="VerificacionC" component={VerificacionC}
      options={{ headerShown: false }}/>
      <Stack.Screen name="VerificacionR" component={VerificacionR}
      options={{ headerShown: false }}/>
      <Stack.Screen name="IneyCurp" component={IneyCurp}
      options={{ headerShown: false }}/>
      <Stack.Screen name="IneyCurp2" component={IneyCurp2}
      options={{ headerShown: false }}/>
      <Stack.Screen name="IneyCurp3" component={IneyCurp3}
      options={{ headerShown: false }}/>
      <Stack.Screen name="PaymentScreen" component={PaymentScreen}
      options={{ headerShown: false }}/>
      <Stack.Screen name="Pasarela" component={Pasarela}
      options={{ headerShown: false }}/>
      <Stack.Screen name="Spei2" component={Spei2}
      options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

  return (
   <NavigationContainer linking={linking}>
    <MyStack/>
   </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
