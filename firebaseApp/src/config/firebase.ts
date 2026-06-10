// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC6WJ8qsYU-dyBXrMsCxJ3vSD0pe-pSjsI",
    authDomain: "fypapp-21f79.firebaseapp.com",
    projectId: "fypapp-21f79",
    storageBucket: "fypapp-21f79.firebasestorage.app",
    messagingSenderId: "260894529973",
    appId: "1:260894529973:web:0a74550df81379fda6a1fc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

console.log('Firebase configuration loaded');
