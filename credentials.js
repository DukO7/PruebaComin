// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh0D46Z1TA4k7MDZKcejQfGFO2-6PG7lw",
  authDomain: "appcomin-fe718.firebaseapp.com",
  projectId: "appcomin-fe718",
  storageBucket: "appcomin-fe718.appspot.com",
  messagingSenderId: "761847237201",
  appId: "1:761847237201:web:338817b785a8291fd80670"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase