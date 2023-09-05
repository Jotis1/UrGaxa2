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
      <body className={inter.className}>
        <AuthContextProvider>
          <NavBar></NavBar>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  )
}
