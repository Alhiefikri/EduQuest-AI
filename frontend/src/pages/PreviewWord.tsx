import { useState } from 'react'
import { ArrowLeft, Download, FileText, Info, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useSoalDetail } from '../hooks/useSoal'
import { generateWord, downloadWord } from '../services/soal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function PreviewWord() {
  const { id } = useParams()
  const { data: soal, isLoading, error } = useSoalDetail(id || '')
  const [generating, setGenerating] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [genSuccess, setGenSuccess] = useState(false)
  const [includeKunci, setIncludeKunci] = useState(true)
  const [includePembahasan, setIncludePembahasan] = useState(true)

  const handleGenerate = async () => {
    if (!id) return
    setGenerating(true)
    setGenError(null)
    setGenSuccess(false)
    try {
      await generateWord({
        soal_id: id,
        sertakan_kunci_terpisah: includeKunci,
      })
      setGenSuccess(true)
      setTimeout(() => setGenSuccess(false), 3000)
    } catch (err: unknown) {
      const message = err instanceof Error && 'message' in err ? err.message : 'Gagal membuat dokumen Word'
      setGenError(message)
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!id) return
    setDownloading(true)
    try {
      await downloadWord(id)
    } catch (err: unknown) {
      const message = err instanceof Error && 'message' in err ? err.message : 'Gagal mengunduh file'
      setGenError(message)
    } finally {
      setDownloading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 py-8 animate-in fade-in">
        <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardContent className="p-20 text-center flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" strokeWidth={2.5} />
            <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Menyiapkan Library...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !soal) {
    return (
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 py-8 animate-in fade-in">
        <Card className="bg-rose-50/30 border border-rose-100 shadow-sm rounded-xl overflow-hidden text-center bg-white">
          <CardContent className="p-16">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
            <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{error instanceof Error ? error.message : 'Soal tidak ditemukan'}</p>
            <Button asChild variant="outline" size="sm" className="mt-8 border border-slate-200 rounded-lg px-8 h-10 font-black uppercase text-xs tracking-widest">
              <Link to="/soal">Kembali ke Daftar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 py-6 space-y-8 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="w-9 h-9 border border-slate-200 hover:bg-slate-50 rounded-lg transition-all shrink-0">
            <Link to="/soal">
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Pratinjau Export</h1>
            <p className="text-xs font-black text-slate-600 border-l-2 border-brand-500 pl-3 uppercase tracking-widest">
              {soal.mata_pelajaran} {soal.topik ? ` • ${soal.topik}` : ''} • {soal.jumlah_soal} BUTIR
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {genSuccess && (
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-4 py-2 border border-emerald-100 shadow-sm flex items-center gap-2 uppercase tracking-widest rounded-full animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Siap Unduh
            </span>
          )}
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="h-9 px-6 rounded-lg bg-slate-900 text-white shadow-sm font-black uppercase tracking-widest text-xs transition-all hover:translate-y-[-1px]"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />} Unduh DOCX
          </Button>
        </div>
      </div>

      {genError && (
        <div className="flex items-center gap-3 p-4 bg-rose-50/50 border border-rose-100 rounded-lg shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          <p className="text-xs text-rose-700 font-bold uppercase tracking-widest">{genError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Document Generation (60% width) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border border-slate-100 shadow-sm rounded-xl min-h-[400px] flex items-center justify-center bg-slate-50/30 p-6 overflow-hidden group">
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center space-y-8 shadow-sm transition-all duration-300 group-hover:shadow-md">
              <div className="w-16 h-16 bg-brand-50 border border-brand-100 rounded-2xl shadow-inner flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                <FileText className="w-8 h-8 text-brand-500" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Microsoft Word Document</h3>
                <p className="text-xs font-bold text-slate-600 leading-relaxed border-l-2 border-brand-500 pl-4 text-left uppercase tracking-wide">
                  Generate dokumen final dengan tata letak resmi sekolah.
                </p>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="h-11 px-8 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-black uppercase tracking-widest shadow-md transition-all w-full active:scale-95 text-xs"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                {generating ? 'Memproses...' : 'Generate Dokumen'}
              </Button>
            </div>
          </Card>

          <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest border-b border-slate-50 pb-4 mb-6">Struktur Konten (Sampel)</h3>
              <div className="space-y-8">
                {soal.data_soal.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="space-y-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <span className="bg-slate-900 text-white w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0">{item.nomor}</span>
                      <p className="text-sm font-bold text-slate-800 leading-snug pt-1">{item.pertanyaan}</p>
                    </div>
                    {item.gambar_prompt && (
                      <div className="ml-11 p-4 bg-amber-50/30 border border-amber-100 rounded-lg flex items-start gap-3">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-black opacity-60 block mb-0.5 uppercase tracking-tighter">IMAGE PROMPT:</p>
                        <p className="text-xs font-bold text-amber-900 leading-relaxed italic uppercase tracking-tight">
                          {item.gambar_prompt}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Metadata & Config (40% width) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden">
            <CardContent className="p-6 space-y-8">
              <div>
                <h3 className="text-xs font-black text-slate-500 tracking-widest uppercase mb-4 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div> Metadata Dokumen
                </h3>
                <div className="space-y-1">
                  {[
                    { label: 'Subjek', value: soal.mata_pelajaran },
                    { label: 'Topik', value: soal.topik || 'Umum' },
                    { label: 'Tipe', value: soal.tipe_soal },
                    { label: 'Total', value: `${soal.jumlah_soal} Butir` },
                    { label: 'Kesulitan', value: soal.difficulty },
                  ].map((meta, i) => (
                    <div key={i} className="flex justify-between items-center py-2 px-1 border-b border-slate-50/50">
                      <span className="text-xs font-black uppercase text-slate-500 tracking-widest">{meta.label}</span>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[150px]">{meta.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-500 tracking-widest uppercase mb-4 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-brand-400 rounded-full"></div> Konfigurasi Export
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-all" onClick={() => setIncludeKunci(!includeKunci)}>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Kunci Jawaban</span>
                    <div className={`w-9 h-5 rounded-full relative shadow-inner transition-colors ${includeKunci ? 'bg-slate-900' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${includeKunci ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-all" onClick={() => setIncludePembahasan(!includePembahasan)}>
                    <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Pembahasan</span>
                    <div className={`w-9 h-5 rounded-full relative shadow-inner transition-colors ${includePembahasan ? 'bg-slate-900' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${includePembahasan ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border border-amber-100 shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-4 flex gap-4">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-amber-900 uppercase leading-relaxed tracking-wider">
                Sangat disarankan untuk melakukan validasi final sebelum pencetakan resmi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
