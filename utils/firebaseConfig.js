import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
import { getAuth } from "firebase/auth";
// import {...} from "firebase/database";
import { getFirestore } from "firebase/firestore";
// import {...} from "firebase/functions";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCBZLWyv5XMp7ICk2tvgCugpCuoWFEiKxw",
  authDomain: "prueba-4fd22.firebaseapp.com",
  projectId: "prueba-4fd22",
  storageBucket: "prueba-4fd22.appspot.com",
  messagingSenderId: "53809538310",
  appId: "1:53809538310:web:9081a566fea5c746c0ea87"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase