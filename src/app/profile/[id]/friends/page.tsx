"use client";

import ProfileLayout from "@/app/components/ProfileLayout";

export default function Page({ params }: { params: { id: string } }) {
    return (
        <ProfileLayout active={3} params={params}>
            <p>Hola</p>
        </ProfileLayout>
    )
}