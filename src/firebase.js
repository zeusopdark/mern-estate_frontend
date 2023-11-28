// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-ade7e.firebaseapp.com",
    projectId: "mern-estate-ade7e",
    storageBucket: "mern-estate-ade7e.appspot.com",
    messagingSenderId: "593482658883",
    appId: "1:593482658883:web:2b99f38b96ac8c970810f6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);