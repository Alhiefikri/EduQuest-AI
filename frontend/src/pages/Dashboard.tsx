import { useState } from 'react'
import { Upload, Zap, FileText, BookOpen, LayoutTemplate, ArrowRight, Folder, Lightbulb, Clock, ChevronRight, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDocuments } from '../hooks/useDocuments'

function UploadModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleUpload = async (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      setError('Hanya file PDF dan DOCX yang diterima')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file melebihi batas maksimum 10MB')
      return
    }

    setError(null)
    setSuccess(false)
    try {
      await onSuccess(file)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err: unknown) {
      const message = err instanceof Error && 'message' in err ? err.message : 'Gagal mengupload file'
      setError(message)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Upload Modul Ajar</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">Upload Berhasil</p>
              <p className="text-sm text-gray-500 mt-1">Modul ajar telah berhasil ditambahkan</p>
            </div>
          ) : (
            <>
              <div
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
                  dragActive ? 'border-brand-400 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-700">
                  Drag & drop file di sini, atau{' '}
                  <label className="text-brand-500 hover:text-brand-600 cursor-pointer underline">
                    pilih file
                    <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileSelect} />
                  </label>
                </p>
                <p className="text-xs text-gray-400 mt-2">PDF atau DOCX, maksimal 10MB</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { documents, loading, error, uploadDocument, isUploading, refetch } = useDocuments()
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <div className="space-y-10 animate-in fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 mt-2 text-base font-medium">Elevating education through cognitive intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3 bg-white border border-gray-200 shadow-xs text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
          >
            <Upload className="w-4 h-4 text-brand-500" strokeWidth={2.5} />
            Upload Modul
          </button>
          <Link to="/soal/generate" className="flex items-center gap-2.5 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
            <Zap className="w-4 h-4" fill="currentColor" strokeWidth={0} />
            Generate Soal
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'TOTAL DOKUMEN', value: loading ? '...' : String(documents.length), icon: FileText, color: 'brand', sub: `${documents.reduce((sum, d) => sum + d.word_count, 0).toLocaleString('id-ID')} kata total` },
          { label: 'MODUL AJAR', value: loading ? '...' : String(documents.filter(d => d.filetype === 'pdf').length), icon: BookOpen, color: 'orange', sub: 'File PDF terupload' },
          { label: 'FILE WORD', value: loading ? '...' : String(documents.filter(d => d.filetype === 'docx').length), icon: LayoutTemplate, color: 'gray', sub: 'File DOCX terupload' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                stat.color === 'brand' ? 'bg-brand-50 text-brand-500' :
                stat.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 tracking-[0.15em] uppercase mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900 leading-none">{stat.value}</p>
                <p className="text-[13px] font-semibold text-gray-500">{stat.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Dokumen Terbaru */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-500" />
              Dokumen Terbaru
            </h2>
            <Link to="/modul" className="text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">Kelola Modul</Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-white p-8 rounded-2xl border border-red-100 text-center">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-red-700">{error}</p>
              <button onClick={refetch} className="mt-3 text-sm font-bold text-brand-500 hover:text-brand-600">Coba Lagi</button>
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
              <Folder className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">Belum ada dokumen</p>
              <p className="text-xs text-gray-400 mt-1 mb-4">Upload modul ajar pertama Anda untuk mulai</p>
              <button
                onClick={() => setUploadOpen(true)}
                className="text-sm font-bold text-brand-500 hover:text-brand-600"
              >
                Upload Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.slice(0, 5).map((doc) => (
                <div key={doc.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-brand-200 transition-all group cursor-pointer">
                  <div className={`p-3.5 rounded-xl shrink-0 transition-colors ${
                    doc.filetype === 'pdf'
                      ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'
                      : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 leading-tight truncate">{doc.filename}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[13px] font-medium text-gray-400">
                        {doc.page_count} halaman &bull; {doc.word_count.toLocaleString('id-ID')} kata
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase ${
                        doc.filetype === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>{doc.filetype}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition-colors" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Modul Ajar Terbaru */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Folder className="w-5 h-5 text-orange-500" />
              Statistik Dokumen
            </h2>
          </div>

          {loading ? (
            <div className="space-y-5">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                  <div className="h-5 bg-gray-100 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">Belum ada modul ajar</p>
              <p className="text-xs text-gray-400 mt-1">Upload file PDF atau DOCX untuk memulai</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {documents.slice(0, 4).map((doc) => (
                <div key={doc.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider uppercase ${
                      doc.filetype === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>{doc.filetype}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-brand-500 transition-colors truncate">{doc.filename}</h3>
                  <p className="text-[13px] font-medium text-gray-400 mt-2 mb-6">
                    {doc.page_count} halaman &bull; {doc.word_count.toLocaleString('id-ID')} kata &bull; {(doc.filesize / 1024 / 1024).toFixed(1)} MB
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <Link to="/soal/generate" className="flex-1 bg-brand-500 hover:bg-brand-600 text-white flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                      <Zap className="w-4 h-4" fill="currentColor" strokeWidth={0} /> Generate Soal
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* AI Insight Card */}
      <div className="bg-brand-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-800 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-700 rounded-full -ml-16 -mb-16 opacity-30 blur-2xl"></div>

        <div className="bg-brand-800/50 p-5 rounded-2xl shadow-inner shrink-0 relative z-10">
          <Lightbulb className="w-8 h-8 text-brand-300 animate-pulse" />
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-3">AI Insight: Optimal Performance</h2>
          <p className="text-brand-200 text-base leading-relaxed mb-6 max-w-2xl font-medium">
            Berdasarkan modul ajar terbaru Anda, AI menyarankan pembuatan <strong className="text-white font-bold">+3 set soal</strong> dengan tingkat kesulitan HOTS untuk meningkatkan daya kritis siswa.
          </p>
          <Link to="/soal/generate" className="bg-white text-brand-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-50 transition-all flex items-center gap-2 mx-auto md:mx-0 shadow-lg active:scale-95">
            Mulai Generator Rekomendasi <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={uploadDocument} />
    </div>
  )
}
