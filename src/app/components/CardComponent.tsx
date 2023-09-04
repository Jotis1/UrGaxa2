import { motion } from "framer-motion";

interface CardComponentProps {
    name: string;
    favourites: number;
    index: number;
    currentCard: number;
    image: string;
    id: number;
}

export default function CardComponent({ name, favourites, index, currentCard, image, id }: CardComponentProps) {
    var isHidden;
    if (currentCard != -1) {
        isHidden = index !== currentCard - 1;
    }
    const handleHeartClick = () => {
        const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
        favoritos.push(id);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        alert('Personaje añadido a favoritos.');
    }
    return (
        <div className={`w-[300px] h-[500px] ${isHidden ? 'hidden' : ''} relative rounded-md mx-auto`}>
            <motion.div
                className="item w-full h-full bg-slate-100 shadow-md rounded-[5px] cursor-pointer p-2 absolute"
                whileHover={{ scale: 1.04 }}
            >
                <div className="aspect-square w-full bg-slate-200 rounded-md bg-image bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}></div>
                <section className="mt-4 text-slate-950 flex flex-col justify-between h-[180px]">
                    <div>
                        <p className="text-center font-black text-2xl name">{name}</p>
                        <p className='p-2 w-fit mx-auto text-center bg-pink-500 mt-3 text-xs text-white rounded-xl shadow-md favourites'>{favourites} favoritos</p>
                    </div>
                    <div className='w-full flex justify-between px-5 text-center'>
                        <button className='p-2 border-2 border-green-500 rounded-full w-14 h-14 flex items-center justify-center text-green-500 hover:text-slate-50  hover:bg-green-500 transition-all mx-auto' onClick={handleHeartClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10  top-0.5 relative">
                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                            </svg>
                        </button>
                    </div>
                </section>
            </motion.div>
        </div>
    );
}
