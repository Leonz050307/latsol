import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import Link from 'next/link'

function todayKey(){ const d = new Date(); const s = new Date(d.getTime()+7*60*60*1000) // Asia/Jakarta shift if server UTC
  return s.toISOString().slice(0,10) }

export default async function Dashboard(){
  const user = await getSession(); if(!user) return <div className="card">Harap masuk.</div>
  const me = await prisma.user.findUnique({ where: { id: user.id } })
  const dateKey = todayKey()
  const attempt = await prisma.attempt.findUnique({ where: { userId_dateKey: { userId: user.id, dateKey } } })
  const set = await prisma.dailySet.findUnique({ where: { dateKey }, include: { questions: true } })
  const waUpgrade = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WA || '6281234567890'}?text=Halo%20Admin%2C%20upgrade%20Premium%20SNBT%20Daily`
  return (
    <div className="space-y-4">
      <div className="card"><div className="text-xl">Halo, {user.email}</div><div className="opacity-70">{user.role==='ADMIN'?'Admin':'Peserta'}{me?.isPremium ? ' • Premium' : ''}</div>{!me?.isPremium && <div className="mt-2"><a className="px-3 py-1 rounded bg-green-500 hover:bg-green-600" target="_blank" rel="noreferrer" href={waUpgrade}>Upgrade Premium</a></div>}</div>
      {user.role==='ADMIN' && <div className="card"><Link className="underline" href="/admin">Buka Panel Admin</Link></div>}
      {!set && <div className="card">Belum ada set harian hari ini.</div>}
      {set && !attempt && <div className="card"><form action="/api/attempt/start" method="post"><button className="px-4 py-2 rounded bg-brand-500 hover:bg-brand-600">Mulai Latihan Hari Ini</button></form></div>}
      {attempt && <div className="card">Anda sudah mengambil latihan hari ini. <Link className="underline" href={`/attempt/${attempt.id}`}>Lanjutkan / Tinjau</Link></div>}
    </div>
  )
}
