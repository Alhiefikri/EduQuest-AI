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
      <div className="max-w-[1100px] mx-auto space-y-8 pb-20 animate-in fade-in p-4 md:p-8">
        <Card className="border-2 border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
          <CardContent className="p-20 text-center flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" strokeWidth={3} />
            <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">Mempersiapkan Dokumen...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !soal) {
    return (
      <div className="max-w-[1100px] mx-auto space-y-8 pb-20 animate-in fade-in p-4 md:p-8">
        <Card className="bg-rose-50 border-2 border-rose-100 shadow-lg rounded-[2rem] overflow-hidden text-center">
          <CardContent className="p-16">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" strokeWidth={2.5} />
            <p className="text-xl font-bold text-rose-700 uppercase tracking-tight">{error instanceof Error ? error.message : 'Soal tidak ditemukan'}</p>
            <Button asChild variant="outline" className="mt-8 border-2 border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl px-10 h-12">
              <Link to="/soal">Kembali ke Daftar Soal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-10 pb-20 animate-in fade-in p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
        <div className="flex items-center gap-6">
          <Button asChild variant="outline" size="icon" className="w-12 h-12 border-2 border-slate-200 shadow-sm hover:bg-slate-50 transition-all rounded-xl">
            <Link to="/soal">
              <ArrowLeft className="w-6 h-6 text-slate-600" strokeWidth={2.5} />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">Pratinjau</h1>
            <p className="mt-2 text-base font-bold border-l-4 border-brand-500 pl-4 uppercase tracking-wider text-slate-400">
              {soal.mata_pelajaran} {soal.topik ? ` - ${soal.topik}` : ''} • {soal.jumlah_soal} SOAL
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {genSuccess && (
            <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-5 py-2.5 border-2 border-emerald-100 shadow-sm flex items-center gap-2 uppercase tracking-widest rounded-full animate-in fade-in">
              <CheckCircle2 className="w-5 h-5" strokeWidth={3} /> Siap Unduh
            </span>
          )}
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="h-14 px-8 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-200 font-bold uppercase transition-all hover:translate-y-[-1px]"
          >
            {downloading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Download className="w-5 h-5 mr-3" strokeWidth={3} />} Unduh DOCX
          </Button>
        </div>
      </div>

      {genError && (
        <div className="flex items-center gap-3 p-5 bg-rose-50 border-2 border-rose-100 rounded-2xl shadow-sm mx-2">
          <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" strokeWidth={2.5} />
          <p className="text-sm text-rose-700 font-bold uppercase tracking-wide">{genError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <Card className="border-2 border-slate-100 shadow-sm rounded-[2.5rem] min-h-[600px] flex items-center justify-center bg-slate-50/50 p-8 overflow-hidden group">
            <div className="w-full max-w-lg bg-white border-2 border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center space-y-10 shadow-xl transition-all duration-500 group-hover:shadow-2xl">
              <div className="w-24 h-24 bg-brand-50 border border-brand-100 rounded-3xl shadow-inner flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
                <FileText className="w-12 h-12 text-brand-500" strokeWidth={2} />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Dokumen Microsoft Word</h3>
                <p className="text-base font-medium text-slate-500 leading-relaxed border-l-4 border-brand-500 pl-6 text-left">
                  Klik tombol di bawah untuk menyusun dokumen final dengan tata letak resmi sekolah.
                </p>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest shadow-xl transition-all w-full active:scale-95"
              >
                {generating ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Download className="w-6 h-6 mr-3" strokeWidth={3} />}
                {generating ? 'Memproses...' : 'Generate Dokumen'}
              </Button>
            </div>
          </Card>

          <Card className="border-2 border-slate-100 shadow-sm rounded-[2rem] bg-white overflow-hidden">
            <CardContent className="p-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] border-b-2 border-slate-50 pb-6 mb-10">Struktur Konten Utama (Sampel)</h3>
              <div className="space-y-12">
                {soal.data_soal.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="space-y-6 pb-10 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex items-start gap-6">
                      <span className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-md shadow-slate-200">{item.nomor}</span>
                      <p className="text-lg font-bold text-slate-800 leading-tight pt-1">{item.pertanyaan}</p>
                    </div>
                    {item.gambar_prompt && (
                      <div className="ml-16 p-6 bg-amber-50/50 border-2 border-amber-100 rounded-2xl flex items-start gap-5 shadow-inner">
                        <div className="w-10 h-10 bg-white border border-amber-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                          <Info className="w-6 h-6 text-amber-500" strokeWidth={2} />
                        </div>
                        <p className="text-[13px] font-bold text-amber-800 leading-relaxed italic">
                          <span className="uppercase tracking-widest text-[10px] font-black opacity-50 block mb-1">AI Image Generation Prompt</span>
                          {item.gambar_prompt}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {soal.data_soal.length > 3 && (
                  <div className="text-center pt-4">
                    <span className="bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] px-6 py-2.5 rounded-full border border-slate-100">
                      ... {soal.data_soal.length - 3} ITEM LAINNYA DIARSIPKAN ...
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="border-2 border-slate-100 shadow-sm rounded-[2rem] bg-white overflow-hidden">
            <CardContent className="p-10 space-y-12">
              <div>
                <h3 className="text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase mb-8 flex items-center gap-4">
                  <div className="w-2 h-2 bg-sky-400 rounded-full"></div> Metadata
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'Subjek', value: soal.mata_pelajaran },
                    { label: 'Topik', value: soal.topik || 'Umum' },
                    { label: 'Tipe', value: soal.tipe_soal },
                    { label: 'Total', value: `${soal.jumlah_soal} Butir` },
                    { label: 'Kesulitan', value: soal.difficulty },
                    { label: 'Status', value: soal.status },
                  ].map((meta, i) => (
                    <div key={i} className="flex justify-between items-center py-3.5 border-b border-slate-50 group transition-colors hover:bg-slate-50/50 px-2 rounded-lg">
                      <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">{meta.label}</span>
                      <span className="text-sm font-bold text-slate-900 capitalize text-right max-w-[140px] truncate" title={meta.value}>{meta.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-[10px] font-black text-slate-300 tracking-[0.3em] uppercase mb-10 flex items-center gap-4">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div> Konfigurasi
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIncludeKunci(!includeKunci)}>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">Kunci Jawaban</span>
                    <div className={`w-12 h-7 rounded-full relative transition-all duration-300 shadow-inner ${includeKunci ? 'bg-brand-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${includeKunci ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-colors" onClick={() => setIncludePembahasan(!includePembahasan)}>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">Pembahasan</span>
                    <div className={`w-12 h-7 rounded-full relative transition-all duration-300 shadow-inner ${includePembahasan ? 'bg-brand-500' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${includePembahasan ? 'right-1' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-2 border-amber-100 shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-8 flex gap-6">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-amber-100 self-start">
                <Info className="w-6 h-6 text-amber-500" strokeWidth={2.5} />
              </div>
              <p className="text-[13px] font-bold text-amber-900/70 leading-relaxed uppercase tracking-wide">
                Validasi final sangat disarankan sebelum melakukan cetak fisik atau distribusi digital.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
