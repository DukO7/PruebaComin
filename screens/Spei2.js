import React from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';

const WebViewComponent = (checkoutUrl) => {
    console.log('esto recibo',checkoutUrl.route.params.checkoutUrl);
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
  return (
    
    <View style={styles.container}>
      <WebView
        source={{ uri:checkoutUrl.route.params.checkoutUrl }}
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
