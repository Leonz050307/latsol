import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const form = await req.formData()
    const email = String(form.get('email') || '')
    const action = String(form.get('action') || 'grant')
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    const isPremium = action === 'grant'
    await prisma.user.update({ where: { id: user.id }, data: { isPremium } })
    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'Error' }, { status: 400 })
  }
}
