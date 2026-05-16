import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzT_IC9XgiiwuRC3lRiv54L5EcP_Ljdjs",
  authDomain: "bank-matching.firebaseapp.com",
  projectId: "bank-matching",
  storageBucket: "bank-matching.firebasestorage.app",
  messagingSenderId: "918051734979",
  appId: "1:918051734979:web:87fe74718e6df939b56976",
  measurementId: "G-S151W5RKK4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();