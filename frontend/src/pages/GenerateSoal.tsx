import { useState } from 'react'
import { ArrowLeft, CheckCircle2, BrainCircuit, Rocket, ChevronRight, Loader2, AlertCircle, BookOpen, Check, LayoutGrid, FileType } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useGenerateSoal } from '../hooks/useSoal'
import { useDocuments } from '../hooks/useDocuments'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function GenerateSoal() {
  const navigate = useNavigate()
  const generateMutation = useGenerateSoal()
  const { documents } = useDocuments()
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
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

  const tipeMap: Record<string, string> = {
    'Pilihan Ganda': 'pilihan_ganda',
    'Isian': 'isian',
    'Essay': 'essay',
    'Campuran': 'campuran',
  }

  const difficultyMap: Record<string, string> = {
    'Mudah': 'mudah',
    'Sedang': 'sedang',
    'Sulit': 'sulit',
    'Campuran (HOTS)': 'campuran',
  }

  const handleGenerate = async () => {
    setError(null)
    const loadingToast = toast.loading("Mempersiapkan Bank Soal...", {
      description: "AI sedang menganalisis materi dan menyusun pertanyaan.",
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
        page_ranges: sourceType === 'modul' ? pageRanges : undefined,
        cp_atp_text: sourceType === 'cp_atp' ? cpAtpText : undefined,
      })

      
      toast.dismiss(loadingToast)
      toast.success("Berhasil Generate Soal!", {
        description: `${jumlahSoal} soal evaluasi telah berhasil dibuat.`,
      })
      
      navigate(`/soal/edit/${result.id}`)
    } catch (err: unknown) {
      toast.dismiss(loadingToast)
      const message = err instanceof Error && 'message' in err ? err.message : 'Gagal generate soal'
      setError(message)
      toast.error("Gagal Generate Soal", {
        description: message,
      })
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 md:space-y-12 pb-20 animate-in fade-in p-2 md:p-8 max-w-full overflow-hidden">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 px-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Button asChild variant="outline" size="icon" className="w-12 h-12 border-2 border-slate-200 shadow-sm hover:bg-slate-50 transition-all rounded-xl shrink-0">
            <Link to="/soal">
              <ArrowLeft className="w-6 h-6 text-slate-600" strokeWidth={2.5} />
            </Link>
          </Button>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">Generate Soal</h1>
              <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                AI Powered
              </span>
            </div>
            <p className="text-base md:text-lg font-medium text-slate-500 border-l-4 border-brand-500 pl-4">Transformasikan modul ajar menjadi bank soal berkualitas tinggi.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-5 bg-rose-50 border-2 border-rose-100 rounded-2xl shadow-sm mx-2">
          <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" strokeWidth={2.5} />
          <p className="text-sm text-rose-700 font-bold uppercase tracking-wide">{error}</p>
        </div>
      )}

      {/* Step Indicator */}
      <div className="px-4 max-w-4xl mx-auto">
        <div className="relative flex items-center justify-between">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
          <div className="absolute top-1/2 left-0 h-1 bg-brand-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-3">
              <div 
                className={`w-12 h-12 rounded-2xl border-4 flex items-center justify-center transition-all duration-500 ${
                  step >= s ? 'bg-brand-500 border-white shadow-xl scale-110' : 'bg-white border-slate-100 text-slate-300'
                }`}
              >
                {step > s ? <Check className="w-6 h-6 text-white" strokeWidth={3} /> : <span className={`text-lg font-black ${step >= s ? 'text-white' : 'text-slate-300'}`}>{s}</span>}
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${step >= s ? 'text-slate-900' : 'text-slate-400'}`}>
                {s === 1 ? 'Sumber' : s === 2 ? 'Filter' : 'Konfigurasi'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:gap-12 min-h-[500px]">
        {/* Step 1: Sumber Materi */}
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'modul', title: 'Modul Ajar (PDF)', desc: 'Ekstrak materi dari library PDF', icon: BookOpen, color: 'text-sky-500', bg: 'bg-sky-50' },
                { id: 'cp_atp', title: 'CP / ATP', desc: 'Copy-paste Capaian Pembelajaran', icon: FileType, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { id: 'manual', title: 'Topik Manual', desc: 'Tuliskan deskripsi topik khusus', icon: LayoutGrid, color: 'text-emerald-500', bg: 'bg-emerald-50' }
              ].map((src) => (
                <Card 
                  key={src.id}
                  onClick={() => setSourceType(src.id as any)}
                  className={`cursor-pointer transition-all duration-300 border-4 ${
                    sourceType === src.id ? 'border-brand-500 shadow-2xl scale-[1.02] bg-brand-50/20' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg'
                  } rounded-[2rem] overflow-hidden group`}
                >
                  <CardContent className="p-8 space-y-6">
                    <div className={`${src.bg} ${src.color} p-5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                      <src.icon className="w-8 h-8" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{src.title}</h3>
                      <p className="text-sm font-medium text-slate-500 mt-2 leading-relaxed">{src.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-4 border-slate-100 rounded-[2rem] shadow-xl overflow-hidden bg-white/50 backdrop-blur-sm">
              <CardContent className="p-10">
                {sourceType === 'modul' && (
                  <div className="space-y-6">
                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                      Pilih Modul dari Library
                    </label>
                    <Select value={modulId} onValueChange={setModulId}>
                      <SelectTrigger className="border-4 border-slate-200 h-16 bg-white text-lg font-black rounded-2xl shadow-sm focus:ring-brand-500/20 w-full hover:border-brand-200 transition-colors">
                        <SelectValue placeholder="-- Pilih Modul PDF --" />
                      </SelectTrigger>
                      <SelectContent className="border-4 border-slate-100 rounded-2xl shadow-2xl">
                        {documents.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id} className="font-bold py-4 text-slate-700">{doc.filename}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {sourceType === 'cp_atp' && (
                  <div className="space-y-6">
                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                      Tempel Teks CP / ATP
                    </label>
                    <Textarea 
                      value={cpAtpText}
                      onChange={(e) => setCpAtpText(e.target.value)}
                      placeholder="Tempelkan Capaian Pembelajaran atau Alur Tujuan Pembelajaran di sini..."
                      className="border-4 border-slate-200 min-h-[300px] text-lg font-medium p-6 rounded-2xl focus-visible:ring-brand-500/20 bg-white leading-relaxed"
                    />
                  </div>
                )}

                {sourceType === 'manual' && (
                  <div className="space-y-6">
                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
                      Deskripsikan Topik Materi
                    </label>
                    <Input 
                      value={topik}
                      onChange={(e) => setTopik(e.target.value)}
                      placeholder="Contoh: Energi Baru Terbarukan di Indonesia"
                      className="border-4 border-slate-200 h-16 text-lg font-bold p-6 rounded-2xl focus-visible:ring-brand-500/20 bg-white"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Context Filtering */}
        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            {sourceType === 'modul' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-4 border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden bg-slate-900 group">
                   <div className="bg-slate-800 p-4 border-b border-white/5 flex items-center justify-between">
                     <span className="text-white/60 font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1 bg-white/5 rounded-full">PDF Library Preview</span>
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500/40"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500/40"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-500/40"></div>
                     </div>
                   </div>
                   <iframe 
                      src={`${API_URL}/uploads/${documents.find(d => d.id === modulId)?.filepath?.split('/').pop()}`} 
                      className="w-full h-[600px] bg-slate-800"
                    />
                </Card>
                <div className="space-y-6">
                   <Card className="border-4 border-slate-100 rounded-[2rem] shadow-xl p-8 bg-brand-50/30">
                      <div className="space-y-6">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Konfigurasi Halaman</h3>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">
                          Optimalkan AI dengan memilih rentang halaman yang ingin dijadikan soal.
                        </p>
                        <div className="space-y-3">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Rentang Halaman (Opsional)</label>
                          <Input 
                            value={pageRanges}
                            onChange={(e) => setPageRanges(e.target.value)}
                            placeholder="Contoh: 1-5, 8, 12-15"
                            className="h-14 border-4 border-slate-200 rounded-xl font-bold bg-white focus-visible:ring-brand-500/20"
                          />
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">* Kosongkan untuk membaca seluruh dokumen</p>
                        </div>
                      </div>
                   </Card>
                   <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                      <p className="text-[11px] text-slate-400 font-bold uppercase leading-relaxed">
                        Tips: Menggunakan rentang halaman yang sempit akan menghasilkan soal yang jauh lebih fokus dan akurat.
                      </p>
                   </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8">
                <Card className="border-4 border-slate-100 rounded-[2.5rem] shadow-xl p-12 bg-white text-center">
                  <div className="bg-emerald-50 text-emerald-500 p-6 rounded-full w-fit mx-auto mb-8 shadow-inner">
                    <CheckCircle2 className="w-12 h-12" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Konteks Siap Digunakan</h3>
                  <p className="text-lg font-medium text-slate-500 mt-4 max-w-lg mx-auto">
                    Sumber {sourceType === 'cp_atp' ? 'CP / ATP' : 'Topik Manual'} telah diproses. Tidak ada filter halaman diperlukan untuk tipe sumber ini.
                  </p>
                  <div className="mt-10 p-8 bg-slate-50 rounded-2xl text-left border-4 border-slate-100 max-h-[250px] overflow-y-auto">
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4">Preview Konten:</p>
                    <p className="text-slate-700 font-medium leading-relaxed italic line-clamp-6">
                      {sourceType === 'cp_atp' ? cpAtpText : topik}
                    </p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Step 3: AI Parameters */}
        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-10">
            <Card className="shadow-2xl border-4 border-slate-100 rounded-[2.5rem] overflow-hidden bg-white">
              <CardContent className="p-8 md:p-14 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                  {/* Left Column */}
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Mata Pelajaran</label>
                      <Input
                        type="text"
                        value={mataPelajaran}
                        onChange={(e) => setMataPelajaran(e.target.value)}
                        placeholder="Contoh: Matematika, Fisika, Biologi"
                        className="w-full bg-white border-4 border-slate-100 h-16 text-lg font-black rounded-2xl shadow-sm focus-visible:ring-brand-500/20"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Fase</label>
                        <Select value={fase} onValueChange={setFase}>
                          <SelectTrigger className="w-full bg-white border-4 border-slate-100 h-16 text-lg font-black rounded-2xl shadow-sm">
                            <SelectValue placeholder="Pilih Fase" />
                          </SelectTrigger>
                          <SelectContent className="border-4 border-slate-100 rounded-2xl">
                            {['Fase A', 'Fase B', 'Fase C', 'Fase D', 'Fase E', 'Fase F'].map((f) => (
                              <SelectItem key={f} value={f} className="font-bold py-3">{f}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Kelas</label>
                        <Select value={kelas} onValueChange={setKelas}>
                          <SelectTrigger className="w-full bg-white border-4 border-slate-100 h-16 text-lg font-black rounded-2xl shadow-sm">
                            <SelectValue placeholder="Pilih Kelas" />
                          </SelectTrigger>
                          <SelectContent className="border-4 border-slate-100 rounded-2xl max-h-[300px]">
                            {['1 SD', '2 SD', '3 SD', '4 SD', '5 SD', '6 SD', '7 SMP', '8 SMP', '9 SMP', '10 SMA', '11 SMA', '12 SMA'].map((k) => (
                              <SelectItem key={k} value={`Kelas ${k}`} className="font-bold py-3">Kelas {k}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-5">
                      <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Tipe Soal</label>
                      <div className="flex flex-wrap gap-3">
                        {Object.keys(tipeMap).map((type) => (
                          <Button 
                            key={type}
                            type="button"
                            variant="outline"
                            onClick={() => setTipeSoal(tipeMap[type] || type)}
                            className={`h-12 px-6 rounded-2xl font-black transition-all text-xs tracking-wider uppercase ${
                              tipeMap[type] === tipeSoal 
                                ? 'bg-slate-900 text-white shadow-xl scale-105' 
                                : 'border-4 border-slate-50 text-slate-400 hover:bg-slate-50 hover:border-slate-200'
                            }`}
                          >{type}</Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Tingkat Kesulitan</label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger className="w-full bg-white border-4 border-slate-100 h-16 text-lg font-black rounded-2xl shadow-sm">
                          <SelectValue placeholder="Pilih Kesulitan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-4 border-slate-900 bg-white p-2">
                          {Object.keys(difficultyMap).map((label) => (
                            <SelectItem key={label} value={difficultyMap[label]} className="rounded-xl font-bold py-3">
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Gaya Bahasa / Style</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'formal_academic', label: 'Formal Akademik' },
                          { id: 'kontekstual', label: 'Kontekstual' },
                          { id: 'humor_ringan', label: 'Humor Ringan' },
                          { id: 'cerita_narasi', label: 'Cerita Narasi' }
                        ].map((style) => (
                          <div 
                            key={style.id}
                            onClick={() => {
                              if (gayaSoal.includes(style.id)) {
                                if (gayaSoal.length > 1) setGayaSoal(gayaSoal.filter(s => s !== style.id))
                              } else {
                                setGayaSoal([...gayaSoal, style.id])
                              }
                            }}
                            className={`p-4 rounded-xl border-4 cursor-pointer transition-all flex items-center justify-between ${
                              gayaSoal.includes(style.id) 
                                ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                                : 'border-slate-100 bg-white text-slate-400'
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-wider">{style.label}</span>
                            {gayaSoal.includes(style.id) && <Check className="w-3 h-3 text-indigo-500" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Topik Spesifik (Fokus)</label>
                      <Input
                        type="text"
                        value={topik}
                        onChange={(e) => setTopik(e.target.value)}
                        placeholder="Contoh: Energi Kinetik & Potensial"
                        className="w-full bg-white border-4 border-slate-100 h-16 text-lg font-black rounded-2xl shadow-sm"
                      />
                    </div>
                    <div className="space-y-8">
                       <div className="flex justify-between items-center">
                          <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Jumlah Soal</label>
                          <span className="bg-brand-500 text-white font-black text-xl px-5 py-1.5 rounded-xl shadow-lg ring-4 ring-brand-500/10">{jumlahSoal}</span>
                       </div>
                       <input
                        type="range"
                        min="1"
                        max="50"
                        value={jumlahSoal}
                        onChange={(e) => setJumlahSoal(Number(e.target.value))}
                        className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-500"
                      />
                    </div>
                    <div className="space-y-6">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Opsi Tambahan</label>
                        <div className="grid grid-cols-1 gap-4">
                             {[
                               { label: 'Pembahasan', active: includePembahasan, toggle: () => setIncludePembahasan(!includePembahasan), color: 'bg-indigo-500' },
                               { label: 'Halaman Kunci Jawaban', active: includeKunci, toggle: () => setIncludeKunci(!includeKunci), color: 'bg-emerald-500' },
                               { label: 'Generate Gambar', active: includeGambar, toggle: () => setIncludeGambar(!includeGambar), color: 'bg-sky-500' }
                             ].map((opt, i) => (
                               <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border-4 border-transparent hover:border-slate-100 transition-all cursor-pointer" onClick={opt.toggle}>
                                 <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{opt.label}</span>
                                 <div className={`w-12 h-7 rounded-full relative transition-all duration-300 ${opt.active ? opt.color : 'bg-slate-200'}`}>
                                   <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${opt.active ? 'right-1' : 'left-1'}`}></div>
                                 </div>
                               </div>
                             ))}
                        </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 shadow-2xl border-none rounded-[3rem] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500 rounded-full -mr-20 -mt-20 opacity-20 blur-[100px]"></div>
              <CardContent className="p-10 md:p-14 flex flex-col md:flex-row items-center gap-12 relative z-10">
                <div className="p-7 rounded-[2rem] bg-white/5 border border-white/10 shadow-2xl shrink-0">
                  <BrainCircuit className="w-12 h-12 text-brand-400" />
                </div>
                <div className="space-y-4">
                  <p className="text-xl md:text-2xl font-medium text-slate-200 leading-relaxed italic border-l-8 border-brand-500 pl-10">
                    "AI siap memproses {sourceType === 'modul' ? '.PDF' : sourceType === 'cp_atp' ? 'CP/ATP' : 'Topik'} untuk menyusun <strong className="text-white">{jumlahSoal} soal {tipeSoal.replace('_', ' ')}</strong> dengan gaya bahasa akademik formal."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-6 pt-10 sticky bottom-8 z-30">
        <Button
          size="lg"
          variant="outline"
          disabled={step === 1 || generateMutation.isPending}
          onClick={() => setStep(step - 1)}
          className="h-16 md:h-20 px-8 md:px-12 rounded-2xl md:rounded-3xl border-4 border-slate-200 bg-white text-lg font-black uppercase tracking-widest shadow-xl hover:bg-slate-50 disabled:opacity-30 transition-all hover:-translate-x-1"
        >
          Kembali
        </Button>
        
        {step < 3 ? (
          <Button
            size="lg"
            onClick={() => setStep(step + 1)}
            disabled={(step === 1 && sourceType === 'modul' && !modulId) || (step === 1 && sourceType === 'cp_atp' && !cpAtpText) || (step === 1 && sourceType === 'manual' && !topik)}
            className="h-16 md:h-20 px-12 md:px-20 rounded-2xl md:rounded-3xl bg-slate-900 text-white text-lg font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-4 disabled:opacity-50"
          >
            Lanjut <ChevronRight className="w-6 h-6" strokeWidth={3} />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !mataPelajaran}
            className="h-16 md:h-20 px-12 md:px-20 rounded-2xl md:rounded-3xl bg-brand-600 hover:bg-brand-700 text-white text-xl md:text-2xl font-black uppercase tracking-[0.1em] shadow-2xl shadow-brand-200 transition-all hover:translate-y-[-4px] disabled:opacity-50 group grow"
          >
            {generateMutation.isPending ? <Loader2 className="w-8 h-8 animate-spin mr-4" /> : <Rocket className="w-8 h-8 mr-4 group-hover:animate-bounce" />}
            {generateMutation.isPending ? 'Memproses...' : 'Generate Bank Soal Sekarang'}
          </Button>
        )}
      </div>

      <div className="text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] bg-slate-50 inline-block px-8 py-3 rounded-full border border-slate-100 shadow-inner">
           Fase: {step} dari 3 &bull; AI Tier: Qwen 3.6 Plus
        </p>
      </div>
    </div>
  )
}
