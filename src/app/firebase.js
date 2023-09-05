import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCzkp02SwwtUCImM3G-EbbibZJxtpm3RqQ",
    authDomain: "this-is-yoru.firebaseapp.com",
    projectId: "this-is-yoru",
    storageBucket: "this-is-yoru.appspot.com",
    messagingSenderId: "835796594911",
    appId: "1:835796594911:web:a96d033e150c7fb79b396a",
    measurementId: "G-ES61MMQJF6",
    databaseURL: "https://this-is-yoru-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const fsdb = getFirestore(app);