import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot  } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBVX2zsw_u7V__CSFhDxPVn_tePmTxL6iw",
  authDomain: "mobile-120f6.firebaseapp.com",
  projectId: "mobile-120f6",
  storageBucket: "mobile-120f6.firebasestorage.app",
  messagingSenderId: "814590261084",
  appId: "1:814590261084:web:3062436ebc44b39bde7399",
  measurementId: "G-XP80D5H75B"
};

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app)
  const firestore = getFirestore(app)


  const RESERVATIONS = 'reservations'
  const RESOURCES = 'resources'

  

  export {
    firestore,
    collection,
    RESERVATIONS,
    RESOURCES,
    query,
    onSnapshot,
    addDoc,
    getAuth,
    signInWithEmailAndPassword,
    auth,
    onAuthStateChanged,
    createUserWithEmailAndPassword


    
  }
  
