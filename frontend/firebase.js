import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "vingo-food-delivery-web.firebaseapp.com",
  projectId: "vingo-food-delivery-web",
  storageBucket: "vingo-food-delivery-web.firebasestorage.app",
  messagingSenderId: "8004198560",
  appId: "1:8004198560:web:661c12515392606187e9c5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };