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
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardContent className="p-16 text-center flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-black animate-spin mb-4" strokeWidth={3} />
            <p className="text-xl font-black uppercase tracking-widest">Memuat data soal...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !soal) {
    return (
      <div className="max-w-[1100px] mx-auto space-y-8 pb-20 animate-in fade-in p-4 md:p-8">
        <Card className="bg-red-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardContent className="p-16 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-black mx-auto mb-4" strokeWidth={3} />
            <p className="text-xl font-black uppercase tracking-widest">{error instanceof Error ? error.message : 'Soal tidak ditemukan'}</p>
            <Button asChild variant="default" className="mt-6 uppercase font-bold border-4 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Link to="/soal">Kembali ke Daftar Soal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-10 pb-20 animate-in fade-in p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button asChild variant="outline" size="icon" className="w-12 h-12 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none">
            <Link to="/soal">
              <ArrowLeft className="w-6 h-6" strokeWidth={3} />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-md">Pratinjau Dokumen</h1>
            <p className="mt-3 text-base font-bold border-l-4 border-primary pl-4">
              <span className="bg-[#ffc900] border-2 border-black px-2 uppercase">{soal.mata_pelajaran}</span> {soal.topik ? ` - ${soal.topik}` : ''} • {soal.jumlah_soal} SOAL
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {genSuccess && (
            <span className="text-sm font-black text-black bg-green-400 px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 uppercase tracking-widest">
              <CheckCircle2 className="w-5 h-5" strokeWidth={3} /> Siap Diunduh
            </span>
          )}
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="border-4 border-black font-black uppercase px-6 h-14 bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black/80 hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none text-base"
          >
            {downloading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <Download className="w-5 h-5 mr-3" strokeWidth={3} />} Unduh DOCX
          </Button>
        </div>
      </div>

      {genError && (
        <div className="flex items-center gap-3 p-4 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AlertCircle className="w-6 h-6 text-black shrink-0" strokeWidth={2.5} />
          <p className="text-base font-black uppercase">{genError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none min-h-[600px] flex items-center justify-center bg-gray-100 p-8">
            <div className="w-full max-w-lg bg-white border-4 border-black border-dashed p-12 flex flex-col items-center justify-center space-y-8 hover:bg-[#ff90e8] transition-colors group">
              <div className="w-24 h-24 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transform -rotate-6 group-hover:rotate-0 transition-transform">
                <FileText className="w-12 h-12 text-black" strokeWidth={2.5} />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black uppercase tracking-tight">Preview Dokumen Word</h3>
                <p className="text-base font-bold leading-relaxed border-l-4 border-black pl-4 text-left">
                  Dokumen akan di-generate menggunakan template Word di server. Klik tombol <span className="bg-[#00f0ff] px-1 border-2 border-black">GENERATE & UNDUH</span>.
                </p>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="border-4 border-black font-black uppercase px-8 h-16 bg-[#00f0ff] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#00f0ff]/80 hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none text-lg w-full"
              >
                {generating ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Download className="w-6 h-6 mr-3" strokeWidth={3} />}
                {generating ? 'GENERATING...' : 'GENERATE & UNDUH'}
              </Button>
            </div>
          </Card>

          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white">
            <CardContent className="p-8">
              <h3 className="text-xl font-black uppercase tracking-widest border-b-4 border-black pb-4 mb-6">Pratinjau Konten Soal</h3>
              <div className="space-y-10">
                {soal.data_soal.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="space-y-4 pb-8 border-b-4 border-black border-dashed last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <span className="bg-black text-white px-3 py-1 font-black text-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">{item.nomor}</span>
                      <p className="text-base font-bold text-black mt-1 leading-snug">{item.pertanyaan}</p>
                    </div>
                    {item.gambar_prompt && (
                      <div className="ml-14 p-4 bg-[#ffc900] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-4">
                        <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shrink-0">
                          <Info className="w-6 h-6 text-black" strokeWidth={2.5} />
                        </div>
                        <p className="text-sm font-bold text-black leading-relaxed">
                          <span className="uppercase tracking-widest bg-white border-2 border-black px-2 py-0.5 mr-2">AI Image Prompt</span>
                          {item.gambar_prompt}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {soal.data_soal.length > 3 && (
                  <div className="text-center pt-4">
                    <span className="bg-gray-200 text-black font-black uppercase tracking-widest px-4 py-2 border-2 border-black">
                      ... {soal.data_soal.length - 3} SOAL LAINNYA ...
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-10">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white">
            <CardContent className="p-8 space-y-10">
              <div>
                <h3 className="text-sm font-black text-gray-500 tracking-widest uppercase mb-6 flex items-center gap-3">
                  <span className="w-3 h-3 bg-[#00f0ff] border-2 border-black inline-block"></span> Metadata
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Mata Pelajaran', value: soal.mata_pelajaran },
                    { label: 'Topik', value: soal.topik || '-' },
                    { label: 'Tipe Soal', value: soal.tipe_soal },
                    { label: 'Jumlah Soal', value: `${soal.jumlah_soal} butir` },
                    { label: 'Kesulitan', value: soal.difficulty },
                    { label: 'Status', value: soal.status },
                  ].map((meta, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b-2 border-black border-dashed">
                      <span className="text-xs font-black uppercase text-gray-600">{meta.label}</span>
                      <span className="text-sm font-black text-black uppercase max-w-[140px] text-right truncate" title={meta.value}>{meta.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-black text-gray-500 tracking-widest uppercase mb-6 flex items-center gap-3">
                  <span className="w-3 h-3 bg-[#ff90e8] border-2 border-black inline-block"></span> Output
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIncludeKunci(!includeKunci)}>
                    <span className="text-base font-black uppercase">Kunci Jawaban</span>
                    <div className={`w-14 h-8 border-4 border-black relative transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${includeKunci ? 'bg-[#00f0ff]' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white border-2 border-black transition-all ${includeKunci ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIncludePembahasan(!includePembahasan)}>
                    <span className="text-base font-black uppercase">Pembahasan</span>
                    <div className={`w-14 h-8 border-4 border-black relative transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${includePembahasan ? 'bg-[#00f0ff]' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white border-2 border-black transition-all ${includePembahasan ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#ffc900] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <CardContent className="p-6 flex gap-5">
              <Info className="w-8 h-8 text-black shrink-0 mt-1" strokeWidth={2.5} />
              <p className="text-base font-black uppercase leading-snug">
                Pastikan Anda telah memeriksa kunci jawaban di tahap Editor sebelum melakukan export final.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
