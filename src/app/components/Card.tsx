import { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";

interface CardComponentProps {
    name: string;
    favourites: number;
    index: number;
    currentCard: number;
    image: string;
    id: number;
    anime?: string;
    gender: string;
    pack?: number
}

export default function Card({ name, favourites, index, currentCard, image, id, anime, gender, pack }: CardComponentProps) {
    const { addCharacter, getUserData, addCoins, addCharacterToHistory, checkHistory, user } = UserAuth();
    const [favAlert, setFavAlert] = useState(false);

    let isHidden;
    if (currentCard != -1) {
        isHidden = currentCard == index ? "opacity-1 z-10" : "opacity-0 -z-1 ";
    } else {
        isHidden = false;
    }
    let color; let shadow; let bg;
    if (gender == "Male") {
        color = "bg-blue-500"
    } else if (gender == "Female") {
        color = "bg-pink-500"
    } else {
        color = "bg-neutral-500"
    }
    if (favourites >= 1000) {
        shadow = "shadow-pink-500"
        bg = "border-pink-400"
    } else if (favourites >= 300) {
        shadow = "shadow-yellow-500"
        bg = "border-yellow-500"
    } else {
        shadow = ""
        bg = "border-slate-800"
    }
    const handleHeartClick = () => {
        if (currentCard != -1) {
            getUserData().then((res: any) => {
                addCharacterToHistory(id, pack).then(() => {
                    setFavAlert(true);
                    if (res.acquiredCharacters.includes(id)) {
                        checkHistory(id, pack).then((res: any) => {
                            if (res) {
                                addCoins(favourites / 3);
                            }
                        })
                    } else {
                        addCharacter(id);
                    }
                })
            })
        }
    }

    useEffect(() => {
        const unsubscribe = getUserData().then((res: any) => {
            if (res.acquiredCharacters.includes(id) && currentCard != -1) {
                setFavAlert(true);
            } else {
                setFavAlert(false);
            }
        })

        return () => unsubscribe
    }, [user])

    return (
        <section className={`${currentCard == -1 ? "relative" : "absolute"} ${isHidden} w-[300px]  h-[500px] bg-slate-800 rounded-md p-3 shadow-lg ${shadow} border-4 ${bg}  text-slate-200`}>
            {favAlert && (
                <section className="absolute -top-[60px] right-0 w-full bg-green-500 text-center rounded-md py-2 text-white text-sm">
                    <p>Personaje añadido a la colección</p>
                </section>
            )}
            <div className="w-full aspect-square bg-slate-200 rounded-md bg-cover bg-image bg-center" style={{ backgroundImage: `url(${image})` }} />
            <p className="text-2xl font-black mt-2 text-center truncate">{name}</p>
            <p className="text-xs p-2 bg-blue-500 text-center mx-auto mt-2 rounded-xl w-full text-white truncate">Anime: <strong>{anime}</strong></p>
            <p className="text-xs p-2 bg-pink-500 text-center  mx-auto mt-2 rounded-xl w-full text-white">Favoritos: <strong>{favourites}</strong></p>
            <div className='w-full flex justify-between px-5 text-center mt-4'>
                <button className='p-2 border-2 border-green-500 rounded-full w-14 h-14 flex items-center justify-center text-green-500 hover:text-slate-50  hover:bg-green-500 transition-all mx-auto' onClick={handleHeartClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10  top-0.5 relative">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                </button>
            </div>
            <span className={`${color} rounded-full w-5 h-5 absolute -top-2 -right-2`}></span>
        </section>
    )
}