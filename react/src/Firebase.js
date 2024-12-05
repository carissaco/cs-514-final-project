import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCUkvhkLjaKXdby9rCY44Kokdp0UQU9X0g",
    authDomain: "cs-514-final-proj.firebaseapp.com",
    projectId: "cs-514-final-proj",
    storageBucket: "cs-514-final-proj.firebasestorage.app",
    messagingSenderId: "384553326685",
    appId: "1:384553326685:web:027f04a52b3972ad6495b4",
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);


