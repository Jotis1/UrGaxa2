"use client";

import ProfileLayout from "@/app/components/ProfileLayout";
import { UserAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";

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
    history: [];
}
export default function Page({ params }: { params: { id: string } }) {
    const [history, setHistory] = useState<[UserData] | [null]>([null]);
    const { getCharacterHistory } = UserAuth();

    useEffect(() => {
        getCharacterHistory(params.id).then((res: any) => {
            setHistory(res);
        });
    }, [])


    return (
        <ProfileLayout active={0} params={params}>
            <section className="max-w-[1200px] w-full mx-auto py-5">
                <section className="mx-2">
                    <p className="text-slate-200 font-bold mb-2">Logros</p>
                    <div className="w-full min-h-[200px] bg-slate-900 border border-slate-800 rounded-md flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-slate-500 mb-4">
                            <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
                        </svg>
                        <p className="text-slate-200 text-xs">No tienes logros aún</p>
                    </div>
                </section>
                <section className="mx-2 mt-10">
                    <p className="text-slate-200 font-bold mb-2">Historial</p>
                    <div className="w-full min-h-[200px] bg-slate-900 border border-slate-800 rounded-md flex flex-wrap items-center justify-around">
                        {history ? (
                            <>
                                {history.map((character: any) => (
                                    character ? (
                                        <section className="relative w-[550px] h-[100px] bg-slate-800 my-3 py-3 rounded shadow-md flex items-center" key={character.id}>
                                            <figure className="w-[80px] h-[80px] bg-image bg-center bg-cover rounded-md mx-3" style={{ backgroundImage: `url(${character.image.large})` }}></figure>
                                            <section className="flex flex-col h-full justify-between">
                                                <section>
                                                    <p className="text-slate-200 font-bold">{character.name.full}</p>
                                                    <p className="text-xs text-slate-400">{character.anime ? character.anime.title.romaji : "Título no disponible"}</p>
                                                </section>
                                                <p className="text-xs py-1 px-4 text-slate-200 rounded-md bg-slate-900 text-center w-fit flex items-center">Hace {character.pack} packs</p>
                                                <span className="text-xs absolute top-0 right-0 flex items-center m-3 py-1 px-4 bg-pink-600 rounded-xl text-slate-200">{character.favourites}
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                                    </svg>
                                                </span>
                                            </section>
                                        </section>
                                    ) : null
                                ))}
                            </>
                        ) : null}
                    </div>
                </section>
            </section >
        </ProfileLayout >
    )
}