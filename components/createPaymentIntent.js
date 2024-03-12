const createPaymentIntent = async (amount) => {
    try {
      console.log('Sending request to create payment intent with amount:', amount);
      const response = await fetch('http://192.168.1.72:3000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount}),
      });
  
      console.log('Received response:', response);
  
      if (!response.ok) {
        throw new Error('Failed to fetch payment intent');
      }
  
      const responseBody = await response.json(); // Leer el cuerpo de la respuesta como JSON
      const { clientSecret } = responseBody; // Extraer el clientSecret del cuerpo de la respuesta
      console.log('Received clientSecret:', clientSecret);
  
      // Enviar el clientSecret en el formato adecuado
      return { clientSecret };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };
  
  export default createPaymentIntent;
  