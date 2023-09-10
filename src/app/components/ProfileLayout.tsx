import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { UserAuth } from '../context/AuthContext';

interface ProfileHeaderProps {
    params: { id: string };
    children: React.ReactNode;
    active: number
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

const ProfileLayout: React.FC<ProfileHeaderProps> = ({ params, active, children }) => {

    const { user, getUserData } = UserAuth();
    const [data, setData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserData(params.id).then((res: any) => {
            setData(res);
            setLoading(false);
        })
    }, [user]);

    return (
        <>
            <section>
                <header className="w-full h-[200px] bg-slate-800/40 flex items-center relative">
                    {data && !loading ? (
                        <section className='w-full h-[200px] bg-slate-800/40 flex items-center px-6 relative'>
                            <div className="flex items-end">
                                <figure className="w-[150px] h-[150px] bg-image bg-cover bg-center rounded-md mr-4 shadow-md" style={{ backgroundImage: `url(${data.profilePicture})` }}></figure>
                                <section className="flex flex-col justify-end">
                                    <p className="text-slate-200 text-2xl font-bold mb-2">{data.username}</p>
                                    <p className="w-fit text-slate-200 text-xs font-bold py-2 px-4 bg-pink-600 rounded-md">Nivel {data.level}</p>
                                </section>
                            </div>
                            <span className="absolute h-full w-full left-0 bg-image bg-cover bg-center -z-10" style={{ backgroundImage: "url(https://cdn.discordapp.com/attachments/742163105282523277/1149732637636833360/EhUjc1sUYAgvFs1.jpg)" }}></span>

                        </section>
                    ) : (
                        <section className='w-full h-[200px] bg-slate-800/40 flex items-center px-6 relative'>
                            <div className="flex items-end">
                                <figure className="w-[150px] h-[150px] bg-transparent rounded-md mr-4 shadow-md"></figure>
                                <section className="flex flex-col justify-end">
                                    <p className="text-slate-200 text-2xl font-bold mb-2"></p>
                                    <p className="text-slate-200 text-xs font-bold py-2 px-4 bg-pink-600 rounded-md">Nivel 0</p>
                                </section>
                            </div>
                            <span className="absolute h-full w-full left-0 bg-image bg-cover bg-center -z-10" style={{ backgroundImage: "url(https://cdn.discordapp.com/attachments/742163105282523277/1149732637636833360/EhUjc1sUYAgvFs1.jpg)" }}></span>

                        </section>
                    )}

                </header>
                <nav className="flex justify-center items-center bg-slate-900 h-[50px] py-2 border-b border-slate-800">
                    {data && !loading ? (
                        <section className='flex justify-center items-center bg-slate-900 h-[50px] py-2 border-b border-slate-800'>
                            <Link href={`/profile/${data.uid}`} className={`w-[100px] text-sm h-full flex items-center justify-center hover-bg-slate-950 ${active == 0 ? "text-pink-500" : "text-slate-200"}  rounded-md transition-all`}>General</Link>
                            <Link href={`/profile/${data.uid}/stats`} className={`w-[100px] text-sm h-full flex items-center justify-center hover-bg-slate-950 ${active == 1 ? "text-pink-500" : "text-slate-200"}  rounded-md transition-all`}>Stats</Link>
                            <Link href={`/profile/${data.uid}/favourites`} className={`w-[100px] text-sm h-full flex items-center justify-center hover-bg-slate-950 ${active == 2 ? "text-pink-500" : "text-slate-200"}  rounded-md transition-all`}>Favoritos</Link>
                            <Link href={`/profile/${data.uid}/friends`} className={`w-[100px] text-sm h-full flex items-center justify-center hover-bg-slate-950 ${active == 3 ? "text-pink-500" : "text-slate-200"}  rounded-md transition-all`}>Amigos</Link>
                            <Link href={`/profile/${data.uid}/collection`} className={`w-[100px] text-sm h-full flex items-center justify-center hover-bg-slate-950 ${active == 4 ? "text-pink-500" : "text-slate-200"}  rounded-md transition-all`}>Colección</Link>
                        </section>
                    ) : (
                        <section className='flex justify-center items-center bg-slate-900 h-[50px] py-2 border-b border-slate-800'>
                            <Link href={`#!`} className={`w-[100px] text-sm h-full flex items-center justify-center hover-bg-slate-950 ${active == 0 ? "text-pink-500" : "text-slate-200"}  rounded-md transition-all`}>General</Link>
                            <Link href={`#!`} className={`w-[100px] text-sm h-full flex items-center justify-center hover-bg-slate-950 ${active == 1 ? "text-pink-500" : "text-slate-200"}  rounded-md transition-all`}>Stats</Link>
                            <Link href={`#!`} className={`w-[100px] text-sm h-full flex items-center justify-center hover-bg-slate-950 ${active == 2 ? "text-pink-500" : "text-slate-200"}  rounded-md transition-all`}>Favoritos</Link>
                            <Link href={`#!`} className={`w-[100px] text-sm h-full flex items-center justify-center hover-bg-slate-950 ${active == 3 ? "text-pink-500" : "text-slate-200"}  rounded-md transition-all`}>Amigos</Link>
                            <Link href={`#!`} className={`w-[100px] text-sm h-full flex items-center justify-center hover-bg-slate-950 ${active == 4 ? "text-pink-500" : "text-slate-200"}  rounded-md transition-all`}>Colección</Link>
                        </section>
                    )}
                </nav>
            </section>
            {children}
        </>
    );
}

export default ProfileLayout;
