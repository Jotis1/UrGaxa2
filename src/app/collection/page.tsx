"use client";

import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";

import { get, ref, onValue } from "firebase/database";

import Card from "../components/Card";
export default function Collection() {
    const [cardComponents, setCardComponents] = useState<JSX.Element[]>([]);;
    const { user, getUserData, rtdb } = UserAuth();

    function getAllIDs() {
        var array = localStorage.getItem("favoritos");
        if (array) return JSON.parse(array);
        if (!array) return [];
    }

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                let userData = await getUserData();
                let userCharacters = userData.acquiredCharacters;
                let array: any = [];
                userCharacters.forEach((e: number) => {
                    var charRef = ref(rtdb, String(e));
                    onValue(charRef, (snap) => {
                        if (snap.exists()) {
                            let data = snap.val();
                            array.push(data);
                            if (array.length + 1 == userCharacters.length) {
                                array.sort((a: any, b: any) => b.favourites - a.favourites);
                                const cardComponentsData = array.map((data: any, index: any) => (
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
                        }
                    })
                });
            }
        }

        fetchData();

    }, [user])


    return (
        <main>
            <section>
                <p className="m-5 text-3xl font-extrabold text-slate-200">Colección</p>
                <section className="flex flex-wrap max-w-[1328px] mx-auto justify-around">
                    {cardComponents.map((card, index) => (
                        <div key={index} className="flex-none w-[300px] m-4">{card}</div>
                    ))}
                </section>
            </section>
        </main>
    )
}