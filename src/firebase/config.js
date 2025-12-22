// Import the functions you need from the SDKs you need
import { initializeApp } from "@firebase/app";
import { getAuth,GoogleAuthProvider } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB2l1ZhsK89VbeKC9F4vS7TIfGGGH-i9Jw",
    authDomain: "medichain-34411.firebaseapp.com",
    projectId: "medichain-34411",
    storageBucket: "medichain-34411.firebasestorage.app",
    messagingSenderId: "242594888475",
    appId: "1:242594888475:web:c3220f5cd5eebc2d8431be",
    measurementId: "G-N2NZHCT5G1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

