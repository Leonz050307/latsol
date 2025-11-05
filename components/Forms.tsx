"use client"
import React, { useState, useEffect } from 'react'

function getDeviceHash(){
  const nav = window.navigator as any
  const fp = {
    ua: nav.userAgent,
    lang: nav.language,
    plat: nav.platform,
    cores: nav.hardwareConcurrency || 0,
    touch: nav.maxTouchPoints || 0,
    vendor: nav.vendor || ''
  }
  // Simple FNV-1a
  const raw = `${fp.ua}|${fp.lang}|${fp.plat}|${fp.cores}|${fp.touch}|${fp.vendor}`
  let h = 2166136261 >>> 0
  for (let i=0;i<raw.length;i++){ h ^= raw.charCodeAt(i); h = Math.imul(h, 16777619) }
  return `d_${h >>> 0}`
}

export function RegisterForm(){
  const [email,setEmail] = useState('')
  const [name,setName] = useState('')
  const [password,setPassword] = useState('')
  const [deviceHash,setDeviceHash] = useState('')
  const [msg,setMsg] = useState('')
  useEffect(()=>{ setDeviceHash(getDeviceHash()) },[])
  async function submit(e:React.FormEvent){ e.preventDefault()
    const r = await fetch('/api/auth/register',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,name,password,deviceHash}) })
    const j = await r.json(); setMsg(j.message||j.error||'')
    if(r.ok) location.href='/dashboard'
  }
  return <form onSubmit={submit} className="space-y-3">
    <input required placeholder="Email" className="w-full p-3 rounded glass text-black" value={email} onChange={e=>setEmail(e.target.value)} />
    <input required placeholder="Nama" className="w-full p-3 rounded glass text-black" value={name} onChange={e=>setName(e.target.value)} />
    <input required type="password" placeholder="Password" className="w-full p-3 rounded glass text-black" value={password} onChange={e=>setPassword(e.target.value)} />
    <button className="px-4 py-2 rounded bg-brand-500 hover:bg-brand-600">Daftar</button>
    <div className="text-sm opacity-80">{msg}</div>
  </form>
}

export function LoginForm(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [msg,setMsg] = useState('')
  async function submit(e:React.FormEvent){ e.preventDefault()
    const r = await fetch('/api/auth/login',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password}) })
    const j = await r.json(); setMsg(j.message||j.error||'')
    if(r.ok) location.href='/dashboard'
  }
  return <form onSubmit={submit} className="space-y-3">
    <input required placeholder="Email" className="w-full p-3 rounded glass text-black" value={email} onChange={e=>setEmail(e.target.value)} />
    <input required type="password" placeholder="Password" className="w-full p-3 rounded glass text-black" value={password} onChange={e=>setPassword(e.target.value)} />
    <button className="px-4 py-2 rounded bg-brand-500 hover:bg-brand-600">Masuk</button>
    <div className="text-sm opacity-80">{msg}</div>
  </form>
}
