import React from 'react';
import { WebView } from 'react-native-webview';

const PaymentScreen = () => {
  const htmlContent = `
    <html>
      <body>
      <script src="https://sdk.mercadopago.com/js/v2"></script>
        <form id="form-checkout" action="/process_payment" method="post">
          <div>
            <div>
              <label for="payerFirstName">Name</label>
              <input id="form-checkout__payerFirstName" name="payerFirstName" type="text">
            </div>
            <div>
              <label for="payerLastName">Last name</label>
              <input id="form-checkout__payerLastName" name="payerLastName" type="text">
            </div>
            <div>
              <label for="email">E-mail</label>
              <input id="form-checkout__email" name="email" type="text">
            </div>
            <div>
              <input type="hidden" name="transactionAmount" id="transactionAmount" value="5000">
              <input type="hidden" name="description" id="description" value="Nome do Produto">
              <br>
              <button type="submit">Pay</button>
            </div>
          </div>
        </form>
      </body>
    </html>
  `;

  return (
    <WebView
      source={{ html: htmlContent }}
      javaScriptEnabled={true}
    />
  );
};

export default PaymentScreen;