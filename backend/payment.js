
const url = 'https://api.commerce.coinbase.com/charges';

const requestBody = {
   local_price: {
     amount: '1.50', //precio del cargo
     currency: 'USD', //moneda
  },
  pricing_type: 'fixed_price',
 
 name: 'Nombre del cargo',
  description: 'Pequeña descripción',
  redirect_url: 'https://google.com', //URL de redirección opcional

   metadata: { //metadatos opcionales del cargo
     id: 'ID del cliente',
     email: 'bobby@axecapital.com',
     address: '123 Calle Satoshi',
   },
};

const payload = {
  method: 'POST',
  mode: 'cors',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CC-Api-Key': 'da22db03-bbf7-4b45-952c-c2336be8f35d', //Clave API de Commerce
    'X-CC-Version': '2018-03-22' //Agrega el encabezado X-CC-Version con la versión deseada
  },
  body: JSON.stringify(requestBody),
};

async function createCharge() {
  try {
    const response = await fetch(url, payload);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creando el cargo:", error);
  }
}

export { createCharge };
