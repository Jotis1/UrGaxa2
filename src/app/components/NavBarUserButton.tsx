import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NavBarUserButtonComponentProps {
    user: any,
    logout: any,
    isOpened: boolean
}

export default function NavBarUserButton({ user, logout, isOpened }: NavBarUserButtonComponentProps) {
    const [isHidden, setIsHidden] = useState(true);

    const router = useRouter();
    const handleCLick = () => {
        setIsHidden(!isHidden);
    }

    const handleLogOut = () => {
        logout();
    }

    return (
        <section className={`${user ? "block" : "hidden"} relative`}>
            <button className="h-[40px] aspect-square rounded-full bg-image bg-cover bg-center" style={{ backgroundImage: `url(${user ? user.profilePicture : ""})` }} onClick={handleCLick}></button>
            <section className={`bg-slate-900 text-slate-200 flex-col absolute z-10 rounded-md mt-[15px] ${isOpened ? "left-1/2 -translate-x-1/2" : "right-0"} shadow-md w-[200px] text-sm ${isHidden ? "hidden" : "flex"}`}>
                <div className="p-4 rounded-t-md relative text-start bg-slate-800">
                    <p className="font-bold truncate">{user.username}</p>
                    <p className="text-xs truncate">Nivel: {user.level}</p>
                    <span className="bg-green-400 h-1/2 w-2 mx-2 rounded-full absolute top-1/2 -translate-y-1/2 right-0"></span>
                </div>
                <section className="flex flex-col p-3 text-xs">
                    <button onClick={() => router.push(`/profile/${user.uid}`)} className="my-2 flex items-center justify-between">Mi perfil <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                    </button>
                    <Link href="#!" className="my-2 flex items-center justify-between">Configuración <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
                    </svg>
                    </Link>
                    <button onClick={handleLogOut} className="my-2 flex items-center justify-between text-red-500">Cerrar Sesión
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                    </button>
                </section>
            </section>
        </section>
    );
}
