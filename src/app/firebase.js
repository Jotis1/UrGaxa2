import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAS-q71qypZobDVOQ8qR9EXKeYBspTVv9k",
    authDomain: "yoru-db.firebaseapp.com",
    databaseURL: "https://yoru-db-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "yoru-db",
    storageBucket: "yoru-db.appspot.com",
    messagingSenderId: "507668173271",
    appId: "1:507668173271:web:f69e0d3c8c0a33c254fb92"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);