import { requireAdmin } from '@/lib/auth'

export default async function Admin(){
  await requireAdmin()
  async function gen(){
    'use server'
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    await fetch(`${base}/api/admin/generate`, { method: 'POST' })
  }
  return <div className="space-y-4">
    <div className="card">
      <h1 className="text-2xl font-bold mb-3">Panel Admin</h1>
      <form action={gen}><button className="px-4 py-2 rounded bg-red-500 hover:bg-red-600">Ganti Semua Soal Harian (Generate Baru)</button></form>
      <p className="mt-3 opacity-80 text-sm">Tindakan ini akan menghapus semua soal harian yang ada dan membuat set baru untuk tanggal hari ini.</p>
    </div>
    <div className="card">
      <h2 className="text-xl font-semibold mb-2">Kelola Premium</h2>
      <form action={async(formData)=>{
        'use server'
        const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        await fetch(`${base}/api/admin/premium`,{ method:'POST', body: formData })
      }} className="flex gap-2 items-center">
        <input name="email" placeholder="Email pengguna" className="p-2 rounded text-black"/>
        <select name="action" className="p-2 rounded text-black"><option value="grant">Grant</option><option value="revoke">Revoke</option></select>
        <button className="px-3 py-1 rounded bg-brand-500">Simpan</button>
      </form>
    </div>
  </div>
}
