"use client";

import { useState, useEffect } from "react";
import Card from "./components/Card";
import NavBar from "./components/NavBar";

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
  };

  function fetchCharacter(e: any) {
    return fetch(`https://this-is-yoru-default-rtdb.europe-west1.firebasedatabase.app//${e}.json`)
      .then(response => response.json());
  };

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
  const [sobres, setSobres] = useState(Number);

  useEffect(() => {
    // Define la función getPastOpened
    function getPastOpened() {
      var opened = Number(localStorage.getItem("sobresTirados")) || 0;

      if (opened === 0) {
        localStorage.setItem("sobresTirados", "0");
      }

      setSobres(opened);
    }

    // Llama a getPastOpened una vez cuando el componente se monta
    getPastOpened();
  }, []);

  const handleClick = async () => {
    if (!isBlocked) {
      setIsBlocked(true);
      waitForTenCharacters().then((char: any) => {
        setIsVisible(true);
        setCardContent(char);
        const sobresEnLocalStorage = Number(localStorage.getItem("sobresTirados")) || 0;
        localStorage.setItem("sobresTirados", (sobresEnLocalStorage + 1).toString());

        setSobres(sobresEnLocalStorage + 1);
      })
    }
  };

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
      <section className="relative w-full h-[calc(100vh_-_60px)] overflow-auto ">
        <div className={`${status == 10 ? "hidden" : "flex"} ${status == 0 ? "hidden" : "flex"} bg-slate-100 h-[20px] rounded-xl overflow-hidden absolute left-1/2 -translate-x-1/2 justify-center my-10`}>
          <progress className="w-[300px] h-[20px] relative rounded-lg bg-slate-100 appearance-none" max={100} value={status * 10}></progress>
        </div>
        <span className={`${isVisible ? "block" : "hidden"} absolute left-5 px-4 py-2 bg-slate-950 rounded-md top-5 text-white text-xs`}>
          {currentCard + 1}/10 cartas
        </span>
        <span className={`block absolute right-5 px-4 py-2 bg-slate-950 rounded-md top-5 text-white text-xs`}>
          {sobres} sobres abiertos
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
                    anime={character.anime && character.anime.title ? character.anime.title.romaji : 'Título no disponible'}
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