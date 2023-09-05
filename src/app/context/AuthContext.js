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
                        acquiredCharacters: [61849, 40296, 66257, 63171, 60388, 61750, 59867, 61738, 74060, 60118, 1769, 59729, 78849, 71317, 67967, 204, 42345, 556, 48495, 97140, 304, 76115, 550, 63522, 137, 8915, 59442, 40142, 60117, 19806, 42348, 61841, 14709, 36528, 33483, 369, 76781, 43635, 17356, 64467, 58861, 48635, 48537, 58759, 58, 59398, 63755, 16031, 72708, 5279, 84947, 58936, 51923, 29008, 63648, 69337, 100162, 68806, 49583, 72610, 38817, 124072, 58939, 8458, 2688, 10428, 72818, 1241, 36210, 59257, 59530, 62573, 2424, 17698, 65743, 61082, 108405, 55621, 91360, 66254, 61837, 384, 58923, 66258, 61840, 246, 62033, 68809, 59703, 21577, 90160, 363, 42347, 715, 10895, 59685, 48376, 67062, 61833, 32477, 67322, 70275, 101953, 103028, 59497, 70852, 58757, 65811, 448, 92292, 60959, 49086, 63337, 13112, 18952, 59087, 77371, 70665, 41271, 61039, 115572, 67283, 658, 658, 305, 711, 75396, 33339, 41001, 59414, 48496, 60500, 4980, 62020, 32480, 498, 81467, 60329, 27261, 59088, 55080, 58810, 9703, 60504, 57954, 62099, 18202, 69909, 2402, 63172, 58421, 57087, 61836, 59631, 14744, 38135, 55454, 60226, 8020, 97075, 9905, 72902, 62564, 415, 65, 13448, 81215, 59782, 33236, 47795, 53568, 67281, 18569, 9904, 76117, 60328, 49372, 69498, 60673, 1096, 17699, 1995, 61933, 68810, 19804, 56807, 11452, 64441, 346, 88139, 60329, 55500, 305, 94050, 61838, 75395, 7884, 68425, 60691, 61595, 61079, 10904, 59659, 59839, 65107, 50623, 68812, 62554, 783, 20816, 64904, 69718, 61740, 63170, 116362, 59217, 383, 61378, 231, 55193, 59702, 84510, 58929, 21096, 49583, 662, 62929, 2173, 4774, 60598, 60925, 59657, 42344, 39987, 75546, 61840, 2688, 1065, 72661, 42832, 62130, 52256, 17701, 59850, 78749, 59712, 60676, 91815],
                        packsOpened: 2180,
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