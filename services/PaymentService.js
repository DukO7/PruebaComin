const axios = require("axios");

class PaymentService {
  async createPayment() {
    const url = "https://api.mercadopago.com/checkout/preferences";

    const body = {
      payer_email: "lechuga.lflr@gmail.com",
      items: [
        {
          title: "Inversion",
          description: "Inversion Fintech",
          picture_url: "http://www.myapp.com/myimage.jpg",
          category_id: "services",
          quantity: 1,
          unit_price: 876
        }
      ],
      back_urls: {
        failure: "/failure",
        pending: "/pending",
        success: "/success"
      }
    };

    const payment = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });

    return payment.data;
  }

}

module.exports = PaymentService;
