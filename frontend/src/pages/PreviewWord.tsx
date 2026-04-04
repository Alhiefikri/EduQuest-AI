import { useState } from 'react'
import { ArrowLeft, Download, FileText, Info, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useSoalDetail } from '../hooks/useSoal'
import { generateWord, downloadWord } from '../services/soal'

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
      <div className="max-w-[1100px] mx-auto space-y-8 pb-20 animate-in fade-in">
        <div className="flex items-center gap-4">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          <p className="text-sm font-semibold text-gray-700">Memuat data soal...</p>
        </div>
      </div>
    )
  }

  if (error || !soal) {
    return (
      <div className="max-w-[1100px] mx-auto space-y-8 pb-20 animate-in fade-in">
        <div className="bg-white p-8 rounded-2xl border border-red-100 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-700">{error instanceof Error ? error.message : 'Soal tidak ditemukan'}</p>
          <Link to="/soal" className="mt-3 inline-block text-sm font-bold text-brand-500 hover:text-brand-600">Kembali ke Daftar Soal</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 pb-20 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/soal" className="group flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-brand-500 hover:border-brand-200 hover:shadow-sm transition-all active:scale-95">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pratinjau Dokumen</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {soal.mata_pelajaran}{soal.topik ? ` - ${soal.topik}` : ''} • {soal.jumlah_soal} soal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {genSuccess && (
            <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Dokumen siap diunduh
            </span>
          )}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-bold text-sm hover:bg-brand-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Unduh DOCX
          </button>
        </div>
      </div>

      {genError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">{genError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 min-h-[600px] relative overflow-hidden group">
            <div className="absolute inset-x-12 top-12 bottom-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-6 group-hover:bg-brand-50/20 group-hover:border-brand-100 transition-all">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-md flex items-center justify-center text-brand-500">
                <FileText className="w-10 h-10" />
              </div>
              <div className="text-center max-w-sm space-y-2">
                <h3 className="text-lg font-bold text-gray-900">Preview Dokumen Word</h3>
                <p className="text-sm font-medium text-gray-400 leading-relaxed">
                  Dokumen akan di-generate menggunakan template Word di server. Klik tombol "Generate & Unduh" untuk membuat file .docx.
                </p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-6 py-3 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {generating ? 'Generating...' : 'Generate & Unduh'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Pratinjau Konten Soal</h3>
            <div className="space-y-8">
              {soal.data_soal.slice(0, 3).map((item, idx) => (
                <div key={idx} className="space-y-3 pb-6 border-b border-gray-50 last:border-0">
                  <div className="flex items-start gap-3">
                    <span className="text-brand-600 font-black text-sm">{item.nomor}.</span>
                    <p className="text-sm font-bold text-gray-800">{item.pertanyaan}</p>
                  </div>
                  {item.gambar_prompt && (
                    <div className="ml-6 p-3 bg-brand-50 rounded-xl border border-brand-100 flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-brand-500 shadow-sm">
                        <Info className="w-4 h-4" />
                      </div>
                      <p className="text-[11px] font-medium text-brand-700 italic">
                        <strong>AI Image Prompt:</strong> {item.gambar_prompt}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {soal.data_soal.length > 3 && (
                <p className="text-xs text-center text-gray-400 font-bold italic">... {soal.data_soal.length - 3} soal lainnya tidak ditampilkan di pratinjau ...</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-8">
            <div>
              <h3 className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-4">Metadata Dokumen</h3>
              <div className="space-y-4">
                {[
                  { label: 'Mata Pelajaran', value: soal.mata_pelajaran },
                  { label: 'Topik', value: soal.topik || '-' },
                  { label: 'Tipe Soal', value: soal.tipe_soal },
                  { label: 'Jumlah Soal', value: `${soal.jumlah_soal} butir` },
                  { label: 'Tingkat Kesulitan', value: soal.difficulty },
                  { label: 'Status', value: soal.status },
                ].map((meta, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs font-bold text-gray-500">{meta.label}</span>
                    <span className="text-xs font-black text-gray-900 capitalize">{meta.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-6">Konfigurasi Output</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIncludeKunci(!includeKunci)}>
                  <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Halaman Kunci Jawaban</span>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${includeKunci ? 'bg-brand-500' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${includeKunci ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIncludePembahasan(!includePembahasan)}>
                  <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Halaman Pembahasan</span>
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${includePembahasan ? 'bg-brand-500' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${includePembahasan ? 'right-0.5' : 'left-0.5'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 flex gap-4">
            <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-[12px] font-bold text-orange-800 leading-relaxed">
              Pastikan Anda telah memeriksa kunci jawaban di tahap Editor sebelum melakukan export final.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
