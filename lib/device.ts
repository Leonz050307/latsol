import UAParser from 'ua-parser-js'

export function makeDeviceHash(fp: { ua: string; lang: string; plat: string; cores: number; touch: number; vendor: string }) {
  // Simple deterministic hash (do NOT use for cryptographic identity)
  const raw = `${fp.ua}|${fp.lang}|${fp.plat}|${fp.cores}|${fp.touch}|${fp.vendor}`
  let h = 2166136261 >>> 0
  for (let i=0;i<raw.length;i++){ h ^= raw.charCodeAt(i); h = Math.imul(h, 16777619) }
  return `d_${h >>> 0}`
}

export function parseUA(ua: string){ return new UAParser(ua).getResult() }
