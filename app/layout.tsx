import type { Metadata } from 'next'
import { Cormorant_Garamond, Rozha_One } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    variable: '--font-cormorant',
    weight: ['400', '600', '700'],
})

const rozha = Rozha_One({
    subsets: ['latin', 'devanagari'],
    variable: '--font-rozha',
    weight: ['400'],
})

export const metadata: Metadata = {
    title: 'Sky Library',
    description: 'A 3D Sky Library',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${cormorant.variable} ${rozha.variable} font-sans`}>{children}</body>
        </html>
    )
}
