"use client";

import Link from "next/link";
import { UserAuth } from "../context/AuthContext";
import NavBarUserButton from "./NavBarUserButton";
import { useEffect, useState } from "react";

export default function NavBar() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const { user, googleSignIn, logOut, getUserData } = UserAuth();
    const handleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    }
    const [mobileSize, setMovileSize] = useState(false);
    const [isOpened, setIsOpened] = useState(false);

    useEffect(() => {

        const updateWindowWidth = () => {
            const newWidth = window.innerWidth;

            if (newWidth > 700) {
                setMovileSize(false);
            } else {
                setMovileSize(true);
            }
        };

        window.addEventListener('resize', updateWindowWidth);
        updateWindowWidth();

        return () => {
            window.removeEventListener('resize', updateWindowWidth);
        };
    }, []);

    const handleOpen = () => {
        setIsOpened(!isOpened);
    };

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {

        getUserData().then((res: any) => {
            setData(res);
            setLoading(false);
        });

    }, [user])

    return (
        <section className="sticky top-0 z-10 bg-slate-900/60">
            {mobileSize ? (
                <section className="bg-slate-900">
                    <nav className="h-[60px] flex items-center justify-between px-5 relative border-b border-slate-800" >
                        <section className="flex items-center">
                            {/** YORU BRAND */}
                            <Link href="/" className="text-2xl font-black text-slate-200">
                                YORU <span className="text-xs font-bold">for ANI<span className="text-blue-700">LIST</span></span>
                            </Link>
                            {/** BUTTONS */}
                        </section>
                        {
                            loading ? (null) : !data ? (
                                <section className={`${data ? "hidden" : "relative"} relative`}>
                                    <button className="bg-slate-200 px-4 py-2 rounded-md text-xs hover:scale-105 transition-all shadow-md " onClick={handleSignIn}>Iniciar sesión</button>
                                </section>)
                                : (
                                    <section className="flex items-center h-full">
                                        <button className="w-[40px] h-[40px] text-slate-200" onClick={handleOpen}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                            </svg>
                                        </button>
                                    </section>
                                )
                        }
                    </nav>
                    {!isOpened ? (null) : (
                        <section className="flex flex-col text-xs text-slate-200 border-b border-slate-800">
                            <section className="w-full flex justify-center items-center text-center py-2">

                                {
                                    loading ? (null) : !data ? (
                                        <section className={`${data ? "hidden" : "relative"} `}>
                                            <button className="bg-slate-200 px-4 py-2 rounded-md text-xs hover:scale-105 transition-all shadow-md " onClick={handleSignIn}>Iniciar sesión</button>
                                        </section>)
                                        : (
                                            <NavBarUserButton user={data} isOpened={true} logout={handleSignOut}></NavBarUserButton>
                                        )
                                }
                            </section>
                            <Link href="/" className="relative text-center py-3 transition-all hover:bg-slate-950/40">Gacha
                            </Link>
                            <Link href="#!" className="relative text-center py-3 transition-all hover:bg-slate-950/40">
                                Tienda
                            </Link>
                            <Link href="/collection" className="relative text-center py-3 transition-all hover:bg-slate-950/40">
                                Colección
                            </Link>
                            <Link href="#!" className="relative text-center py-3 transition-all hover:bg-slate-950/40">
                                Foro
                            </Link>
                            <Link href="#!" className="relative text-center py-3 transition-all hover:bg-slate-950/40">
                                Noticias
                            </Link>
                            <Link href="#!" className="relative text-center py-3 transition-all hover:bg-slate-950/40">
                                FAQ
                            </Link>
                        </section>
                    )}
                </section>
            ) : (
                <nav className="h-[60px] flex items-center justify-between px-10 relative backdrop-blur-sm border-b border-slate-800" >
                    <section className="flex items-center">
                        {/** YORU BRAND */}
                        <Link href="/" className="text-2xl font-black text-slate-200">
                            YORU <span className="text-xs font-bold">for ANI<span className="text-blue-700">LIST</span></span>
                        </Link>
                        {/** BUTTONS */}
                        <section className="ml-8 text-xs text-slate-200 flex">
                            <Link href="/" className="block relative group min-w-[50px] text-center mx-2">Gacha
                                <span className="absolute w-0 group-hover:w-full transition-all h-[2px] bg-slate-200 -bottom-[5px] left-0"></span>
                            </Link>
                            <Link href="#!" className="block relative group min-w-[50px] text-center mx-2">
                                Tienda
                                <span className="absolute w-0 group-hover:w-full transition-all h-[2px] bg-slate-200 -bottom-[5px] left-0"></span>
                            </Link>
                            <Link href="#!" className="block relative group min-w-[50px] text-center mx-2">
                                Foro
                                <span className="absolute w-0 group-hover:w-full transition-all h-[2px] bg-slate-200 -bottom-[5px] left-0"></span>
                            </Link>
                            <Link href="#!" className="block relative group min-w-[50px] text-center mx-2">
                                Noticias
                                <span className="absolute w-0 group-hover:w-full transition-all h-[2px] bg-slate-200 -bottom-[5px] left-0"></span>
                            </Link>
                            <Link href="#!" className="block relative group min-w-[50px] text-center mx-2">
                                FAQ
                                <span className="absolute w-0 group-hover:w-full transition-all h-[2px] bg-slate-200 -bottom-[5px] left-0"></span>
                            </Link>
                        </section>
                    </section>
                    {
                        loading ? (null) : !data ? (
                            <section className={`${data ? "hidden" : "relative"} relative`}>
                                <button className="bg-slate-200 px-4 py-2  rounded-md text-xs hover:scale-105 transition-all shadow-md " onClick={handleSignIn}>Iniciar sesión</button>
                            </section>)
                            : (
                                <NavBarUserButton user={data} isOpened={false} logout={handleSignOut}></NavBarUserButton>
                            )
                    }
                </nav>
            )}
        </section>
    )
}

