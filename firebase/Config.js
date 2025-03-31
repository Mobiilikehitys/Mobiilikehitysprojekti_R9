import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCcAk5JyyDCJ4C_DUHlX9i_wKU3-6mYhXo",
    authDomain: "taloyhtioapp.firebaseapp.com",
    projectId: "taloyhtioapp",
    storageBucket: "taloyhtioapp.firebasestorage.app",
    messagingSenderId: "169187897372",
    appId: "1:169187897372:web:2762ad10da8e3111376fd9"
  };

  const app = initializeApp(firebaseConfig);

  const firestore = getFirestore()

  const RESERVATIONS = 'reservations'
  const RESOURCES = 'resources'

  export {
    firestore,
    collection,
    RESERVATIONS,
    RESOURCES,
    query,
    onSnapshot,
    addDoc

    
  }
  