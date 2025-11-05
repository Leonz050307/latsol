import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { prisma } from './db'

const APP_SECRET = process.env.APP_SECRET!
export type SessionUser = { id: string; email: string; role: 'USER'|'ADMIN' }

export async function createSession(userId: string) {
  const token = randomUUID()
  const expires = new Date(Date.now() + 1000*60*60*24*7)
  await prisma.session.create({ data: { userId, token, expiresAt: expires } })
  const jwtToken = jwt.sign({ t: token }, APP_SECRET)
  cookies().set('sid', jwtToken, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' })
}

export async function getSession(): Promise<SessionUser|null> {
  try {
    const cookie = cookies().get('sid')?.value
    if (!cookie) return null
    const { t } = jwt.verify(cookie, APP_SECRET) as any
    const s = await prisma.session.findUnique({ where: { token: t }, include: { user: true } })
    if (!s || s.expiresAt < new Date()) return null
    return { id: s.user.id, email: s.user.email, role: s.user.role }
  } catch { return null }
}

export async function requireAdmin() {
  const u = await getSession()
  if (!u || u.role !== 'ADMIN') throw new Error('UNAUTHORIZED')
  return u
}
