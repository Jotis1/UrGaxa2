import { useContext, createContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, get, onValue } from "firebase/database"
import { auth, fsdb, rtdb } from "../firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async (userCred) => {
            if (userCred) {
                let user = userCred.user;
                const userDoc = doc(fsdb, `users/${user.uid}`);
                const docSnap = await getDoc(userDoc);

                if (docSnap.exists()) {
                    console.log("El documento existe!")
                } else {
                    setDoc(userDoc, {
                        username: user.displayName,
                        profilePicture: user.photoURL,
                        acquiredCharacters: [],
                        packsOpened: 0,
                        uid: user.uid,
                        score: 0,
                        level: 0,
                        achievements: [],
                        virtualCurrency: 0,
                        registrationDate: new Date().toLocaleDateString(),
                        userStatus: "online",
                        transactionHistory: [],
                        gamePreferences: {
                            language: "es",
                            notificationsEnabled: true,
                            soundVolume: 1
                        }
                    }).then(console.log("Done"))
                }
            }
        });
    }

    const logOut = () => {
        signOut(auth)
    };

    const getUserData = async () => {
        if (user) {
            const userDoc = doc(fsdb, `users/${user.uid}`);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                const data = docSnap.data();
                return data;
            } else {
                return null;
            }
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })
        return () => unsubscribe()
    }, [user])

    return (<AuthContext.Provider value={{ user, googleSignIn, logOut, getUserData, rtdb }}>{children}</AuthContext.Provider>);
}

export const UserAuth = () => {
    return useContext(AuthContext);
}