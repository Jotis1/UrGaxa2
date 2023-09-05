import { useContext, createContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, increment, onSnapshot } from "firebase/firestore";
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
                    })
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

    const addCharacter = async (e) => {
        const userDoc = doc(fsdb, `users/${user.uid}`);
        updateDoc(userDoc, {
            acquiredCharacters: arrayUnion(e)
        })
    }

    const addCharacterToHistory = async (char, p) => {
        const userDoc = doc(fsdb, `users/${user.uid}`);
        updateDoc(userDoc, {
            history: arrayUnion({
                pack: p,
                character: char
            })
        })
    }

    const getTotalPacksOpened = async () => {
        return new Promise((resolve, reject) => {
            const statsDoc = doc(fsdb, `stats/packs`);
            onSnapshot(statsDoc, (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    resolve(data.packsOpened);
                } else {
                    reject(new Error('El documento no existe.'));
                }
            });
        });
    };


    const checkHistory = async (char, p) => {
        const userDoc = doc(fsdb, `users/${user.uid}`);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const history = data.history;
            history.forEach(e => {
                console.log(e.pack, p)
                if (e.character == char) {
                    if (e.pack == p) {
                        return false;
                    } else {
                        return true;
                    }
                }
            });
        } else {
            return null;
        }

    }

    const addCoins = async (e) => {
        const userDoc = doc(fsdb, `users/${user.uid}`);
        updateDoc(userDoc, {
            virtualCurrency: increment(e)
        })
    }

    const addPack = async (e) => {
        const userDoc = doc(fsdb, `users/${user.uid}`);
        const statsDoc = doc(fsdb, `stats/packs`);
        updateDoc(userDoc, {
            packsOpened: increment(1)
        })
        updateDoc(statsDoc, {
            packsOpened: increment(1)
        })
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })
        return () => unsubscribe()
    }, [user])

    return (<AuthContext.Provider value={{ user, googleSignIn, logOut, getUserData, rtdb, fsdb, addCharacter, addCoins, addCharacterToHistory, checkHistory, addPack, getTotalPacksOpened }}>{children}</AuthContext.Provider>);
}

export const UserAuth = () => {
    return useContext(AuthContext);
}