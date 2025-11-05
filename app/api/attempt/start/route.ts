import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

function todayKey(){ const d = new Date(); const s = new Date(d.getTime()+7*60*60*1000); return s.toISOString().slice(0,10) }

export async function POST(){
  try{
    const user = await getSession(); if(!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const dateKey = todayKey()
    const exists = await prisma.attempt.findUnique({ where: { userId_dateKey: { userId: user.id, dateKey } } })
    if (exists) return NextResponse.json({ error: 'Anda sudah mengambil latihan hari ini.' }, { status: 400 })
    const set = await prisma.dailySet.findUnique({ where: { dateKey } })
    if (!set) return NextResponse.json({ error: 'Belum ada set harian.' }, { status: 400 })
    const att = await prisma.attempt.create({ data: { userId: user.id, dateKey } })
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return NextResponse.redirect(`${base}/attempt/${att.id}`)
  }catch(e:any){ return NextResponse.json({ error: e.message }, { status: 400 }) }
}
