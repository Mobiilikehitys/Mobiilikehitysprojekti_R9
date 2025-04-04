import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp, Timestamp  } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";


const firebaseConfig = {
  
  
};

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app)
  const firestore = getFirestore(app)


  const RESERVATIONS = 'reservations'
  const RESOURCES = 'resources'
  const BULLETINS = 'bulletins'
  const MARKETPRODUCTS = 'marketproducts'
  const NOTIFICATIONS = 'notifications2'

  

  export {
    firestore,
    collection,
    RESERVATIONS,
    RESOURCES,
    BULLETINS,
    MARKETPRODUCTS,
    NOTIFICATIONS,
    query,
    onSnapshot,
    addDoc,
    getAuth,
    signInWithEmailAndPassword,
    auth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    serverTimestamp,
    Timestamp


    
  }
  
