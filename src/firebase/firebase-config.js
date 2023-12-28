import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDpInYk4WreuHfhM4K19XwK-VPNp9vPapg",
    authDomain: "monkey-blogging-1cd99.firebaseapp.com",
    projectId: "monkey-blogging-1cd99",
    storageBucket: "monkey-blogging-1cd99.appspot.com",
    messagingSenderId: "265690395251",
    appId: "1:265690395251:web:c9eceff6bb8778dcae3006",
    measurementId: "G-QN9D8PB47J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app);
