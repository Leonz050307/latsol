import './globals.css'
import React from 'react'
export const metadata = { title: process.env.NEXT_PUBLIC_APP_NAME || 'SNBT Daily' }
export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="id"><body>
      <div className="max-w-6xl mx-auto p-4">
        <nav className="flex items-center justify-between mb-6">
          <div className="text-2xl font-extrabold">{process.env.NEXT_PUBLIC_APP_NAME || 'SNBT Daily'}</div>
          <a className="opacity-80 hover:opacity-100" href="/dashboard">Dashboard</a>
        </nav>
        {children}
        <footer className="mt-12 opacity-60 text-sm">© {new Date().getFullYear()} SNBT Daily</footer>
      </div>
    </body></html>
  )
}
