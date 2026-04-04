import { useState } from 'react'
import { ArrowLeft, Book, CheckCircle2, Circle, Settings2, SlidersHorizontal, BrainCircuit, Rocket, FileText, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useGenerateSoal } from '../hooks/useSoal'
import { useDocuments } from '../hooks/useDocuments'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
    <div className="max-w-[900px] mx-auto space-y-12 pb-20 animate-in fade-in p-4 md:p-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button asChild variant="outline" size="icon" className="w-12 h-12 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            <Link to="/soal">
              <ArrowLeft className="w-6 h-6" strokeWidth={3} />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black uppercase tracking-tighter drop-shadow-md">Generate Soal</h1>
              <span className="bg-[#ff90e8] border-2 border-black text-black text-xs font-black px-3 py-1 uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                AI Powered
              </span>
            </div>
            <p className="text-base font-bold mt-2 border-l-4 border-primary pl-3">Transformasikan modul ajar menjadi bank soal berkualitas.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="w-6 h-6 text-black shrink-0" strokeWidth={2.5} />
          <p className="text-base font-black uppercase">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-10">
        <Card className="shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black group transition-all">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
              <div className="bg-[#00f0ff] p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Book className="w-8 h-8 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase">1. Sumber Materi</h2>
                <p className="text-sm font-bold mt-1">Pilih basis data untuk pembuatan soal.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div
                  onClick={() => setSourceType('modul')}
                  className={`border-4 p-5 cursor-pointer relative transition-all ${
                    sourceType === 'modul' ? 'border-black bg-[#ffc900] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'border-black bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {sourceType === 'modul' ? (
                      <CheckCircle2 className="w-6 h-6 text-black" strokeWidth={3} />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" strokeWidth={3} />
                    )}
                    <div>
                      <h3 className="text-lg font-black uppercase leading-none">Modul Ajar</h3>
                      <p className="text-xs font-bold mt-2 uppercase tracking-widest bg-white border-2 border-black inline-block px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Direkomendasikan</p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setSourceType('manual')}
                  className={`border-4 p-5 cursor-pointer transition-all ${
                    sourceType === 'manual' ? 'border-black bg-[#ffc900] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'border-black bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {sourceType === 'manual' ? (
                      <CheckCircle2 className="w-6 h-6 text-black" strokeWidth={3} />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" strokeWidth={3} />
                    )}
                    <div>
                      <h3 className="text-lg font-black uppercase leading-none">Input Manual</h3>
                      <p className="text-sm font-bold mt-2">Gunakan deskripsi topik mandiri</p>
                    </div>
                  </div>
                </div>
              </div>

              {sourceType === 'modul' && (
                <div className="bg-gray-50 border-4 border-black p-6 flex flex-col justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <label className="block text-sm font-black uppercase mb-4">Pilih Modul dari Library</label>
                  <Select value={modulId} onValueChange={setModulId}>
                    <SelectTrigger className="border-4 border-black font-bold h-14 bg-white text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <SelectValue placeholder="-- Pilih Modul --" />
                    </SelectTrigger>
                    <SelectContent className="border-4 border-black font-bold">
                      {documents.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>{doc.filename}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {sourceType === 'manual' && (
                <div className="bg-gray-50 border-4 border-black p-6 flex flex-col justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <label className="block text-sm font-black uppercase mb-4">Topik Manual</label>
                  <Input
                    type="text"
                    value={topik}
                    onChange={(e) => setTopik(e.target.value)}
                    placeholder="Masukkan topik secara manual..."
                    className="border-4 border-black font-bold h-14 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
              <div className="bg-[#ff90e8] p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <SlidersHorizontal className="w-8 h-8 text-black" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase">2. Konfigurasi Parameter</h2>
                <p className="text-sm font-bold mt-1">Tentukan spesifikasi soal yang diinginkan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-black uppercase mb-3">Mata Pelajaran</label>
                  <Input
                    type="text"
                    value={mataPelajaran}
                    onChange={(e) => setMataPelajaran(e.target.value)}
                    placeholder="Contoh: Matematika, Fisika, Biologi"
                    className="w-full bg-white border-4 border-black h-14 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black uppercase mb-3">Fase (Ops)</label>
                    <Input
                      type="text"
                      value={fase}
                      onChange={(e) => setFase(e.target.value)}
                      placeholder="Contoh: Fase D"
                      className="w-full bg-white border-4 border-black h-14 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black uppercase mb-3">Kelas (Ops)</label>
                    <Input
                      type="text"
                      value={kelas}
                      onChange={(e) => setKelas(e.target.value)}
                      placeholder="Contoh: Kelas 7"
                      className="w-full bg-white border-4 border-black h-14 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black uppercase mb-4">Tipe Soal</label>
                  <div className="flex flex-wrap gap-4">
                    {['Pilihan Ganda', 'Isian', 'Essay', 'Campuran'].map((type) => (
                      <Button
                        key={type}
                        variant={tipeMap[type] === tipeSoal ? 'default' : 'outline'}
                        onClick={() => setTipeSoal(tipeMap[type] || type)}
                        className={`border-4 border-black font-black uppercase h-12 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                          tipeMap[type] === tipeSoal ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100 hover:-translate-y-1'
                        }`}
                      >{type}</Button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-black uppercase">Jumlah Soal</label>
                    <span className="bg-[#ffc900] border-2 border-black font-black text-lg px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{jumlahSoal}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={jumlahSoal}
                    onChange={(e) => setJumlahSoal(Number(e.target.value))}
                    className="w-full h-4 bg-gray-200 border-4 border-black appearance-none cursor-pointer accent-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-black uppercase mb-3">Topik Spesifik</label>
                  <Input
                    type="text"
                    value={topik}
                    onChange={(e) => setTopik(e.target.value)}
                    className="w-full bg-white border-4 border-black h-14 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black uppercase mb-3">Tingkat Kesulitan</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="border-4 border-black font-bold h-14 bg-white text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-4 border-black font-bold">
                      <SelectItem value="mudah" className="uppercase font-bold">Mudah</SelectItem>
                      <SelectItem value="sedang" className="uppercase font-bold">Sedang</SelectItem>
                      <SelectItem value="sulit" className="uppercase font-bold">Sulit</SelectItem>
                      <SelectItem value="campuran" className="uppercase font-bold">Campuran (HOTS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4 border-t-4 border-black">
                  <label className="block text-sm font-black uppercase mb-5">Opsi Tambahan</label>
                  <div className="space-y-5">
                    {[
                      { label: 'Sertakan Pembahasan Lengkap', active: includePembahasan, toggle: () => setIncludePembahasan(!includePembahasan) },
                      { label: 'Halaman Kunci Jawaban', active: includeKunci, toggle: () => setIncludeKunci(!includeKunci) },
                      { label: 'Generate Gambar AI', active: includeGambar, toggle: () => setIncludeGambar(!includeGambar) }
                    ].map((opt, i) => (
                      <div key={i} className="flex items-center gap-4 cursor-pointer group" onClick={opt.toggle}>
                        <div className={`w-8 h-8 border-4 border-black flex items-center justify-center transition-all ${
                          opt.active ? 'bg-[#00f0ff] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'
                        }`}>
                          {opt.active && <CheckCircle2 className="w-5 h-5 text-black" strokeWidth={4} />}
                        </div>
                        <span className="text-base font-black uppercase">{opt.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#ff90e8] border-4 border-black overflow-hidden relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-20 -mt-20 opacity-20 blur-2xl pointer-events-none"></div>
          <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="p-6 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 transform rotate-6">
              <BrainCircuit className="w-12 h-12 text-black animate-pulse-slow" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-black uppercase mb-4 tracking-tight">Konsep Pemrosesan AI</h3>
              <p className="text-lg font-bold leading-relaxed border-l-4 border-black pl-4">
                "AI akan membuat soal <strong className="bg-white px-2 border-2 border-black">{mataPelajaran || '...'}</strong> dengan topik <strong className="bg-white px-2 border-2 border-black">{topik || 'disesuaikan'}</strong>. Difokuskan pada penalaran kritis ({difficulty}) sebanyak <strong className="bg-white px-2 border-2 border-black">{jumlahSoal} butir</strong>."
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-8">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !mataPelajaran}
            className="w-full h-20 text-2xl font-black uppercase tracking-widest border-4 border-black bg-black text-white hover:bg-black/90 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            {generateMutation.isPending ? <Loader2 className="w-8 h-8 animate-spin mr-4" /> : <Rocket className="w-8 h-8 mr-4" />}
            {generateMutation.isPending ? 'GENERATING...' : 'GENERATE BANK SOAL'}
          </Button>
          <p className="text-sm font-bold mt-6 uppercase tracking-widest">
            Processing time: ~25 Seconds • Free Tier Active
          </p>
        </div>
      </div>
    </div>
  )
}
