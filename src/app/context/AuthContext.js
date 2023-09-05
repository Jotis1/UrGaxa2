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
                        acquiredCharacters: [60925, 86, 1769, 56806, 57414, 88603, 63996, 78271, 890, 51888, 12184, 7, 60596, 17700, 75424, 889, 59236, 69514, 58487, 48503, 15301, 5278, 59737, 75395, 27603, 70133, 67815, 60339, 101242, 120654, 31103, 115133, 56251, 76441, 2325, 10650, 11273, 62612, 29313, 67611, 88737, 73772, 1064, 61415, 60671, 58865, 16411, 59534, 1242, 66226, 93608, 3132, 9832, 2028, 137455, 60391, 99065, 64092, 113498, 2541, 131415, 1404, 2754, 45551, 61443, 59541, 70339, 56251, 65924, 5333, 52684, 134195, 59702, 57024, 48496, 70806, 70086, 895, 64371, 55079, 47251, 5277, 74598],
                        packsOpened: 274,
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