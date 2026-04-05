import { useState, useEffect } from 'react'
import { ArrowLeft, BrainCircuit, Rocket, ChevronRight, Loader2, AlertCircle, BookOpen, Check, LayoutGrid, FileType } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useGenerateSoal } from '../hooks/useSoal'
import { useDocuments } from '../hooks/useDocuments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function GenerateSoal() {
  const navigate = useNavigate()
  const generateMutation = useGenerateSoal()
  const { documents } = useDocuments()
  const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace('/api/v1', '')
  const [error, setError] = useState<string | null>(null)

  const [step, setStep] = useState(1)
  const [sourceType, setSourceType] = useState<'modul' | 'cp_atp' | 'manual'>('modul')
  const [modulId, setModulId] = useState('')
  const [cpAtpText, setCpAtpText] = useState('')
  const [pageRanges, setPageRanges] = useState('')

  const [mataPelajaran, setMataPelajaran] = useState('')
  const [topik, setTopik] = useState('')
  const [fase, setFase] = useState('')
  const [kelas, setKelas] = useState('')
  const [tipeSoal, setTipeSoal] = useState('pilihan_ganda')
  const [gayaSoal, setGayaSoal] = useState<string[]>(['formal_academic'])
  const [jumlahSoal, setJumlahSoal] = useState(20)
  const [difficulty, setDifficulty] = useState('sedang')
  const [includePembahasan, setIncludePembahasan] = useState(true)
  const [includeKunci, setIncludeKunci] = useState(true)
  const [includeGambar, setIncludeGambar] = useState(false)
  const [bloomLevels, setBloomLevels] = useState<string[]>([])
  const [activeProvider, setActiveProvider] = useState('AI Powered')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/settings/ai`)
        const data = await response.json()
        if (data && data.ai_provider) {
          const providers: Record<string, string> = {
            'gemini': 'Gemini 2.0',
            'groq': 'Groq Llama 3',
            'openrouter': 'OpenRouter'
          }
          setActiveProvider(providers[data.ai_provider] || data.ai_provider)
        }
      } catch (err) {
        console.error("Failed to fetch AI settings", err)
      }
    }
    fetchSettings()
  }, [])

  const tipeMap: Record<string, string> = {
    'PG': 'pilihan_ganda',
    'Isian': 'isian',
    'Essay': 'essay',
    'Mix': 'campuran',
  }

  const difficultyMap: Record<string, string> = {
    'Mudah': 'mudah',
    'Sedang': 'sedang',
    'Sulit': 'sulit',
    'Campur': 'campuran',
  }

  const bloomOptions = [
    { id: 'C1', label: 'C1', desc: 'Ingat' },
    { id: 'C2', label: 'C2', desc: 'Paham' },
    { id: 'C3', label: 'C3', desc: 'Terap' },
    { id: 'C4', label: 'C4', desc: 'Anals' },
    { id: 'C5', label: 'C5', desc: 'Eval' },
    { id: 'C6', label: 'C6', desc: 'Cipta' },
  ]

  const handleGenerate = async () => {
    setError(null)
    const loadingToast = toast.loading("AI sedang memproses...", {
      description: "Menyusun bank soal sesuai konfigurasi.",
    })

    try {
      const result = await generateMutation.mutateAsync({
        modul_id: sourceType === 'modul' && modulId ? modulId : undefined,
        mata_pelajaran: mataPelajaran,
        topik: topik || undefined,
        fase: fase || undefined,
        kelas: kelas || undefined,
        tipe_soal: tipeMap[tipeSoal] || tipeSoal,
        jumlah_soal: jumlahSoal,
        difficulty: difficultyMap[difficulty] || difficulty,
        gaya_soal: gayaSoal,
        include_pembahasan: includePembahasan,
        include_kunci: includeKunci,
        include_gambar: includeGambar,
        bloom_levels: bloomLevels,
        page_ranges: sourceType === 'modul' ? pageRanges : undefined,
        cp_atp_text: sourceType === 'cp_atp' ? cpAtpText : undefined,
        tipe_konten: sourceType === 'modul' ? 'modul_ajar' : sourceType === 'cp_atp' ? 'cp_tp' : 'input_manual',
      })

      toast.dismiss(loadingToast)
      toast.success("Berhasil!", { description: `${jumlahSoal} soal telah dibuat.` })
      navigate(`/soal/edit/${result.id}`)
    } catch (err: unknown) {
      toast.dismiss(loadingToast)
      const message = err instanceof Error && 'message' in err ? err.message : 'Gagal generate soal'
      setError(message)
      toast.error("Gagal", { description: message })
    }
  }

  const steps = sourceType === 'modul' ? [1, 2, 3] : [1, 3]

  return (
    <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 py-6 space-y-5 animate-in fade-in overflow-hidden">
      
      {/* ── HEADER: Compact & Professional ── */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="w-9 h-9 border-slate-200 rounded-lg shadow-sm">
            <Link to="/soal"><ArrowLeft className="w-5 h-5 text-slate-700" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Generate Soal</h1>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">{activeProvider} Infrastructure</p>
          </div>
        </div>
        
        {/* Compact Step Indicator Pilled */}
        <div className="hidden sm:flex items-center gap-2">
          {steps.map((s, idx) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase transition-all ring-1",
                step === s ? "bg-brand-500 text-white ring-brand-600 shadow-md scale-105" : 
                step > s ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-500 ring-slate-200"
              )}>
                {step > s ? <Check className="w-3 h-3" /> : <span>{idx + 1}</span>}
                <span className="hidden md:inline">{s === 1 ? 'Sumber' : s === 2 ? 'Filter' : 'Konfigurasi'}</span>
              </div>
              {idx < steps.length - 1 && <div className="w-4 h-[1px] bg-slate-200"></div>}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <p className="text-xs text-rose-700 font-bold uppercase tracking-wide">{error}</p>
        </div>
      )}

      {/* ── STEP 1: Source Selection ── */}
      {step === 1 && (
        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'modul', title: 'Modul PDF', icon: BookOpen, desc: 'Pilih file dari library', color: 'text-sky-600', bg: 'bg-sky-50' },
              { id: 'cp_atp', title: 'CP / ATP', icon: FileType, desc: 'Tempel teks kurikulum', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 'manual', title: 'Topik Manual', icon: LayoutGrid, desc: 'Tuliskan topik khusus', color: 'text-emerald-600', bg: 'bg-emerald-50' }
            ].map((src) => (
              <button
                key={src.id}
                onClick={() => setSourceType(src.id as any)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group",
                  sourceType === src.id ? "border-brand-500 bg-brand-50 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <div className={cn("p-2.5 rounded-lg shrink-0", src.bg, src.color)}>
                  <src.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-tight text-slate-800">{src.title}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{src.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm min-h-[220px]">
             {sourceType === 'modul' && (
               <div className="space-y-3">
                 <label className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse"></div>
                   Pilih Dokumen Sumber
                 </label>
                 <Select value={modulId} onValueChange={setModulId}>
                   <SelectTrigger className="h-11 border-2 border-slate-100 bg-slate-50/50 text-sm font-bold rounded-lg transition-all hover:bg-slate-50">
                     <SelectValue placeholder="-- Pilih Daftar Modul --" />
                   </SelectTrigger>
                   <SelectContent className="border border-slate-100 rounded-xl shadow-2xl">
                     {documents.map((doc) => (
                       <SelectItem key={doc.id} value={doc.id} className="font-bold py-2.5">{doc.filename}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
                 <p className="text-xs text-slate-500 font-bold italic tracking-wide">AI akan menganalisis konten PDF untuk menghasilkan butir soal yang relevan.</p>
               </div>
             )}

             {sourceType === 'cp_atp' && (
               <div className="space-y-3">
                 <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Paste Teks Kurikulum (CP/ATP)</label>
                 <Textarea
                   value={cpAtpText}
                   onChange={(e) => setCpAtpText(e.target.value)}
                   placeholder="Contoh: Peserta didik mampu mengidentifikasi sumber energi biomassa..."
                   className="h-40 border-2 border-slate-100 text-sm font-medium p-3 rounded-lg focus-visible:ring-brand-500/10 bg-slate-50/50"
                 />
               </div>
             )}

             {sourceType === 'manual' && (
               <div className="space-y-3">
                 <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Deskripsikan Topik Materi</label>
                 <Input
                   value={topik}
                   onChange={(e) => setTopik(e.target.value)}
                   placeholder="Contoh: Klasifikasi Makhluk Hidup - Kingdom Monera"
                   className="h-11 border-2 border-slate-100 text-sm font-bold p-3 rounded-lg bg-slate-50/50"
                 />
               </div>
             )}
          </div>
        </div>
      )}

      {/* ── STEP 2: PDF Fragment Filter ── */}
      {step === 2 && (
        <div className="space-y-4 animate-in slide-in-from-right-2 duration-300">
           <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-4 border border-slate-200 rounded-xl overflow-hidden shadow-lg bg-slate-900 group h-[450px]">
                <div className="bg-slate-800 px-4 py-2 border-b border-white/5 flex items-center justify-between">
                  <span className="text-slate-200 font-black text-xs uppercase tracking-widest">Context Preview</span>
                  <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                </div>
                <iframe
                  src={`${BASE_URL}/uploads/${documents.find(d => d.id === modulId)?.filepath?.split('/').pop()}`}
                  className="w-full h-full bg-slate-800"
                />
              </div>
              
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-brand-900 uppercase tracking-tight">Rentang Halaman</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-brand-800 uppercase tracking-widest">Halaman Spesifik (Filter)</label>
                    <Input
                      value={pageRanges}
                      onChange={(e) => setPageRanges(e.target.value)}
                      placeholder="Contoh: 2-4, 7, 10"
                      className="h-10 border-2 border-white bg-white/80 rounded-lg text-sm font-black text-brand-900 shadow-inner"
                    />
                    <p className="text-xs text-brand-700/80 font-bold italic tracking-wide">* Biarkan kosong untuk memproses seluruh dokumen.</p>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl">
                  <p className="text-xs text-slate-600 font-bold uppercase leading-relaxed text-center">
                    Gunakan filter halaman untuk hasil yang jauh lebih akurat & fokus pada materi tertentu.
                  </p>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* ── STEP 3: Professional Configuration ── */}
      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 animate-in slide-in-from-right-2 duration-300">
          
          {/* Left Column: Metadata & Core Parameters */}
          <div className="md:col-span-3 space-y-4 bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-xl p-5 shadow-sm">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Mata Pelajaran *</label>
              <Input
                value={mataPelajaran}
                onChange={(e) => setMataPelajaran(e.target.value)}
                placeholder="Matematika, IPA, Bahasa Indonesia..."
                className="h-10 border-2 border-slate-50 bg-slate-50/50 text-sm font-bold rounded-lg focus-visible:ring-brand-500/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Fase Kurikulum</label>
                <Select value={fase} onValueChange={setFase}>
                  <SelectTrigger className="h-10 border-2 border-slate-50 bg-slate-50/50 text-xs font-bold rounded-lg">
                    <SelectValue placeholder="Pilih Fase" />
                  </SelectTrigger>
                  <SelectContent className="border border-slate-100 rounded-lg">
                    {['Fase A', 'Fase B', 'Fase C', 'Fase D', 'Fase E', 'Fase F'].map((f) => (
                      <SelectItem key={f} value={f} className="font-bold text-xs py-2">{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Target Kelas</label>
                <Select value={kelas} onValueChange={setKelas}>
                  <SelectTrigger className="h-10 border-2 border-slate-50 bg-slate-50/50 text-xs font-bold rounded-lg">
                    <SelectValue placeholder="Kelas" />
                  </SelectTrigger>
                  <SelectContent className="border border-slate-100 rounded-lg max-h-48">
                    {['1 SD','2 SD','3 SD','4 SD','5 SD','6 SD','7 SMP','8 SMP','9 SMP','10 SMA','11 SMA','12 SMA'].map((k) => (
                      <SelectItem key={k} value={`Kelas ${k}`} className="font-bold text-xs py-1.5">Kelas {k}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Topik Fokus AI</label>
              <Input
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                placeholder="Fokus pada topik spesifik..."
                className="h-10 border-2 border-slate-50 bg-slate-50/50 text-sm font-bold rounded-lg"
              />
            </div>

            <div className="space-y-3 pt-1">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Kesulitan & Tipe Soal</label>
              <div className="flex flex-wrap gap-2">
                 <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="w-[110px] h-9 border-2 border-slate-100 text-xs font-black uppercase rounded-lg bg-white">
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                       {Object.entries(difficultyMap).map(([l, v]) => <SelectItem key={v} value={v} className="text-xs font-bold">{l}</SelectItem>)}
                    </SelectContent>
                 </Select>

                 <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                    {Object.keys(tipeMap).map((t) => (
                      <button 
                        key={t} onClick={() => setTipeSoal(tipeMap[t])}
                        className={cn(
                          "px-3 py-1 rounded-md text-xs font-black uppercase transition-all",
                          tipeSoal === tipeMap[t] ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                      >{t}</button>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pedagogical & Generation Settings */}
          <div className="md:col-span-2 space-y-4 bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-xl p-5 shadow-sm">
            
            {/* Bloom Taxonomy: Optimized 3-Column Grid */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Taksonomi Bloom <span className="text-slate-400 italic">(Opsional)</span></label>
              <div className="grid grid-cols-3 gap-1.5">
                {bloomOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (bloomLevels.includes(opt.id)) setBloomLevels(bloomLevels.filter(b => b !== opt.id))
                      else setBloomLevels([...bloomLevels, opt.id])
                    }}
                    className={cn(
                      "flex flex-col items-center py-2 px-1 rounded-lg border-2 transition-all",
                      bloomLevels.includes(opt.id) ? "border-brand-300 bg-brand-50 shadow-sm" : "border-slate-50 bg-slate-50/30 hover:border-slate-100"
                    )}
                  >
                    <span className={cn("text-xs font-black tracking-tight", bloomLevels.includes(opt.id) ? "text-brand-700" : "text-slate-600")}>{opt.label}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase leading-none">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gaya Bahasa as Toggle Chips */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Preferensi Gaya Soal</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'light_story', label: 'Cerita' },
                  { id: 'formal_academic', label: 'Akademik' },
                  { id: 'case_study', label: 'Kasus' },
                  { id: 'standard_exam', label: 'Ujian' },
                  { id: 'hots', label: 'HOTS' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      if (gayaSoal.includes(st.id)) { if (gayaSoal.length > 1) setGayaSoal(gayaSoal.filter(s => s !== st.id)) }
                      else setGayaSoal([...gayaSoal, st.id])
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-xs font-black uppercase transition-all tracking-wider",
                      gayaSoal.includes(st.id) ? "bg-indigo-600 border-indigo-700 text-white shadow-sm" : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                    )}
                  >{st.label}</button>
                ))}
              </div>
            </div>

            {/* Config & Toggle Summary — Single line per option */}
            <div className="grid grid-cols-1 gap-2 pt-1">
               <div className="flex items-center justify-between gap-4 py-2 px-3 bg-slate-50/50 rounded-lg border border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight">Jumlah Soal</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic leading-none">Max 50 soal</span>
                  </div>
                  <div className="flex items-center gap-3 w-1/2">
                    <input 
                      type="range" min="1" max="50" value={jumlahSoal} 
                      onChange={(e) => setJumlahSoal(Number(e.target.value))} 
                      className="grow h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-500"
                    />
                    <span className="shrink-0 bg-brand-500 text-white font-black text-xs px-2 py-0.5 rounded shadow-sm">{jumlahSoal}</span>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Solusi', active: includePembahasan, toggle: () => setIncludePembahasan(!includePembahasan), on: 'bg-indigo-500' },
                    { label: 'Kunci', active: includeKunci, toggle: () => setIncludeKunci(!includeKunci), on: 'bg-emerald-500' },
                    { label: 'Gambar', active: includeGambar, toggle: () => setIncludeGambar(!includeGambar), on: 'bg-sky-500' }
                  ].map((opt, i) => (
                    <button key={i} onClick={opt.toggle} className={cn(
                      "flex flex-col items-center gap-1.5 py-2 px-1 rounded-lg border transition-all",
                      opt.active ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50 border-transparent opacity-60"
                    )}>
                       <span className="text-xs font-black uppercase tracking-tighter text-slate-700">{opt.label}</span>
                       <div className={cn("w-7 h-4 rounded-full relative transition-all", opt.active ? opt.on : "bg-slate-300")}>
                          <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all", opt.active ? "right-0.5" : "left-0.5")}></div>
                       </div>
                    </button>
                  ))}
               </div>
            </div>

          </div>
        </div>
      )}

      {/* ── NAVIGATION: Sticky & Clean ── */}
      <div className="pt-2 sticky bottom-0 z-30 bg-slate-50/80 backdrop-blur-md pb-2 -mx-4 px-4 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          disabled={step === 1 || generateMutation.isPending}
          onClick={() => {
            if (step === 3 && sourceType !== 'modul') setStep(1)
            else setStep(step - 1)
          }}
          className="h-10 px-6 rounded-xl text-slate-500 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900"
        >
          ← Kembali
        </Button>
        
        {step === 3 && (
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-bold italic tracking-wide animate-pulse">
            <BrainCircuit className="w-3.5 h-3.5" />
            AI Siap Mengolah {sourceType === 'modul' ? 'Modul' : 'Topik'} Anda
          </div>
        )}

        {step < 3 ? (
          <Button
            size="sm"
            onClick={() => {
              if (step === 1 && sourceType !== 'modul') setStep(3)
              else setStep(step + 1)
            }}
            disabled={(step === 1 && sourceType === 'modul' && !modulId) || (step === 1 && sourceType === 'cp_atp' && !cpAtpText) || (step === 1 && sourceType === 'manual' && !topik)}
            className="h-11 px-8 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-lg hover:translate-y-[-2px] transition-all flex items-center gap-2"
          >
            Lanjutkan <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !mataPelajaran}
            className="h-11 px-10 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 transition-all hover:translate-y-[-2px] flex items-center gap-3 grow max-w-xs"
          >
            {generateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-5 h-5" />}
            {generateMutation.isPending ? 'Memproses...' : 'Generate Bank Soal'}
          </Button>
        )}
      </div>

    </div>
  )
}
