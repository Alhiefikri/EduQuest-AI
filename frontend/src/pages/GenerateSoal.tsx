import { useState } from 'react'
import { ArrowLeft, Book, CheckCircle2, Circle, Settings2, SlidersHorizontal, BrainCircuit, Rocket, FileText, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useGenerateSoal } from '../hooks/useSoal'
import { useDocuments } from '../hooks/useDocuments'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export default function GenerateSoal() {
  const navigate = useNavigate()
  const generateMutation = useGenerateSoal()
  const { documents } = useDocuments()
  const [error, setError] = useState<string | null>(null)

  const [sourceType, setSourceType] = useState<'modul' | 'manual'>('modul')
  const [modulId, setModulId] = useState('')
  const [mataPelajaran, setMataPelajaran] = useState('')
  const [topik, setTopik] = useState('')
  const [fase, setFase] = useState('')
  const [kelas, setKelas] = useState('')
  const [tipeSoal, setTipeSoal] = useState('pilihan_ganda')
  const [gayaSoal, setGayaSoal] = useState('formal_academic')
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

      <div className="grid grid-cols-1 gap-8 md:gap-12">
        <Card className="shadow-lg shadow-slate-100 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-300">
          <CardContent className="p-6 md:p-10 space-y-10">
            <div className="flex items-center gap-6 border-b-2 border-slate-50 pb-8">
              <div className="bg-sky-50 p-3 md:p-4 rounded-2xl border border-sky-100 shadow-inner shrink-0">
                <Book className="w-6 h-6 md:w-8 md:h-8 text-sky-600" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">1. Sumber Materi</h2>
                <p className="text-sm md:text-slate-500 font-medium mt-1">Pilih basis data utama untuk pembuatan soal evaluasi.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-5">
                <div
                  onClick={() => setSourceType('modul')}
                  className={`border-2 p-5 md:p-6 rounded-2xl cursor-pointer relative transition-all duration-300 ${
                    sourceType === 'modul' ? 'border-brand-500 bg-brand-50/30 shadow-md ring-4 ring-brand-500/5' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${sourceType === 'modul' ? 'border-brand-500 bg-brand-500' : 'border-slate-200'}`}>
                      {sourceType === 'modul' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-none">Gunakan Modul Ajar</h3>
                      <p className="text-xs font-bold mt-3 uppercase tracking-widest text-brand-600 bg-brand-50 inline-block px-2 py-0.5 rounded-md border border-brand-100">Direkomendasikan</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setSourceType('manual')}
                  className={`border-2 p-5 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    sourceType === 'manual' ? 'border-brand-500 bg-brand-50/30 shadow-md ring-4 ring-brand-500/5' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${sourceType === 'manual' ? 'border-brand-500 bg-brand-500' : 'border-slate-200'}`}>
                      {sourceType === 'manual' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 leading-none">Input Topik Manual</h3>
                      <p className="text-sm font-medium text-slate-400 mt-2">Tuliskan deskripsi topik secara mandiri</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/50 border-2 border-slate-100 p-6 md:p-8 rounded-2xl flex flex-col justify-center space-y-4 min-w-0">
                {sourceType === 'modul' ? (
                  <>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Pilih Modul dari Library</label>
                    <Select value={modulId} onValueChange={setModulId}>
                      <SelectTrigger className="border-2 border-slate-200 h-14 bg-white text-base font-bold rounded-xl shadow-sm focus:ring-brand-500/20 w-full overflow-hidden">
                        <SelectValue placeholder="-- Pilih Modul --" />
                      </SelectTrigger>
                      <SelectContent className="border-2 border-slate-100 rounded-xl shadow-xl max-w-[calc(100vw-4rem)]">
                        {documents.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id} className="font-semibold py-3 truncate max-w-full">{doc.filename}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Tulis Topik Manual</label>
                    <Input
                      type="text"
                      value={topik}
                      onChange={(e) => setTopik(e.target.value)}
                      placeholder="Masukkan topik secara manual..."
                      className="border-2 border-slate-200 h-14 text-base font-bold bg-white rounded-xl shadow-sm focus-visible:ring-brand-500/20"
                    />
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-slate-100 border-2 border-slate-100 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
          <CardContent className="p-6 md:p-10 space-y-12">
            <div className="flex items-center gap-6 border-b-2 border-slate-50 pb-8">
              <div className="bg-amber-50 p-3 md:p-4 rounded-2xl border border-amber-100 shadow-inner shrink-0">
                <SlidersHorizontal className="w-6 h-6 md:w-8 md:h-8 text-amber-600" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">2. Konfigurasi Parameter</h2>
                <p className="text-sm md:text-slate-500 font-medium mt-1">Sesuaikan tingkat kesulitan dan format soal.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Mata Pelajaran</label>
                  <Input
                    type="text"
                    value={mataPelajaran}
                    onChange={(e) => setMataPelajaran(e.target.value)}
                    placeholder="Contoh: Matematika, Fisika, Biologi"
                    className="w-full bg-white border-2 border-slate-200 h-14 text-base font-bold rounded-xl shadow-sm focus-visible:ring-brand-500/20"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Fase (Ops)</label>
                    <Input
                      type="text"
                      value={fase}
                      onChange={(e) => setFase(e.target.value)}
                      placeholder="Fase D"
                      className="w-full bg-white border-2 border-slate-200 h-14 text-base font-bold rounded-xl shadow-sm focus-visible:ring-brand-500/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Kelas (Ops)</label>
                    <Input
                      type="text"
                      value={kelas}
                      onChange={(e) => setKelas(e.target.value)}
                      placeholder="Kelas 7"
                      className="w-full bg-white border-2 border-slate-200 h-14 text-base font-bold rounded-xl shadow-sm focus-visible:ring-brand-500/20"
                    />
                  </div>
                </div>
                <div className="space-y-5">
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Tipe Soal</label>
                  <div className="flex flex-wrap gap-3">
                    {['Pilihan Ganda', 'Isian', 'Essay', 'Campuran'].map((type) => (
                      <Button
                        key={type}
                        variant={tipeMap[type] === tipeSoal ? 'default' : 'outline'}
                        onClick={() => setTipeSoal(tipeMap[type] || type)}
                        className={`h-11 px-5 rounded-full font-bold transition-all text-xs md:text-sm ${
                          tipeMap[type] === tipeSoal 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'border-2 border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-200 shadow-sm'
                        }`}
                      >{type}</Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Jumlah Butir Soal</label>
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-black text-xl px-4 py-1 rounded-lg shadow-sm">{jumlahSoal}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={jumlahSoal}
                    onChange={(e) => setJumlahSoal(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-600"
                  />
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Topik Spesifik (Fokus)</label>
                  <Input
                    type="text"
                    value={topik}
                    onChange={(e) => setTopik(e.target.value)}
                    placeholder="Contoh: Energi Kinetik & Potensial"
                    className="w-full bg-white border-2 border-slate-200 h-14 text-base font-bold rounded-xl shadow-sm focus-visible:ring-brand-500/20"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Tingkat Kesulitan</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="border-2 border-slate-200 h-14 bg-white text-base font-bold rounded-xl shadow-sm uppercase tracking-wide">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-slate-100 rounded-xl shadow-xl">
                      <SelectItem value="mudah" className="uppercase font-bold py-3">Mudah</SelectItem>
                      <SelectItem value="sedang" className="uppercase font-bold py-3">Sedang</SelectItem>
                      <SelectItem value="sulit" className="uppercase font-bold py-3">Sulit</SelectItem>
                      <SelectItem value="campuran" className="uppercase font-bold py-3">Campuran (HOTS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Gaya Soal (Context)</label>
                  <Select value={gayaSoal} onValueChange={setGayaSoal}>
                    <SelectTrigger className="border-2 border-slate-200 h-14 bg-white text-base font-bold rounded-xl shadow-sm uppercase tracking-wide">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-slate-100 rounded-xl shadow-xl">
                      <SelectItem value="light_story" className="font-bold py-3">CERITA RINGAN</SelectItem>
                      <SelectItem value="formal_academic" className="font-bold py-3">AKADEMIK FORMAL</SelectItem>
                      <SelectItem value="case_study" className="font-bold py-3">STUDI KASUS</SelectItem>
                      <SelectItem value="standard_exam" className="font-bold py-3">UJIAN STANDAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-6 border-t border-slate-50 space-y-6">
                  <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Opsi Output Tambahan</label>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { label: 'Sertakan Pembahasan Lengkap', active: includePembahasan, toggle: () => setIncludePembahasan(!includePembahasan), color: 'bg-indigo-500' },
                      { label: 'Halaman Kunci Jawaban', active: includeKunci, toggle: () => setIncludeKunci(!includeKunci), color: 'bg-emerald-500' },
                      { label: 'Generate Gambar AI', active: includeGambar, toggle: () => setIncludeGambar(!includeGambar), color: 'bg-sky-500' }
                    ].map((opt, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-transparent hover:border-slate-100 transition-all cursor-pointer group" onClick={opt.toggle}>
                        <span className="text-sm md:text-[15px] font-bold text-slate-700 uppercase tracking-tight">{opt.label}</span>
                        <div className={`w-10 h-6 md:w-12 md:h-7 rounded-full relative transition-all duration-300 shadow-inner shrink-0 ${opt.active ? opt.color : 'bg-slate-200'}`}>
                          <div className={`absolute top-1 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-md transition-all duration-300 ${opt.active ? 'right-1' : 'left-1'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 shadow-2xl border-none rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full -mr-20 -mt-20 opacity-20 blur-[80px]"></div>
          <CardContent className="p-8 md:p-14 flex flex-col md:flex-row items-center gap-10 md:gap-12 relative z-10">
            <div className="p-5 md:p-6 rounded-3xl bg-white/5 border border-white/10 shadow-inner shrink-0 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <BrainCircuit className="w-10 h-10 md:w-14 md:h-14 text-brand-400 animate-pulse-slow" strokeWidth={2} />
            </div>
            <div className="space-y-4 flex-1">
              <h3 className="text-xs md:text-sm font-black text-brand-400 uppercase tracking-[0.2em] mb-4 text-center md:text-left">Konsep Pemrosesan AI</h3>
              <p className="text-lg md:text-xl font-medium text-slate-200 leading-relaxed italic border-l-4 border-brand-500 pl-6 md:pl-8">
                "Sistem AI akan menyusun soal <strong className="text-white bg-white/10 px-2 py-0.5 rounded">{mataPelajaran || '...'}</strong> dengan fokus materi <strong className="text-white bg-white/10 px-2 py-0.5 rounded">{topik || 'umum'}</strong>. Hasil akhir akan mencakup penalaran tingkat <strong className="text-emerald-400">{difficulty}</strong> sebanyak <strong className="text-brand-400">{jumlahSoal}</strong> butir valid."
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-6 md:pt-10 px-2">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !mataPelajaran}
            className="w-full h-16 md:h-20 text-xl md:text-2xl font-black uppercase tracking-[0.1em] rounded-2xl md:rounded-3xl bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-200 transition-all hover:translate-y-[-2px] disabled:opacity-50"
          >
            {generateMutation.isPending ? <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin mr-4" /> : <Rocket className="w-6 h-6 md:w-8 md:h-8 mr-4" />}
            {generateMutation.isPending ? 'Memproses...' : 'Generate Bank Soal'}
          </Button>
          <p className="text-[9px] md:text-[11px] text-slate-400 mt-6 md:mt-8 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] bg-slate-50 inline-block px-4 md:px-6 py-2 rounded-full border border-slate-100">
            ESTIMASI WAKTU: ~25 DETIK &bull; FREE TIER AKTIF
          </p>
        </div>

      </div>
    </div>
  )
}
