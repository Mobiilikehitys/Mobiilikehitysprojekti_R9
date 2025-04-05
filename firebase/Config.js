import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, onSnapshot, serverTimestamp, Timestamp  } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyBx6D9a1lIqU0frIbKq0Cs8XddlXonHfsM",
  authDomain: "project-app-with-functions.firebaseapp.com",
  projectId: "project-app-with-functions",
  storageBucket: "project-app-with-functions.firebasestorage.app",
  messagingSenderId: "256966699966",
  appId: "1:256966699966:web:b5fc166e5d81d39afe67ef",
  measurementId: "G-XP80D5H75B"
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
