"use client";

import ProfileLayout from "@/app/components/ProfileLayout";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

import { UserAuth } from "@/app/context/AuthContext";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";


export default function Page({ params }: { params: { id: string } }) {

    const { getUserData, rtdb } = UserAuth();
    const options = {
        responsive: true,
    };
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: "Número de favoritos",
                data: [],
                borderColor: 'rgb(219, 39, 119)',
                backgroundColor: 'rgb(15, 23, 42)'
            },
        ],
    });


    useEffect(() => {

        getUserData(params.id).then(async (res: any) => {
            if (res) {
                const userData = res; // Obtener solo los últimos 10 elementos del historial
                const history = userData.history.slice(-15);
                const characterDataPromises = history.map(async (character: any) => {
                    const reference = ref(rtdb, String(character.character));
                    const snap = await get(reference);

                    if (snap.exists()) {
                        let data = snap.val();
                        data.pack = userData.packsOpened - character.pack;
                        return data;
                    }
                });

                const characterDataArray = await Promise.all(characterDataPromises);
                characterDataArray.sort((a: any, b: any) => a.pack - b.pack);
                return characterDataArray;
            } else {
                console.log("El documento de usuario no existe");
                return [];
            }
        }).then((doc: any) => {

            interface character {
                name: {
                    full: string
                };
                favourites: number
            }
            const newData = doc.map((e: character) => ({
                label: e.name.full,
                data: e.favourites,
            }));

            const newDataObject = {
                labels: newData.map((item: any) => item.label),
                datasets: [
                    {
                        label: "Número de favoritos",
                        data: newData.map((item: any) => item.data),
                        borderColor: 'rgb(219, 39, 119)',
                        backgroundColor: 'rgb(15, 23, 42)',
                        fill: false,
                        tension: 0.2
                    },
                ],
            };

            setData(newDataObject);
        })
    }, [])


    return (
        <ProfileLayout active={1} params={params}>
            <section className=" w-full mx-auto my-10 max-w-[1000px]">
                <p className="text-slate-200 font-bold mb-2">Historial de favoritos</p>
                <section className="max-w-[1000px] h-[500px] w-full mx-auto  bg-slate-800 p-4 flex items-center justify-center rounded-md border border-slate-700">
                    {data && (
                        <Line options={options} data={data}></Line>
                    )}
                </section>
            </section>
            <section className="mx-auto my-10 max-w-[1000px] w-full">
                <p className="text-slate-200 font-bold mb-2">Estadísticas</p>
                <section className="rounded-md bg-slate-800 p-10 w-full mx-auto flex items-center justify-between text-center border border-slate-700">
                    <section className="flex-grow">
                        <p className="text-slate-200 font-extrabold text-3xl">1209</p>
                        <p className="text-sm text-slate-500">Sobres abiertos</p>
                    </section>
                    <section className="flex-grow">
                        <p className="text-slate-200 font-extrabold text-3xl">1209</p>
                        <p className="text-sm text-slate-500">Sobres abiertos en total</p>
                    </section>
                </section>
            </section>
        </ProfileLayout>
    )
}