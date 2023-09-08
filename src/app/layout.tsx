"use client";

import './globals.css'
import { Inter } from 'next/font/google'
import { AuthContextProvider } from "./context/AuthContext";
import NavBar from './components/NavBar';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-slate-900 ${inter.className}`}>
        <section className='w-full h-full absolute pattern-dots pattern-bg-transparent pattern-slate-950 pattern-size-6 -z-10'></section>
        <AuthContextProvider>
          <NavBar></NavBar>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}
