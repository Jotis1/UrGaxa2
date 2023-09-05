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

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const checkAuth = async () => {
            await new Promise((res) => {
                setTimeout(res, 50);
                setLoading(false)
            })
        }
        getUserData().then((res: any) => setData(res));
        checkAuth();
    }, [user])

    return (
        <nav className="h-[60px] bg-slate-100 flex items-center justify-between px-10">
            <section className="flex items-center">
                {/** YORU BRAND */}
                <Link href="/" className="text-2xl font-black text-slate-950">
                    YORU <span className="text-xs font-bold">for ANI<span className="text-blue-700">LIST</span></span>
                </Link>
                {/** BUTTONS */}
                <section className="ml-8 text-xs text-slate-950 flex">
                    <Link href="/" className="block relative group min-w-[50px] text-center mx-2">Gacha
                        <span className="absolute w-0 group-hover:w-full transition-all h-[2px] bg-slate-950 -bottom-[5px] left-0"></span>
                    </Link>
                    <Link href="#!" className="block relative group min-w-[50px] text-center mx-2">
                        Tienda
                        <span className="absolute w-0 group-hover:w-full transition-all h-[2px] bg-slate-950 -bottom-[5px] left-0"></span>
                    </Link>
                    <Link href="/collection" className="block relative group min-w-[50px] text-center mx-2">
                        Colección
                        <span className="absolute w-0 group-hover:w-full transition-all h-[2px] bg-slate-950 -bottom-[5px] left-0"></span>
                    </Link>
                    <Link href="#!" className="block relative group min-w-[50px] text-center mx-2">
                        Foro
                        <span className="absolute w-0 group-hover:w-full transition-all h-[2px] bg-slate-950 -bottom-[5px] left-0"></span>
                    </Link>
                    <Link href="#!" className="block relative group min-w-[50px] text-center mx-2">
                        Noticias
                        <span className="absolute w-0 group-hover:w-full transition-all h-[2px] bg-slate-950 -bottom-[5px] left-0"></span>
                    </Link>
                    <Link href="#!" className="block relative group min-w-[50px] text-center mx-2">
                        FAQ
                        <span className="absolute w-0 group-hover:w-full transition-all h-[2px] bg-slate-950 -bottom-[5px] left-0"></span>
                    </Link>
                </section>
            </section>
            {loading ? (null) : !data ? (
                <section className={`${data ? "hidden" : "relative"} relative`}>
                    <button className="bg-slate-200 px-4 py-2 rounded-md text-xs hover:scale-105 transition-all shadow-md " onClick={handleSignIn}>Iniciar sesión</button>
                </section>)
                : (
                    <NavBarUserButton user={data} logout={handleSignOut}></NavBarUserButton>
                )}
        </nav>
    )
}