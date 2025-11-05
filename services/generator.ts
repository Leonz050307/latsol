import { prisma } from '@/lib/db'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

type Block = { type: 'MCQ'|'COMPLEX'|'TRUE_FALSE'|'SHORT'; stem: string; meta?: any; explanation?: string; choices?: { label: string; text: string; isCorrect?: boolean }[] }

type SubtestLike = { id: string; code: string; name: string }

export async function generateDailySet(dailySetId: string, subtests: SubtestLike[]){
  for(const s of subtests){
    const blocks = await generateForSubtest(s)
    for(const b of blocks){
      const q = await prisma.question.create({ data: { dailySetId, subtestId: s.id, type: b.type as any, stem: b.stem, meta: b.meta||{}, explanation: b.explanation||null } })
      if (b.choices) {
        for(const c of b.choices){
          await prisma.choice.create({ data: { questionId: q.id, label: c.label, text: c.text, isCorrect: !!c.isCorrect } })
        }
      }
    }
  }
}

async function generateForSubtest(s: SubtestLike): Promise<Block[]>{
  if (!openai) return offlineStub(s)
  try {
    const prompt = buildPrompt(s)
    const res = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.6
    })
    const text = (res.output?.[0] as any)?.content?.[0]?.text as string | undefined
    if (!text) throw new Error('Empty response from OpenAI')
    const parsed: Block[] = JSON.parse(text)
    return parsed
  } catch (err) {
    console.error('generateForSubtest fallback', err)
    return offlineStub(s)
  }
}

function buildPrompt(s:SubtestLike){
  return `Anda adalah generator soal UTBK SNBT 2025. Kembalikan OUTPUT berupa JSON array Block[] TANPA penjelasan lain. Setiap Block memiliki: type, stem, meta(optional), explanation(optional), choices(optional).
- Jenis type:
  - MCQ (pilihan ganda A–E, tepat 5 pilihan, 1 benar)
  - COMPLEX (pilihan majemuk kompleks: beberapa pernyataan dengan 2 opsi, tandai isCorrect pada choices)
  - TRUE_FALSE (satu pernyataan, jawaban Benar/Salah; simpan jawaban di meta.answer = 'T' atau 'F')
  - SHORT (isian singkat; simpan jawaban tepat di meta.answer)
- Bahasa Indonesia, konteks sesuai subtest: ${s.name}
- Kualitas: ringkas, tidak ambigu, sesuai kisi-kisi berikut ringkas:
  * TPS Induktif: kesesuaian pernyataan, sebab-akibat
  * TPS Deduktif: simpulan logis, analitik
  * TPS Kuantitatif: kuantitas, relasi sederhana, aritmatika dasar
  * PPU: ide pokok, makna, sinonim, koherensi
  * PBM: ide pokok, kepaduan, kalimat efektif, ejaan/konjungsi
  * PK: bilangan, aljabar/fungsi, geometri, statistika/peluang
  * Literasi BI/EN: reading literacy dengan konteks saintek & sos-hum (prompt BI)
  * Penalaran Matematika: konteks real-life, multi-langkah, akurat
- Buat 10 Block per subtest dengan komposisi: 3 MCQ, 2 COMPLEX, 2 TRUE_FALSE, 3 SHORT.
- Sertakan explanation singkat (alasan jawaban) maksimal 2 kalimat.
- Untuk MCQ, tandai choices.isCorrect.
- Untuk SHORT, jawabannya berupa angka/kata/frasa pendek, case-insensitive.
- Kembalikan HANYA JSON yang valid.`
}

function offlineStub(s:SubtestLike): Block[]{
  const blocks: Block[] = []
  const mkId = (i:number)=> String.fromCharCode(65+i)
  for (let i=0;i<3;i++) {
    blocks.push({
      type:'MCQ',
      stem:`[${s.code}] Pilih jawaban benar #${i+1}`,
      choices: Array.from({length:5},(_,k)=>({ label: mkId(k), text: `Pilihan ${mkId(k)}`, isCorrect: k===0 })),
      explanation: 'Kunci A (stub).'
    })
  }
  for (let i=0;i<2;i++) {
    blocks.push({
      type:'COMPLEX',
      stem:`[${s.code}] Tentukan benar/salah tiap pernyataan #${i+1}`,
      choices: [ {label:'A',text:'Pernyataan 1',isCorrect:true}, {label:'B',text:'Pernyataan 2',isCorrect:false}, {label:'C',text:'Pernyataan 3',isCorrect:true} ],
      explanation:'Dua benar satu salah (stub).'
    })
  }
  for (let i=0;i<2;i++) {
    blocks.push({
      type:'TRUE_FALSE',
      stem:`[${s.code}] Pernyataan benar/salah #${i+1}`,
      meta:{ answer:'T' },
      explanation:'True (stub).'
    })
  }
  for (let i=0;i<3;i++) {
    blocks.push({
      type:'SHORT',
      stem:`[${s.code}] Isian singkat #${i+1}`,
      meta:{ answer:'contoh' },
      explanation:'Jawaban "contoh" (stub).'
    })
  }
  return blocks
}
