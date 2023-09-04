"use client";

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
  const [cardsData, setCardsData] = useState<CardData[]>([]); // Estado para almacenar los datos de las cartas
  function getRandomElements<T>(array: T[], numElements: number): T[] {
    const shuffledArray = array.slice(); // Clona el array original
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray.slice(0, numElements);
  }
  async function getCharactersArray() {
    const databaseURL = "https://y-anime.europe-west1.firebasedatabase.app/";
    const arrayEndpoint = ".json";
    try {
      const response = await fetch(`${databaseURL}/${arrayEndpoint}`);
      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }
      const data = await response.json();
      if (data) {
        const dataArray = Object.values(data);

        const randomData = getRandomElements(dataArray, 10);
        return randomData;
      } else {
        console.log("No se encontraron datos en el array.");
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
        setIsVisible(!isVisible);
        setTimeout(() => {
          setAreItemsVisible(true);
        }, 300);
      }
    });
  };
  return (
    <main>
      <NavBar />
      <section className="w-full h-[calc(100vh-60px)] flex justify-center items-center">
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
}
