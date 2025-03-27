// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "",

  authDomain: "",

  projectId: "",

  storageBucket: "",

  messagingSenderId: "",

  appId: ""

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

export {
    getAuth,
    signInWithEmailAndPassword,
    auth,
};