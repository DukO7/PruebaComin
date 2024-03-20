import React, {useState, useRef, useEffect } from "react";
import { View, StyleSheet,BackHandler,Alert } from 'react-native';
import WebView from 'react-native-webview';
import { useNavigation,useIsFocused } from '@react-navigation/native';
const WebViewComponent = ({ route }) => {
    const navigation = useNavigation();
    const { usuario,checkoutUrl} = route.params;
    console.log('esto recibo',checkoutUrl);
    const removeDivsScript = `
  const headerImageDivToRemove = document.querySelector('.HeaderImage.HeaderImage--icon.HeaderImage--iconFallback.flex-item.width-fixed');
  if (headerImageDivToRemove) {
    headerImageDivToRemove.remove();
  }

  const testModeDivToRemove = document.querySelector('.TestModeBadge.mx2.flex-item.width-fixed');
  if (testModeDivToRemove) {
    testModeDivToRemove.remove();
  }
`;
console.log('esto recibo de usuarios:',usuario);
useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "¿Estás seguro?",
        "¿Quieres cancelar el pago?",
        [
          {
            text: "Cancelar",
            onPress: () => null,
            style: "cancel",
          },
          { text: "Sí", onPress: () => handleNavigateBack() },
        ],
        { cancelable: false }
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  const handleNavigateBack = () => {
    // Aquí puedes agregar la navegación de regreso al login
    console.log("Regresando al login...");
    navigation.navigate("Pasarela",{usuario:usuario});
  };
  return (
    
    <View style={styles.container}>
        
      <WebView
        source={{ uri:checkoutUrl }}
        style={styles.webview}
        injectedJavaScript={removeDivsScript}
  javaScriptEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:30,
    height:900
  },
  webview: {
    flex: 1,
    
  },
});

export default WebViewComponent;
