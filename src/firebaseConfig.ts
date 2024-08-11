import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDILhzpsJAMCnJrvsJqTqhtILtl0ihW05c",
  authDomain: "supply-chain-bdb10.firebaseapp.com",
  projectId: "supply-chain-bdb10",
  storageBucket: "supply-chain-bdb10.appspot.com",
  messagingSenderId: "461602072958",
  appId: "1:461602072958:web:8a305dff8071af6bee6b2f",
  measurementId: "G-BWBS2RJHCT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);
