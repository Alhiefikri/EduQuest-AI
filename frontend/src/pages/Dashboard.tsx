import { useState } from 'react'
import { Upload, Zap, FileText, BookOpen, LayoutTemplate, ArrowRight, Folder, Lightbulb, Clock, ChevronRight, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDocuments } from '../hooks/useDocuments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

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
      <Card className="w-full max-w-lg mx-4 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b-4 border-black">
          <h2 className="text-xl font-bold uppercase tracking-tight">Upload Modul Ajar</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <CardContent className="p-6">
          {success ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 rounded-none border-4 border-black bg-green-400 flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle2 className="w-8 h-8 text-black" strokeWidth={3} />
              </div>
              <p className="text-xl font-black uppercase mt-4">Upload Berhasil</p>
              <p className="text-sm font-bold mt-1">Modul ajar telah ditambahkan</p>
            </div>
          ) : (
            <>
              <div
                className={`border-4 border-dashed p-10 text-center transition-all ${
                  dragActive ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-black hover:border-primary hover:bg-gray-50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-black mx-auto mb-4" strokeWidth={2.5} />
                <p className="text-base font-bold">
                  Drag & drop file di sini, atau{' '}
                  <label className="text-primary hover:text-primary/80 cursor-pointer underline underline-offset-4">
                    pilih file
                    <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileSelect} />
                  </label>
                </p>
                <p className="text-sm font-bold mt-2">PDF atau DOCX, maks 10MB</p>
              </div>

              {error && (
                <div className="flex items-center gap-3 mt-6 p-4 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <AlertCircle className="w-5 h-5 text-black shrink-0" strokeWidth={2.5} />
                  <p className="text-sm text-black font-bold uppercase">{error}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function Dashboard() {
  const { documents, loading, error, uploadDocument, isUploading, refetch } = useDocuments()
  const [uploadOpen, setUploadOpen] = useState(false)

  return (
    <div className="space-y-12 animate-in fade-in pb-12 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-md">Executive Dashboard</h1>
          <p className="mt-3 text-lg font-bold border-l-4 border-primary pl-4">Elevating education through cognitive intelligence.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setUploadOpen(true)}
            className="text-base font-bold uppercase tracking-wider"
          >
            <Upload className="w-5 h-5 mr-2" strokeWidth={2.5} />
            Upload Modul
          </Button>
          <Button asChild size="lg" className="text-base font-bold uppercase tracking-wider">
            <Link to="/soal/generate">
              <Zap className="w-5 h-5 mr-2" fill="currentColor" strokeWidth={0} />
              Generate Soal
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { label: 'TOTAL DOKUMEN', value: loading ? '...' : String(documents.length), icon: FileText, color: 'bg-[#ff90e8]', sub: `${documents.reduce((sum, d) => sum + d.word_count, 0).toLocaleString('id-ID')} kata total` },
          { label: 'MODUL AJAR', value: loading ? '...' : String(documents.filter(d => d.filetype === 'pdf').length), icon: BookOpen, color: 'bg-[#ffc900]', sub: 'File PDF terupload' },
          { label: 'FILE WORD', value: loading ? '...' : String(documents.filter(d => d.filetype === 'docx').length), icon: LayoutTemplate, color: 'bg-[#00f0ff]', sub: 'File DOCX terupload' },
        ].map((stat, i) => (
          <Card key={i} className="hover:-translate-y-1 hover:shadow-xl transition-transform duration-200">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest">{stat.label}</CardTitle>
              <div className={`w-12 h-12 border-4 border-black flex items-center justify-center ${stat.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                <stat.icon className="w-6 h-6 text-black" strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-black">{stat.value}</p>
              </div>
              <p className="text-sm font-bold mt-2 uppercase">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Dokumen Terbaru */}
        <section>
          <div className="flex justify-between items-center mb-6 pb-2 border-b-4 border-black">
            <h2 className="text-2xl font-black uppercase flex items-center gap-3">
              <Clock className="w-6 h-6" strokeWidth={3} />
              Dokumen Terbaru
            </h2>
            <Link to="/modul" className="text-sm font-bold uppercase underline underline-offset-4 hover:text-primary">Kelola Modul</Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 flex items-center gap-5">
                    <div className="w-14 h-14 bg-gray-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-5 bg-gray-200 w-3/4" />
                      <div className="h-4 bg-gray-200 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="bg-red-400">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <AlertCircle className="w-12 h-12 mb-4" strokeWidth={2.5} />
                <p className="text-lg font-black uppercase">{error}</p>
                <Button onClick={refetch} variant="default" className="mt-6 uppercase font-bold border-white">Coba Lagi</Button>
              </CardContent>
            </Card>
          ) : documents.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center flex flex-col items-center">
                <Folder className="w-12 h-12 mb-4 opacity-50" strokeWidth={2.5} />
                <p className="text-xl font-black uppercase mb-2">Belum ada dokumen</p>
                <p className="text-sm font-bold mb-6">Upload modul ajar pertama Anda untuk mulai</p>
                <Button onClick={() => setUploadOpen(true)} className="uppercase font-bold">Upload Sekarang</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-5">
              {documents.slice(0, 5).map((doc) => (
                <Card key={doc.id} className="hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group">
                  <CardContent className="p-5 flex items-center gap-5">
                    <div className={`p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 transition-transform group-hover:scale-110 ${
                      doc.filetype === 'pdf' ? 'bg-[#ff90e8]' : 'bg-[#00f0ff]'
                    }`}>
                      <FileText className="w-6 h-6 text-black" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-black leading-tight truncate">{doc.filename}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-bold">
                          {doc.page_count} hal &bull; {doc.word_count.toLocaleString('id-ID')} kata
                        </span>
                        <span className={`text-[10px] font-black px-2 py-1 border-2 border-black uppercase ${
                          doc.filetype === 'pdf' ? 'bg-[#ff90e8]' : 'bg-[#00f0ff]'
                        }`}>{doc.filetype}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-black opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" strokeWidth={3} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Statistik Dokumen */}
        <section>
          <div className="flex justify-between items-center mb-6 pb-2 border-b-4 border-black">
            <h2 className="text-2xl font-black uppercase flex items-center gap-3">
              <Folder className="w-6 h-6" strokeWidth={3} />
              Statistik Dokumen
            </h2>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-5 bg-gray-200 w-1/3 mb-4" />
                    <div className="h-6 bg-gray-200 w-2/3 mb-3" />
                    <div className="h-4 bg-gray-200 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center flex flex-col items-center">
                <BookOpen className="w-12 h-12 mb-4 opacity-50" strokeWidth={2.5} />
                <p className="text-xl font-black uppercase mb-2">Belum ada modul ajar</p>
                <p className="text-sm font-bold">Upload file PDF atau DOCX untuk memulai</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {documents.slice(0, 4).map((doc) => (
                <Card key={doc.id} className="group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-xs font-black px-3 py-1 border-2 border-black uppercase ${
                        doc.filetype === 'pdf' ? 'bg-[#ff90e8]' : 'bg-[#00f0ff]'
                      }`}>{doc.filetype}</span>
                    </div>
                    <h3 className="text-xl font-black leading-snug group-hover:underline underline-offset-4 truncate">{doc.filename}</h3>
                    <p className="text-sm font-bold mt-2 mb-6">
                      {doc.page_count} hal &bull; {doc.word_count.toLocaleString('id-ID')} kata &bull; {(doc.filesize / 1024 / 1024).toFixed(1)} MB
                    </p>
                    <Button asChild className="w-full mt-auto text-sm font-bold uppercase">
                      <Link to="/soal/generate">
                        <Zap className="w-4 h-4 mr-2" fill="currentColor" strokeWidth={0} /> Generate Soal
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* AI Insight Card */}
      <Card className="bg-[#ffc900] border-4 border-black overflow-hidden relative mt-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-20 -mt-20 opacity-20 blur-2xl pointer-events-none"></div>
        <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="p-6 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 transform -rotate-6">
            <Lightbulb className="w-12 h-12 animate-pulse-slow" strokeWidth={2.5} />
          </div>
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tight">AI Insight: Optimal Performance</h2>
            <p className="text-lg font-bold leading-relaxed mb-8 max-w-2xl">
              Berdasarkan modul ajar terbaru Anda, AI menyarankan pembuatan <strong className="text-black bg-white px-2 py-0.5 border-2 border-black">+3 set soal</strong> dengan tingkat kesulitan HOTS untuk meningkatkan daya kritis siswa.
            </p>
            <Button asChild size="lg" variant="default" className="text-base font-black uppercase bg-black text-white hover:bg-black/80 hover:text-white border-2 border-black">
              <Link to="/soal/generate">
                Mulai Generator Rekomendasi <ArrowRight className="w-5 h-5 ml-2" strokeWidth={3} />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
