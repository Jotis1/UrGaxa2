/*"use client";

import NavBar from "./components/NavBar";
import { useState } from "react";
import { motion, AnimatePresence, useTransform, useMotionValue } from "framer-motion";
import CardComponent from "./components/CardComponent";

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};
type CardData = {
  name: {
    userPreferred: string;
  };
  favourites: number;
  image: {
    large: string
  };
  id: number
  // Otros campos de datos de tarjeta
};

export default function Home() {
  const [isVisible, setIsVisible] = useState(true);
  const [areItemsVisible, setAreItemsVisible] = useState(false);
  const [currentCard, setCurrentCard] = useState(1);
  const [cardsData, setCardsData] = useState<CardData[]>([]);
  const [status, setStatus] = useState(0);

  function obtenerNumeroAleatorio() {
    const min = 1;
    const max = 313506;
    const numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
    return numeroAleatorio;
  }
  let randomData: any = [];
  async function getCharactersArray() {
    const databaseURL = "https://y-anime.europe-west1.firebasedatabase.app/";
    const arrayEndpoint = `${obtenerNumeroAleatorio()}.json`;
    try {
      const response = await fetch(`${databaseURL}/${arrayEndpoint}`);
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }
      const data = await response.json();
      if (data) {
        randomData.push(data);
        console.log(randomData.length)
        setStatus(randomData.length);
        if (randomData.length !== 10) {
          await getCharactersArray();
        }
        return randomData;
      } else {
        await getCharactersArray();
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }
  const handlePrevClick = () => {
    if (currentCard != 1) {
      setCurrentCard((prevCard) => prevCard - 1);
    }
  };
  const handleNextClick = () => {
    if (currentCard != 10) {
      setCurrentCard((prevCard) => prevCard + 1);
    } else {
      setIsVisible(true);
      setAreItemsVisible(false);
      setCurrentCard(1);
    }
  };
  const handleClick = () => {
    getCharactersArray().then((data: any) => {
      if (data) {
        setCardsData(data);
        console.log(cardsData)
        setIsVisible(!isVisible);
        setTimeout(() => {
          setAreItemsVisible(true);
        }, 300)
      };
    });
  };
  return (
    <main>
      <NavBar />
      <section className="w-full h-[calc(100vh-60px)] flex justify-center items-center">
        {status != 0 && (
          <span className={`${status == 10 ? "hidden" : "block"} absolute top-[80px] bg-slate-200 w-[400px] h-4 rounded-md overflow-hidden`}>
            <div className="relative w-full h-full">
              <span className={`${status == 10 ? "hidden" : "block"} h-full bg-green-200`} style={{ width: `${status * 10}%` }}></span>
            </div>
          </span>
        )}
        <AnimatePresence>
          {isVisible && (
            <motion.section
              className="w-[300px] h-[500px] bg-slate-100 shadow-md rounded-[5px] cursor-pointer"
              onClick={handleClick}
              animate={{ scale: 1.04, opacity: 1 }}
              initial={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            ></motion.section>
          )}
        </AnimatePresence>
        <section>
          <motion.section
            className={`${areItemsVisible ? "flex" : "hidden"} w-[100vw] flex-col justify-center container`}
            variants={container}
            initial={areItemsVisible ? "hidden" : "visible"} // Inicialmente oculto
            animate={areItemsVisible ? "visible" : "hidden"}
          >
            <section className="card-container w-full">
              {cardsData.map((cardData, index) => (
                <CardComponent
                  key={index}
                  index={index}
                  currentCard={currentCard}
                  favourites={cardData.favourites}
                  id={cardData.id}
                  name={cardData.name.userPreferred}
                  image={cardData.image.large}
                />
              ))}
            </section>
            <section className={`${areItemsVisible ? "block" : "hidden"} mx-auto w-full  text-center mt-10 text-slate-950`}>
              <button className={`${currentCard == 1 ? "hidden" : ""} mx-10`} onClick={handlePrevClick}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
              </button>
              <button className="mx-10 next" onClick={handleNextClick}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </section>
          </motion.section>
        </section>
      </section>
      <span className={`${areItemsVisible ? "opacity-1" : "opacity-0"} absolute top-[80px] left-[20px] text-xs p-2 rounded-md bg-slate-950 text-white transition-all`}>Carta {currentCard}/10</span>
    </main >
  )
}*/

"use client";

import { useState } from "react";
import Card from "./components/Card";
import NavBar from "./components/NavBar";
// Define una interfaz que represente el tipo de tus datos
interface CharacterData {
  anime: {
    title: {
      romaji: string;
    };
  };
  id: number;
  gender: string; // Asegúrate de que esta propiedad esté definida correctamente
  image: {
    large: string;
  };
  name: {
    full: string;
  };
  favourites: number;
}

// Ahora TypeScript sabrá que character tiene la propiedad 'gender'

export default function Home() {
  const [currentCard, setCurrentCard] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [status, setStatus] = useState(0);
  const [dumbAlert, setDumbAlert] = useState(false);
  const min = 1;
  const max = 137590;

  function generarArrayAleatorio() {
    let randomNumberArray = [];
    for (let i = 0; i < 10; i++) {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
      randomNumberArray.push(randomNumber);
    }
    return randomNumberArray;
  }

  function fetchCharacter(e: any) {
    return fetch(`https://y-anime.europe-west1.firebasedatabase.app/${e}.json`)
      .then(response => response.json());
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
  }

  let i = 0;

  /*function waitForTenCharacters() {
    return new Promise(async (resolve, reject) => {
      const charactersArray = [];
      const maxCharacters = 10;

      while (charactersArray.length < maxCharacters) {
        try {
          const e = Math.floor(Math.random() * (max - min + 1)) + min;
          const char = await fetchCharacter(e);
          console.log(char.favourites);
          console.log(i++);
          if (char.favourites > 1000) {
            charactersArray.push(char);
          }

          setStatus(charactersArray.length);
        } catch (error) {
          console.error(`Error al obtener un personaje:`, error);
          // Puedes manejar el error de manera apropiada
        }
      }

      if (charactersArray.length >= maxCharacters) {
        resolve(charactersArray.slice(0, maxCharacters));
      } else {
        reject(new Error('No se pudieron obtener 10 personajes con char.favorite > 1000.'));
      }
    });
  }*/


  const [isVisible, setIsVisible] = useState(false);
  const [cardContent, setCardContent] = useState([]);

  const handleClick = async () => {
    if (!isBlocked) {
      setIsBlocked(true);
      waitForTenCharacters().then((char: any) => {
        setIsVisible(true);
        setCardContent(char);
      })
    }
  }
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

  return (
    <main>
      <NavBar></NavBar>
      <section className="relative w-full h-[calc(100vh_-_60px)] overflow-auto ">
        <span className={`${status == 0 ? "hidden" : "block"} ${status >= 10 ? "hidden" : "block"} absolute w-[300px] h-4 bg-slate-200 left-1/2 -translate-x-1/2 top-10 rounded-md overflow-hidden`}>
          <div className={`w-[${(status) * 10}%] bg-blue-500 h-full transition-all`}></div>
        </span>
        <span className={`${isVisible ? "block" : "hidden"} absolute left-5 px-4 py-2 bg-slate-950 rounded-md top-5 text-white text-xs`}>
          {currentCard + 1}/10 cartas
        </span>
        <section className={`${isVisible ? "hidden" : "flex"} w-full h-[calc(100vh_-_60px)] justify-center items-center`}>
          <button className={`group relative w-[300px] overflow-hidden h-[500px] bg-image bg-cover bg-center m-10 hover:scale-105 rounded-md transition-all`} style={{ backgroundSize: "100%", backgroundImage: "url(https://cdn.discordapp.com/attachments/756552573431054508/1148384635101909012/Standard_Pack.png)" }} onClick={handleClick}>
            <div className="absolute w-[200px] h-[1000px] bg-white top-0 right-0 rotate-45 opacity-20 group-hover:-translate-x-[000px] group-hover:-translate-y-[550px] transition-all blur-md z-10"></div>
          </button>
        </section>
        <section className={`${isVisible ? "flex" : "hidden"} mt-20  flex-col items-center`}>
          <div className="relative w-[300px] h-[500px]">
            {isVisible &&
              cardContent.map((character: CharacterData, index) => (
                <section key={index}>
                  <Card
                    anime={character.anime.title.romaji}
                    id={character.id}
                    gender={character.gender}
                    image={character.image.large}
                    name={character.name.full}
                    currentCard={currentCard}
                    index={index}
                    favourites={character.favourites}
                  />
                </section>
              ))}
          </div>
          <div className={`${isVisible ? "flex" : "hidden"} w-[300px] mx-20 justify-center mt-10 text-slate-950`}>
            <button className={`p-2 flex justify-center items-center hover:bg-slate-100 rounded-md`} onClick={handlePrevClick}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
              </svg>
            </button>
            <button className={`p-2 flex justify-center items-center hover:bg-slate-100 rounded-md curso`} onClick={handleNextClick}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
        </section>
        <section className={`${dumbAlert ? "flex" : "hidden"} absolute top-0 w-[100vw] h-[100vh] bg-slate-400/60 z-10  justify-center items-center`}>
          <div className="w-[500px] h-[300px] bg-slate-100 rounded-md text-center p-5 flex flex-col justify-around">
            <div>
              <p className="text-slate-950 text-3xl font-black">¿Estás seguro de que quieres continuar?</p>
              <p className="text-sm mt-3 text-slate-600">Los personajes que no hayas reclamado los perderás.</p>
            </div>
            <div className="flex justify-around text-white">
              <button className="w-[100px] py-2 rounded-md bg-green-500  border-green-500 border-2 hover:bg-slate-50 hover:text-green-500 transition-all" onClick={reset}>Sí</button>
              <button className="w-[100px] py-2 rounded-md bg-red-600  border-red-600 border-2 hover:bg-slate-50 hover:text-red-600 transition-all" onClick={cancelReset}>No</button>
            </div>
          </div>
        </section>
      </section >
    </main >
  )
}