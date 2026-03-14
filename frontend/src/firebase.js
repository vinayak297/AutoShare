import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDROdxFiaBDsD8UcTVIQUMDIqXt4tXWG_Q",
  authDomain: "autoshare-cfa0a.firebaseapp.com",
  projectId: "autoshare-cfa0a",
  storageBucket: "autoshare-cfa0a.firebasestorage.app",
  messagingSenderId: "230895451243",
  appId: "1:230895451243:web:261bb3db622ddef7abc52e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);