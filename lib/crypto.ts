import bcrypt from 'bcryptjs'
export async function hash(p: string) { return bcrypt.hash(p, 10) }
export async function compare(p: string, h: string) { return bcrypt.compare(p, h) }
