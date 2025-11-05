import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { LoginSchema } from '@/lib/z'
import { compare } from '@/lib/crypto'
import { createSession } from '@/lib/auth'

export async function POST(req: Request){
  try{
    const body = await req.json(); const { email, password } = LoginSchema.parse(body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'Akun tidak ditemukan.' }, { status: 400 })
    if (!await compare(password, user.passwordHash)) return NextResponse.json({ error: 'Password salah.' }, { status: 400 })
    await createSession(user.id)
    return NextResponse.json({ message: 'Login sukses', isPremium: user.isPremium })
  }catch(e:any){ return NextResponse.json({ error: e.message||'Error' }, { status: 400 }) }
}
