import { useState } from 'react'
import { ArrowLeft, Book, CheckCircle2, Circle, Settings2, SlidersHorizontal, BrainCircuit, Rocket, FileText, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useGenerateSoal } from '../hooks/useSoal'
import { useDocuments } from '../hooks/useDocuments'

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
        include_pembahasan: includePembahasan,
        include_kunci: includeKunci,
        include_gambar: includeGambar,
      })
      navigate(`/soal/edit/${result.id}`)
    } catch (err: unknown) {
      const message = err instanceof Error && 'message' in err ? err.message : 'Gagal generate soal'
      setError(message)
    }
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-10 pb-20 animate-in fade-in">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/soal" className="group flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-brand-500 hover:border-brand-200 hover:shadow-sm transition-all active:scale-95">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Generate Soal Baru</h1>
              <span className="bg-brand-50 text-brand-600 text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider uppercase border border-brand-100">
                AI Powered
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mt-1">Transformasikan modul ajar menjadi bank soal berkualitas.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 relative overflow-hidden group hover:border-brand-200 transition-colors">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-50/50 rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className="flex items-center gap-4 mb-8">
            <div className="bg-brand-50 p-3 rounded-2xl text-brand-500 shadow-inner">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">1. Sumber Materi</h2>
              <p className="text-sm font-medium text-gray-500">Pilih basis data untuk pembuatan soal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div
                onClick={() => setSourceType('modul')}
                className={`border-2 p-5 rounded-2xl flex items-start gap-4 cursor-pointer relative shadow-sm transition-all ${
                  sourceType === 'modul' ? 'border-brand-500 bg-brand-50/30' : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-brand-200'
                }`}
              >
                {sourceType === 'modul' ? (
                  <div className="bg-brand-500 p-0.5 rounded-full mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 mt-0.5 shrink-0" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Gunakan Modul Ajar</h3>
                  <p className="text-xs font-semibold text-brand-600 mt-1 uppercase tracking-wide">Direkomendasikan</p>
                </div>
              </div>

              <div
                onClick={() => setSourceType('manual')}
                className={`border-2 p-5 rounded-2xl flex items-start gap-4 cursor-pointer transition-all ${
                  sourceType === 'manual' ? 'border-brand-500 bg-brand-50/30' : 'border-gray-200 bg-gray-50/50 hover:bg-white hover:border-brand-200'
                }`}
              >
                {sourceType === 'manual' ? (
                  <div className="bg-brand-500 p-0.5 rounded-full mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 mt-0.5 shrink-0" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Input Manual</h3>
                  <p className="text-xs font-medium text-gray-400 mt-1">Gunakan deskripsi topik mandiri</p>
                </div>
              </div>
            </div>

            {sourceType === 'modul' && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col justify-center">
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Pilih Modul dari Library</label>
                <div className="relative">
                  <select
                    value={modulId}
                    onChange={(e) => setModulId(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none shadow-xs appearance-none cursor-pointer"
                  >
                    <option value="">-- Pilih Modul --</option>
                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>{doc.filename}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>
            )}

            {sourceType === 'manual' && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col justify-center">
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Topik Manual</label>
                <input
                  type="text"
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                  placeholder="Masukkan topik secara manual..."
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none shadow-xs"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-600 shadow-inner">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">2. Konfigurasi Parameter</h2>
              <p className="text-sm font-medium text-gray-500">Tentukan spesifikasi soal yang diinginkan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Mata Pelajaran</label>
                <input
                  type="text"
                  value={mataPelajaran}
                  onChange={(e) => setMataPelajaran(e.target.value)}
                  placeholder="Contoh: Matematika, Fisika, Biologi"
                  className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Fase (Opsional)</label>
                  <input
                    type="text"
                    value={fase}
                    onChange={(e) => setFase(e.target.value)}
                    placeholder="Contoh: Fase D"
                    className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Kelas (Opsional)</label>
                  <input
                    type="text"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    placeholder="Contoh: Kelas 7"
                    className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Tipe Soal</label>
                <div className="flex flex-wrap gap-2">
                  {['Pilihan Ganda', 'Isian', 'Essay', 'Campuran'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTipeSoal(tipeMap[type] || type)}
                      className={`px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-xs ${
                        tipeMap[type] === tipeSoal
                          ? 'bg-brand-500 text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-200'
                      }`}
                    >{type}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase">Jumlah Soal</label>
                  <span className="text-brand-600 font-black text-sm">{jumlahSoal} <span className="text-gray-400 font-bold uppercase text-[10px]">Butir</span></span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={jumlahSoal}
                  onChange={(e) => setJumlahSoal(Number(e.target.value))}
                  className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Topik Spesifik</label>
                <input
                  type="text"
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Tingkat Kesulitan</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none appearance-none cursor-pointer"
                >
                  <option value="mudah">Mudah</option>
                  <option value="sedang">Sedang</option>
                  <option value="sulit">Sulit</option>
                  <option value="campuran">Campuran (HOTS)</option>
                </select>
              </div>
              <div className="pt-2">
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-4">Opsi Tambahan</label>
                <div className="space-y-4">
                  {[
                    { label: 'Sertakan Pembahasan Lengkap', active: includePembahasan, toggle: () => setIncludePembahasan(!includePembahasan) },
                    { label: 'Halaman Kunci Jawaban', active: includeKunci, toggle: () => setIncludeKunci(!includeKunci) },
                    { label: 'Generate Gambar AI', active: includeGambar, toggle: () => setIncludeGambar(!includeGambar) }
                  ].map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group" onClick={opt.toggle}>
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        opt.active ? 'bg-brand-500 border-brand-500 shadow-sm' : 'border-gray-200 bg-white group-hover:border-brand-300'
                      }`}>
                        {opt.active && <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                      </div>
                      <span className={`text-[13px] font-bold ${opt.active ? 'text-gray-900' : 'text-gray-500'}`}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-900 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-800 rounded-full -mr-16 -mt-16 opacity-40 blur-2xl"></div>
          <div className="bg-brand-800/50 p-4 rounded-2xl shadow-inner shrink-0 mt-1 border border-brand-700">
            <BrainCircuit className="w-6 h-6 text-brand-300 animate-pulse-slow" />
          </div>
          <div>
            <h3 className="text-sm font-black text-brand-400 uppercase tracking-widest mb-3">Konsep Pemrosesan AI</h3>
            <p className="text-[15px] text-brand-50 font-medium leading-relaxed italic opacity-95">
              "AI akan membuat soal <strong className="text-white">{mataPelajaran}</strong> dengan topik <strong className="text-white">{topik || 'disesuaikan'}</strong>. Soal akan difokuskan pada penalaran kritis ({difficulty}) sebanyak <strong className="text-white">{jumlahSoal} butir</strong>."
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !mataPelajaran}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white flex gap-3 justify-center items-center py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-500/20 transition-all active:scale-[0.98] transform hover:-translate-y-1"
          >
            {generateMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
            {generateMutation.isPending ? 'GENERATING...' : 'GENERATE BANK SOAL'}
          </button>
          <p className="text-[11px] text-gray-400 mt-6 font-black uppercase tracking-[0.2em]">
            Processing time: ~25 Seconds • Free Tier Active
          </p>
        </div>
      </div>
    </div>
  )
}
