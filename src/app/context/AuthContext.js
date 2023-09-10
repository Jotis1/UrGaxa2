import { useContext, createContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion, increment, onSnapshot, limitToLast } from "firebase/firestore";
import { query, ref, orderByValue, get, limitToFirst, orderByChild, onValue } from "firebase/database";
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

    /*(async () => {
        const array = [122434, 60507, 66593, 63272, 59781, 63459, 64445, 495, 43517, 19806, 107019, 62928, 620, 121150, 48631, 52344, 92679, 43042, 12595];
        const uid = "Zn61yCY8q7P4O6HSeMvkdMil9Iv2";
        const userDoc = doc(fsdb, `users/${uid}`);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
            console.log("El documento existe!");
            updateDoc(userDoc, {
                acquiredCharacters: array,
            })
        } else {

        }
    })()*/

    const getUserData = async (uid) => {
        try {
            const userDoc = doc(fsdb, `users/${uid ? uid : user.uid}`);
            const snap = await getDoc(userDoc);

            if (snap.exists()) {
                return snap.data()
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
        }
    };

    const getCharacterHistory = async (id) => {
        try {
            const userDoc = doc(fsdb, `users/${id}`);
            const snap = await getDoc(userDoc);

            if (snap.exists()) {
                const userData = snap.data();
                const history = userData.history.slice(-10); // Obtener solo los últimos 10 elementos del historial

                const characterDataPromises = history.map(async (character) => {
                    const reference = ref(rtdb, String(character.character));
                    const snap = await get(reference);

                    if (snap.exists()) {
                        let data = snap.val();
                        data.pack = userData.packsOpened - character.pack;
                        return data;
                    }
                });

                const characterDataArray = await Promise.all(characterDataPromises);
                characterDataArray.sort((a, b) => a.pack - b.pack);
                return characterDataArray;
            } else {
                console.log("El documento de usuario no existe");
                return [];
            }
        } catch (error) {
            console.error("Error al obtener el historial de personajes:", error);
            return null;
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

    async function getCharacterById(e) {
        return new Promise((resolve, reject) => {
            const charRef = ref(rtdb, String(e));
            onValue(charRef, (snap) => {
                if (snap.exists()) {
                    let data = snap.val();
                    resolve(data);
                } else {
                    reject(new Error(`No se encontraron datos para el personaje ${e}.`));
                }
            });
        });
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
            getUserData(currentUser.uid).then((res) => {
                if (res) {
                    setUser(res);
                } else {
                    setUser(currentUser);
                }
            })
        })
        return () => unsubscribe()
    }, [])

    return (<AuthContext.Provider value={{
        user,
        googleSignIn,
        logOut,
        getUserData,
        rtdb,
        fsdb,
        addCharacter,
        addCoins,
        addCharacterToHistory,
        checkHistory,
        addPack,
        getTotalPacksOpened,
        getCharacterById,
        getCharacterHistory
    }}>{children}</AuthContext.Provider>);
}

export const UserAuth = () => {
    return useContext(AuthContext);
}