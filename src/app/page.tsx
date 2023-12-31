"use client";

import { motion, useMotionValue } from "framer-motion";
import { useState, useEffect } from "react";
import { UserAuth } from "./context/AuthContext";
import Card from "./components/Card";
import { onValue, ref } from "firebase/database";
import { onSnapshot, doc } from "firebase/firestore";

interface CharacterData {
  anime: {
    title: {
      romaji: string;
    };
  };
  id: number;
  gender: string;
  image: {
    large: string;
  };
  name: {
    full: string;
  };
  favourites: number;
}

interface UserData {
  username: string;
  profilePicture: string;
  acquiredCharacters: number[];
  packsOpened: number;
  uid: string;
  score: number;
  level: number;
  achievements: any[]; // Puedes definir una interfaz específica si es necesario
  virtualCurrency: number;
  registrationDate: string; // O puede ser un objeto Date si lo prefieres
  userStatus: string; // Puedes definir un conjunto de valores permitidos si es finito
  transactionHistory: any[]; // Puedes definir una interfaz específica si es necesario
  gamePreferences: {
    language: string;
    notificationsEnabled: boolean;
    soundVolume: number;
  };
}

export default function Home() {
  const { user, rtdb, getUserData, addPack, fsdb } = UserAuth();
  const [currentCard, setCurrentCard] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [status, setStatus] = useState(0);
  const [dumbAlert, setDumbAlert] = useState(false);
  const min = 1;
  const max = 137590;
  const [data, setData] = useState<UserData | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (event: any) => {
    const { clientX, clientY } = event;
    const xOffset = (clientX - window.innerWidth / 2) / 20; // Ajusta la velocidad de movimiento en X
    const yOffset = (clientY - window.innerHeight / 2) / 20; // Ajusta la velocidad de movimiento en Y

    x.set(xOffset);
    y.set(yOffset);
  };

  function generarArrayAleatorio() {
    let randomNumberArray = [];
    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
      randomNumberArray.push(randomNumber);
    }
    return randomNumberArray;
  };

  async function fetchCharacter(e: number) {
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

  function waitForTenCharacters() {
    return new Promise(async (resolve, reject) => {
      const charactersArray = [];
      const maxCharacters = 10;
      const randomNumberArray = generarArrayAleatorio();
      for (const e of randomNumberArray) {
        try {
          const char = await fetchCharacter(e);
          charactersArray.push(char);
          setStatus(charactersArray.length);
          if (charactersArray.length >= maxCharacters) {
            resolve(charactersArray.slice(0, maxCharacters));
            return;
          }
        } catch (error) {
          console.error(`Error al obtener el personaje ${e}:`, error);
          // Puedes manejar el error de manera apropiada
        }
      }

      // Si no se alcanzan 10 personajes, rechazamos la Promise.
      reject(new Error('No se pudieron obtener 10 personajes.'));
    });
  };

  const [isVisible, setIsVisible] = useState(false);
  const [cardContent, setCardContent] = useState([]);
  const [packsOp, setPacksOp] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((res) => {
        setTimeout(res, 50);
      })
    }
    getUserData().then((res: any) => {
      if (res) {
        setData(res);
        setPacksOp(res.packsOpened);
      }
    });
    checkAuth();
  }, [user])

  const handleClick = async () => {
    if (!isBlocked) {
      setIsBlocked(true);
      waitForTenCharacters().then((char: any) => {
        setIsVisible(true);
        setCardContent(char);
        addPack();
        setPacksOp((p) => p + 1)
      })
    }
  };

  const [totalPacksOp, setTotalPacksOp] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(fsdb, `stats/packs`), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setTotalPacksOp(data.packsOpened);
      }
    });
    // Devolvemos una función de limpieza para detener la suscripción cuando el componente se desmonta.
    return () => unsubscribe();
  }, []);

  const handlePrevClick = () => {
    if (currentCard != 0) {
      setCurrentCard((prevCard) => prevCard - 1);
    }
  };
  const handleNextClick = () => {
    if (currentCard != 9) {
      setCurrentCard((prevCard) => prevCard + 1);
    } else {
      setDumbAlert(true);
    }
  };
  const reset = () => {
    setCurrentCard(0);
    setIsVisible(false);
    setIsBlocked(false);
    setDumbAlert(false);
  };
  const cancelReset = () => {
    setDumbAlert(false);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((res) => {
        setTimeout(() => {
          setLoading(false)
        }, 700);
      })
    }
    checkAuth();
  }, [user]);

  return (
    <main>
      {loading ? (
        <section className="absolute w-[100vw] h-[calc(100vh_-_60px)] flex justify-center items-center">
          <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 mr-2 text-slate-200 animate-spin  fill-pink-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </section>
      ) : user ? (<section className="relative w-full h-[calc(100vh_-_60px)] overflow-auto ">
        <div className={`${status == 10 ? "hidden" : "flex"} ${status == 0 ? "hidden" : "flex"} bg-slate-100 h-[20px] rounded-xl overflow-hidden absolute left-1/2 -translate-x-1/2 justify-center my-10`}>
          <progress className="w-[300px] h-[20px] relative rounded-lg bg-slate-100 appearance-none" max={100} value={status * 10}></progress>
        </div>
        <span className={`${isVisible ? "block" : "hidden"} absolute left-5 px-4 py-2 bg-slate-950 rounded-md top-5 text-white text-xs`}>
          {currentCard + 1}/10 cartas
        </span>
        <section className={`${isVisible ? "hidden" : "flex"} w-full h-[calc(100vh_-_60px)] justify-center items-center`}>
          <motion.div
            className="bg-slate-800/10 backdrop-blur-sm p-4 border-t border-slate-700 rounded-md shadow-lg"
            style={{ x, y }}
            onMouseMove={handleMouseMove}
          >
            <button
              className={`mx-auto group relative w-[300px] overflow-hidden h-[500px] bg-image bg-cover bg-center transition-all`}
              style={{
                backgroundImage:
                  "url(https://cdn.discordapp.com/attachments/756552573431054508/1148384635101909012/Standard_Pack.png)",
              }}
              onClick={handleClick}
            ></button>
          </motion.div>
        </section>
        <section className={`${isVisible ? "flex" : "hidden"} mt-20  flex-col items-center`}>
          <div className="relative w-[300px] h-[500px]">
            {isVisible &&
              cardContent.map((character: CharacterData, index) => (
                <section key={index}>
                  <Card
                    anime={character.anime && character.anime.title ? character.anime.title.romaji : 'Título no disponible'}
                    id={character.id}
                    gender={character.gender}
                    image={character.image.large}
                    name={character.name.full}
                    currentCard={currentCard}
                    index={index}
                    favourites={character.favourites}
                    pack={packsOp}
                  />
                </section>
              ))}
          </div>
          <div className={`${isVisible ? "flex" : "hidden"} w-[300px] justify-around mt-10 text-slate-200`}>
            <button className={`p-2 flex justify-center items-center hover:bg-slate-800 rounded-md`} onClick={handlePrevClick}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>
            </button>
            <button className={`p-2 flex justify-center items-center hover:bg-slate-800 rounded-md curso`} onClick={handleNextClick}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
        </section>
        <section className={`${dumbAlert ? "flex" : "hidden"} absolute top-0 w-[100vw] h-[calc(100vh_-_60px)] bg-slate-900/60 z-10  justify-center items-center`}>
          <div className="w-[500px] h-[300px] bg-slate-900 border border-slate-800 rounded-md text-center p-5 flex flex-col justify-around">
            <div>
              <p className="text-slate-200 text-3xl font-black">¿Estás seguro de que quieres continuar?</p>
              <p className="text-sm mt-3 text-slate-300">Los personajes que no hayas reclamado los perderás.</p>
            </div>
            <div className="flex justify-between px-10 text-slate-200">
              <button className="w-[100px] hover:w-[200px] py-2 rounded-md border-green-500 border-2 text-green-500 transition-all" onClick={reset}>Sí</button>
              <button className="w-[100px] hover:w-[200px] py-2 rounded-md  border-red-500 border-2 text-red-500 transition-all" onClick={cancelReset}>No</button>
            </div>
          </div>
        </section>
      </section >) : (
        <section className="text-slate-200 text-center w-[100vw] h-[calc(100vh_-_60px)] flex justify-center items-center">
          <p className="text-4xl font-black">Debes iniciar sesión para poder jugar</p>
        </section>
      )}
    </main >
  )
}
