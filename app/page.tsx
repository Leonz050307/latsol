"use client"
import { BentoGrid, BentoItem } from '@/components/Bento'
import Glass from '@/components/Glass'
import { RegisterForm, LoginForm } from '@/components/Forms'
import React, { useState } from 'react'

export default function Page(){
  const [lofi, setLofi] = useState(false)
  return (
    <main className="space-y-8">
      <Glass className="p-8">
        <h1 className="text-4xl font-black mb-2">Latihan Harian UTBK–SNBT 2025</h1>
        <p className="opacity-85">Glass + Bento UI, warna ceria, fokus belajar. Lofi hanya di landing; saat mengerjakan tidak ada musik.</p>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={()=>setLofi(v=>!v)} className="px-3 py-1 rounded bg-brand-500 hover:bg-brand-600">{lofi? 'Matikan Lofi' : 'Nyalakan Lofi'}</button>
          <a href="#auth" className="px-3 py-1 rounded bg-white/70 text-black">Mulai Sekarang</a>
        </div>
      </Glass>

      {lofi && (
        <div className="glass p-2">
          <iframe className="w-full aspect-video rounded" src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&controls=1" title="lofi" allow="autoplay; encrypted-media"></iframe>
        </div>
      )}

      <BentoGrid>
        <BentoItem title="TPS" desc="Penalaran Umum, PPU, PBM, PK" span="col-span-3">
          <p>Soal harian disusun mengikuti kisi-kisi resmi dan model terbaru (MCQ, kompleks, isian, benar/salah).</p>
        </BentoItem>
        <BentoItem title="Literasi" desc="BI & Inggris" span="col-span-3">
          <p>Fokus literasi membaca: memahami, mengevaluasi, menginterpretasi teks saintek & sos-hum.</p>
        </BentoItem>
        <BentoItem title="Penalaran Matematika" desc="AKM-aligned" span="col-span-2">
          <p>Bilangan, fungsi, geometri, peluang — konteks nyata dan multi-langkah.</p>
        </BentoItem>
        <BentoItem title="Batasan Harian" desc="1x per akun" span="col-span-2">
          <p>Fair-play: 1 attempt per hari. Perangkat juga unik: 1 device hanya 1 akun.</p>
        </BentoItem>
        <BentoItem title="Admin" desc="Generate manual" span="col-span-2">
          <p>Admin dapat mengganti seluruh bank soal harian dengan sekali klik.</p>
        </BentoItem>
      </BentoGrid>

      <div id="auth" className="grid md:grid-cols-2 gap-4">
        <Glass className="p-6"><h2 className="text-2xl font-bold mb-3">Daftar</h2><RegisterForm/></Glass>
        <Glass className="p-6"><h2 className="text-2xl font-bold mb-3">Masuk</h2><LoginForm/></Glass>
      </div>
    </main>
  )
}
