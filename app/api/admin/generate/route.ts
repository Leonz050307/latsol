import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateDailySet } from '@/services/generator'

function todayKey(){ const d = new Date(); const s = new Date(d.getTime()+7*60*60*1000); return s.toISOString().slice(0,10) }

export async function POST(){
  try{
    await requireAdmin()
    const dateKey = todayKey()

    // wipe existing set and questions for today
    const old = await prisma.dailySet.findUnique({ where: { dateKey }, include: { questions: true } })
    if (old) {
      await prisma.choice.deleteMany({ where: { questionId: { in: old.questions.map(q=>q.id) } } })
      await prisma.question.deleteMany({ where: { dailySetId: old.id } })
      await prisma.dailySet.delete({ where: { id: old.id } })
    }

    // ensure subtests exist (idempotent)
    const subtests = await ensureSubtests()
    const set = await prisma.dailySet.create({ data: { dateKey } })
    await generateDailySet(set.id, subtests)
    return NextResponse.json({ message: 'Set harian baru dibuat.' })
  }catch(e:any){ return NextResponse.json({ error: e.message||'Error' }, { status: 400 }) }
}

async function ensureSubtests(){
  const defs = [
    { code:'TPS-IND', name:'TPS — Penalaran Induktif', durationMin:10, order:1 },
    { code:'TPS-DED', name:'TPS — Penalaran Deduktif', durationMin:10, order:2 },
    { code:'TPS-KUA', name:'TPS — Penalaran Kuantitatif', durationMin:10, order:3 },
    { code:'PPU', name:'Pengetahuan & Pemahaman Umum', durationMin:15, order:4 },
    { code:'PBM', name:'Pemahaman Bacaan & Menulis', durationMin:25, order:5 },
    { code:'PK', name:'Pengetahuan Kuantitatif', durationMin:20, order:6 },
    { code:'LIT-ID', name:'Literasi Bahasa Indonesia', durationMin:42, order:7 },
    { code:'LIT-EN', name:'Literasi Bahasa Inggris', durationMin:20, order:8 },
    { code:'PM', name:'Penalaran Matematika', durationMin:30, order:9 },
  ]
  const arr = [] as any[]
  for(const d of defs){
    let s = await prisma.subtest.findUnique({ where: { code: d.code } })
    if(!s) s = await prisma.subtest.create({ data: d })
    arr.push(s)
  }
  return arr
}
