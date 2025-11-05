import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import type { Prisma } from '@prisma/client'

export async function POST(req:Request){
  try{
    const user = await getSession(); if(!user) return NextResponse.json({ error:'Unauthorized'},{ status:401 })
    const { attemptId, questionId, qtype, value } = await req.json()
    const attempt = await prisma.attempt.findUnique({ where: { id: attemptId } })
    if (!attempt || attempt.userId !== user.id) return NextResponse.json({ error:'Invalid attempt'},{ status:400 })
    const q = await prisma.question.findUnique({ where: { id: questionId }, include: { choices: true } })
    if (!q) return NextResponse.json({ error:'Question not found'},{ status:400 })

    let payload:any, isCorrect: boolean | null = null
    if (qtype === 'SHORT') {
      payload = { text: value }
      if (q.meta && (q.meta as any).answer) {
        isCorrect = String(value ?? '').trim().toLowerCase() === String((q.meta as any).answer).trim().toLowerCase()
      }
    }
    else if (qtype === 'TRUE_FALSE' || qtype === 'MCQ') {
      payload = { selected: value }
      const ch = q.choices.find(c=>c.label===String(value))
      isCorrect = ch? ch.isCorrect : null
    }
    else if (qtype === 'COMPLEX') {
      const arr = (Array.isArray(value) ? value : [value]).map(v=>String(v)).filter(Boolean)
      payload = { selected: arr }
      const correct = q.choices.filter(c=>c.isCorrect).map(c=>c.label).sort().join(',')
      const given = arr.slice().sort().join(',')
      isCorrect = correct===given
    }

    const key: Prisma.AnswerAttemptIdQuestionIdCompoundUniqueInput = { attemptId: attempt.id, questionId: q.id }
    await prisma.answer.upsert({ where: { attemptId_questionId: key },
      create: { attemptId: attempt.id, questionId: q.id, qtype: q.type, payload, isCorrect },
      update: { payload, isCorrect } })

    return NextResponse.json({ ok:true })
  }catch(e:any){ return NextResponse.json({ error: e.message||'Error' }, { status: 400 }) }
}
