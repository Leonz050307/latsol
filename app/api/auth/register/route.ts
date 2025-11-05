import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { RegisterSchema } from '@/lib/z'
import { hash } from '@/lib/crypto'
import { createSession } from '@/lib/auth'

export async function POST(req: Request){
  try{
    const body = await req.json(); const data = RegisterSchema.parse(body)
    const existsDevice = await prisma.user.findFirst({ where: { deviceHash: data.deviceHash } })
    if (existsDevice) return NextResponse.json({ error: 'Perangkat ini sudah pernah digunakan untuk mendaftar.' },{ status: 400 })
    const existsEmail = await prisma.user.findUnique({ where: { email: data.email } })
    if (existsEmail) return NextResponse.json({ error: 'Email sudah terdaftar.' },{ status: 400 })
    const role = (process.env.ADMIN_EMAIL && data.email === process.env.ADMIN_EMAIL) ? 'ADMIN' : 'USER'
    const user = await prisma.user.create({ data: { email: data.email, name: data.name, passwordHash: await hash(data.password), role, deviceHash: data.deviceHash } })
    await createSession(user.id)
    return NextResponse.json({ message: 'Registrasi sukses' })
  }catch(e:any){ return NextResponse.json({ error: e.message||'Error' }, { status: 400 }) }
}
