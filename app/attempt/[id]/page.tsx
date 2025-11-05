import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import React from 'react'

export default async function AttemptPage({ params }:{ params: { id: string }}){
  const user = await getSession(); if(!user) return <div className="card">Harap masuk.</div>
  const attempt = await prisma.attempt.findUnique({ where: { id: params.id }, include: { answers: true } })
  if(!attempt || attempt.userId !== user.id) return <div className="card">Attempt tidak ditemukan.</div>
  const userFull = await prisma.user.findUnique({ where: { id: user.id } })
  const set = await prisma.dailySet.findUnique({ where: { dateKey: attempt.dateKey }, include: { questions: { include: { choices: true, subtest: true } } } })
  if(!set) return <div className="card">Set tidak ditemukan.</div>

  // Group by subtest
  const groups = new Map<string, any[]>();
  for(const q of set.questions){ const key = q.subtest.name; if(!groups.has(key)) groups.set(key, []); groups.get(key)!.push(q) }

  return <div className="space-y-6">
    {[...groups.entries()].map(([name, qs]) => (
      <section key={name} className="card">
        <h2 className="text-2xl font-bold mb-2">{name}</h2>
        {qs.map((q:any, i:number)=> <QuestionBlock key={q.id} q={q} idx={i+1} attemptId={attempt.id} isPremium={!!userFull?.isPremium} />)}
      </section>
    ))}
  </div>
}

function isTF(q:any){ return q.type==='TRUE_FALSE' }
function isMCQ(q:any){ return q.type==='MCQ' }
function isSHORT(q:any){ return q.type==='SHORT' }
function isCOMPLEX(q:any){ return q.type==='COMPLEX' }

async function submitAnswer(formData: FormData){
  'use server'
  const attemptId = String(formData.get('attemptId') || '')
  const questionId = String(formData.get('questionId') || '')
  const qtype = String(formData.get('qtype') || '')
  const values = formData.getAll('value')
  const value = values.length > 1 ? values : (values[0] ?? '')
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  await fetch(`${base}/api/attempt/answer`, {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attemptId, questionId, qtype, value })
  })
}

function QuestionBlock({ q, idx, attemptId, isPremium }:{ q:any; idx:number; attemptId:string; isPremium:boolean }){
  const waTarget = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WA ?? '6281234567890'}?text=Halo%20Admin%2C%20saya%20ingin%20upgrade%20Premium%20SNBT%20Daily.`
  return (
    <form action={submitAnswer} className="mb-4 p-4 glass rounded">
      <div className="font-semibold mb-2">{idx}. {q.stem}</div>
      {isMCQ(q) && <div>{q.choices.map((c:any)=>(<label key={c.id} className="block"><input type="radio" name="value" value={c.label} className="mr-2"/> {c.label}. {c.text}</label>))}</div>}
      {isTF(q) && <div className="flex gap-2"><label><input type="radio" name="value" value="T"/> Benar</label><label><input type="radio" name="value" value="F"/> Salah</label></div>}
      {isSHORT(q) && <input name="value" placeholder="Jawaban singkat" className="w-full p-2 rounded text-black"/>}
      {isCOMPLEX(q) && <div className="grid grid-cols-2 gap-2">{q.choices.map((c:any)=>(<label key={c.id} className="glass p-2 rounded flex items-center"><input type="checkbox" name="value" value={c.label} className="mr-2"/> {c.text}</label>))}</div>}
      <input type="hidden" name="attemptId" value={attemptId}/>
      <input type="hidden" name="questionId" value={q.id}/>
      <input type="hidden" name="qtype" value={q.type}/>
      <button className="mt-2 px-3 py-1 rounded bg-brand-500">Simpan Jawaban</button>
      {q.explanation && (
        isPremium ? (
          <div className="mt-3 p-3 rounded bg-white/80 text-black"><b>Pembahasan:</b> {q.explanation}</div>
        ) : (
          <div className="mt-3 p-3 rounded glass">
            <div className="opacity-80">Pembahasan lengkap tersedia untuk pengguna <b>Premium</b>.</div>
            <a className="inline-block mt-2 px-3 py-1 rounded bg-green-500 hover:bg-green-600" target="_blank" rel="noreferrer" href={waTarget}>Chat Admin via WhatsApp</a>
          </div>
        )
      )}
    </form>
  )
}
