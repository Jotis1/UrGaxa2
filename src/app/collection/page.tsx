"use client";

import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
export default function Collection() {
    const [cardComponents, setCardComponents] = useState<JSX.Element[]>([]);
    function getAllIDs() {
        var array = localStorage.getItem("favoritos");
        if (array) return JSON.parse(array);
        if (!array) return [];
    }
    async function getCharactersArray() {
        const databaseURL = "https://y-anime.europe-west1.firebasedatabase.app";
        const ids = getAllIDs();
        if (!ids || ids.length === 0) {
            // Si no hay IDs o la matriz está vacía, simplemente retorna un array vacío
            return [];
        }

        // Utiliza Promise.all para esperar todas las llamadas asíncronas
        const fetchPromises = ids.map(async (e: any) => {
            const arrayEndpoint = `${e}.json`;
            try {
                const response = await fetch(`${databaseURL}/${arrayEndpoint}`);
                if (!response.ok) {
                    throw new Error(`Error al obtener los datos: ${response.statusText}`);
                }
                const data = await response.json();
                return data; // Retorna los datos obtenidos para este ID
            } catch (error) {
                console.error("Error al obtener los datos:", error);
                return null; // Retorna null en caso de error
            }
        });

        // Espera a que todas las promesas se resuelvan
        const results = await Promise.all(fetchPromises);
        // Filtra los resultados para eliminar los valores nulos (errores)
        const validResults = results.filter((result) => result !== null);
        return validResults; // Retorna los datos válidos como un array
    }
    useEffect(() => {
        async function fetchData() {
            const cardData = await getCharactersArray();
            cardData.sort((a, b) => b.favourites - a.favourites);

            const cardComponentsData = cardData.map((data, index) => (
                <Card
                    image={data.image.large}
                    gender={data.gender}
                    anime={data.anime.title.romaji}
                    index={index}
                    currentCard={-1}
                    id={data.id}
                    key={index}
                    name={data.name.full}
                    favourites={data.favourites}
                />
            ));
            setCardComponents(cardComponentsData);
        }

        fetchData();
    }, []);

    return (
        <main>
            <NavBar></NavBar>
            <section>
                <p className="m-5 text-3xl font-extrabold text-slate-950">Colección</p>
                <section className="w-[1328px] flex flex-wrap justify-start mx-auto">
                    {cardComponents.map((card, index) => (
                        <div key={index} className="flex-none w-[300px] m-4">{card}</div>
                    ))}
                </section>
            </section>
        </main>
    )
}