import { useState } from 'react'
import { Upload, FileText, Search, MoreVertical, Trash2, ExternalLink, Filter, Loader2, AlertCircle, X, FileText as FileTextIcon, Hash, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { useDocuments } from '../hooks/useDocuments'
import { getDocumentDetail } from '../services/documents'
import type { DocumentItem } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
      <Card className="w-full max-w-lg mx-4 overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-[#ff90e8]">
          <h2 className="text-xl font-black uppercase tracking-tight text-black">Upload Modul Ajar</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-black/10 rounded-none text-black">
            <X className="w-6 h-6" strokeWidth={3} />
          </Button>
        </div>

        <CardContent className="p-8">
          {success ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 border-4 border-black bg-[#00f0ff] flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-6">
                <CheckCircle2 className="w-8 h-8 text-black" strokeWidth={3} />
              </div>
              <p className="text-2xl font-black uppercase mt-4">Upload Berhasil</p>
              <p className="text-base font-bold mt-2">Modul ajar telah ditambahkan</p>
            </div>
          ) : (
            <>
              <div
                className={`border-4 border-dashed p-10 text-center transition-all cursor-pointer ${
                  dragActive ? 'border-black bg-[#ffc900] scale-[1.02] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'border-gray-400 hover:border-black hover:bg-gray-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-black mx-auto mb-4" strokeWidth={2.5} />
                <p className="text-base font-black uppercase">
                  Drag & drop file di sini, atau{' '}
                  <label className="text-[#00f0ff] bg-black px-2 hover:bg-black/80 cursor-pointer transition-colors inline-block mt-2">
                    pilih file
                    <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileSelect} />
                  </label>
                </p>
                <p className="text-sm font-bold mt-4 border-t-2 border-black border-dashed pt-4">PDF atau DOCX, maks 10MB</p>
              </div>

              {error && (
                <div className="flex items-center gap-3 mt-6 p-4 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <AlertCircle className="w-6 h-6 text-black shrink-0" strokeWidth={2.5} />
                  <p className="text-sm text-black font-black uppercase">{error}</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function DetailModal({ isOpen, onClose, document }: { isOpen: boolean; onClose: () => void; document: DocumentItem | null }) {
  if (!isOpen || !document) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <Card className="w-full max-w-2xl mx-4 overflow-hidden max-h-[85vh] flex flex-col border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b-4 border-black bg-[#ffc900]">
          <h2 className="text-xl font-black uppercase tracking-tight text-black">Detail Modul Ajar</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-black/10 rounded-none text-black">
            <X className="w-6 h-6" strokeWidth={3} />
          </Button>
        </div>

        <CardContent className="p-8 overflow-y-auto flex-1 bg-white">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-2">
                <FileTextIcon className="w-5 h-5 text-black" strokeWidth={2.5} />
                <span className="text-xs font-black text-black tracking-widest uppercase">Nama File</span>
              </div>
              <p className="text-base font-bold text-black truncate">{document.filename}</p>
            </div>
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-2">
                <Hash className="w-5 h-5 text-black" strokeWidth={2.5} />
                <span className="text-xs font-black text-black tracking-widest uppercase">Format</span>
              </div>
              <p className="text-base font-bold text-black uppercase">{document.filetype}</p>
            </div>
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-2">
                <Calendar className="w-5 h-5 text-black" strokeWidth={2.5} />
                <span className="text-xs font-black text-black tracking-widest uppercase">Tanggal Upload</span>
              </div>
              <p className="text-base font-bold text-black">
                {new Date(document.uploaded_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-2 border-b-2 border-black pb-2">
                <Clock className="w-5 h-5 text-black" strokeWidth={2.5} />
                <span className="text-xs font-black text-black tracking-widest uppercase">Ukuran & Konten</span>
              </div>
              <p className="text-sm font-bold text-black leading-tight">
                {(document.filesize / 1024 / 1024).toFixed(1)} MB<br/>{document.page_count} halaman<br/>{document.word_count.toLocaleString('id-ID')} kata
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-black tracking-widest uppercase mb-4 bg-[#00f0ff] inline-block px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Konten Hasil Ekstraksi AI</h3>
            <div className="bg-gray-50 border-4 border-black p-6 max-h-[300px] overflow-y-auto shadow-inner font-mono text-sm leading-relaxed">
              {document.content}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ModulAjar() {
  const { documents, loading, error, uploadDocument, refetch } = useDocuments()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailDoc, setDetailDoc] = useState<DocumentItem | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = documents
    .filter((doc) => {
      const q = search.toLowerCase()
      const matchName = doc.filename.toLowerCase().includes(q)
      return matchName
    })
    .filter((doc) => {
      if (filterType === 'all') return true
      return doc.filetype === filterType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
        case 'oldest':
          return new Date(a.uploaded_at).getTime() - new Date(b.uploaded_at).getTime()
        case 'name':
          return a.filename.localeCompare(b.filename)
        case 'size':
          return b.filesize - a.filesize
        default:
          return 0
      }
    })

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus modul ini?')) return
    setDeletingId(id)
    try {
      const { deleteDocument } = await import('../services/documents')
      await deleteDocument(id)
      refetch()
    } catch {
      alert('Gagal menghapus modul')
    } finally {
      setDeletingId(null)
    }
  }

  const handleViewDetail = async (id: string) => {
    setDetailLoading(true)
    setDetailOpen(true)
    try {
      const doc = await getDocumentDetail(id)
      setDetailDoc(doc)
    } catch {
      alert('Gagal memuat detail modul')
      setDetailOpen(false)
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in pb-12 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 px-2">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">Modul Ajar</h1>
          <p className="text-lg font-medium text-slate-500 border-l-4 border-brand-500 pl-4">Kelola berkas kurikulum sebagai basis data utama kecerdasan buatan.</p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          size="lg"
          className="h-14 px-8 rounded-2xl font-bold bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-200 transition-all hover:translate-y-[-1px]"
        >
          <Upload className="w-5 h-5 mr-3" strokeWidth={3} /> Upload Modul
        </Button>
      </div>

      {loading ? (
        <Card className="border-2 border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
          <CardContent className="p-20 text-center flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" strokeWidth={3} />
            <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Aset...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-2 border-rose-100 bg-rose-50/30 rounded-[2rem] overflow-hidden">
          <CardContent className="p-20 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-rose-400 mb-4" strokeWidth={3} />
            <p className="text-xl font-bold text-rose-700 uppercase tracking-tight">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-slate-100 shadow-xl shadow-slate-100 rounded-[2rem] overflow-hidden bg-white">
          <div className="p-8 border-b-2 border-slate-50 flex flex-wrap gap-6 justify-between items-center bg-[#ff90e8]/10">
            <div className="relative w-full max-w-lg group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-brand-500" strokeWidth={2.5} />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama berkas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 h-14 bg-white border-2 border-slate-100 rounded-2xl text-base font-bold placeholder:text-slate-300 focus-visible:ring-brand-500/10 focus-visible:border-brand-200 shadow-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-14 px-6 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 bg-white shadow-sm w-[180px] uppercase tracking-wider text-xs">
                  <SelectValue placeholder="Semua Format" />
                </SelectTrigger>
                <SelectContent className="border-2 border-slate-100 rounded-xl shadow-xl">
                  <SelectItem value="all" className="font-bold py-3 uppercase">Semua Format</SelectItem>
                  <SelectItem value="pdf" className="font-bold py-3 uppercase">PDF</SelectItem>
                  <SelectItem value="docx" className="font-bold py-3 uppercase">DOCX</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                <SelectTrigger className="h-14 px-6 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 bg-white shadow-sm w-[180px] uppercase tracking-wider text-xs">
                  <SelectValue placeholder="Terbaru" />
                </SelectTrigger>
                <SelectContent className="border-2 border-slate-100 rounded-xl shadow-xl">
                  <SelectItem value="newest" className="font-bold py-3 uppercase">Terbaru</SelectItem>
                  <SelectItem value="oldest" className="font-bold py-3 uppercase">Terlama</SelectItem>
                  <SelectItem value="name" className="font-bold py-3 uppercase">Nama A-Z</SelectItem>
                  <SelectItem value="size" className="font-bold py-3 uppercase">Ukuran</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center bg-slate-50/30">
              <FileText className="w-16 h-16 text-slate-200 mb-6" strokeWidth={2} />
              <p className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">
                {search || filterType !== 'all' ? 'Modul Tidak Ditemukan' : 'Penyimpanan Kosong'}
              </p>
              <p className="text-lg font-medium text-slate-500 mb-10 border-l-4 border-slate-200 pl-6">
                {search || filterType !== 'all' ? 'Coba ubah kata kunci atau hapus filter.' : 'Unggah modul pertama Anda untuk mulai melatih AI.'}
              </p>
              {!search && filterType === 'all' && (
                <Button
                  onClick={() => setUploadOpen(true)}
                  size="lg"
                  className="h-14 px-10 rounded-2xl font-bold bg-brand-600 shadow-lg"
                >
                  Mulai Upload
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b-2 border-slate-50 text-[11px] uppercase text-slate-400 font-black tracking-[0.2em]">
                    <th className="px-10 py-6">Informasi Berkas</th>
                    <th className="px-8 py-6 text-center">Ekstensi</th>
                    <th className="px-8 py-6 text-center">Kapasitas</th>
                    <th className="px-8 py-6 text-center">Sinkronisasi</th>
                    <th className="px-10 py-6 text-center">Kontrol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((mod) => (
                    <tr key={mod.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${
                            mod.filetype === 'pdf' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-sky-50 border-sky-100 text-sky-600'
                          }`}>
                            <FileText className="w-6 h-6" strokeWidth={2.5} />
                          </div>
                          <span className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate max-w-xs block tracking-tight">
                            {mod.filename}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`text-[10px] font-black uppercase text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg inline-block tracking-widest ${
                          mod.filetype === 'pdf' ? 'bg-rose-50/50' : 'bg-sky-50/50'
                        }`}>
                          {mod.filetype}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center text-base font-bold text-slate-900">
                        {(mod.filesize / 1024 / 1024).toFixed(1)} <span className="text-[10px] text-slate-300 uppercase ml-1">MB</span>
                      </td>
                      <td className="px-8 py-6 text-center text-[13px] font-bold text-slate-400">
                        {new Date(mod.uploaded_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center justify-center gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewDetail(mod.id)}
                            className="h-10 w-10 rounded-xl border-2 border-slate-100 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 shadow-sm transition-all"
                            title="Lihat Detail"
                          >
                            <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(mod.id)}
                            disabled={deletingId === mod.id}
                            className="h-10 w-10 rounded-xl border-2 border-slate-100 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 shadow-sm transition-all disabled:opacity-50"
                            title="Hapus"
                          >
                            {deletingId === mod.id ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" /> : <Trash2 className="w-4 h-4" strokeWidth={2.5} />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-8 border-t-2 border-slate-50 bg-slate-50/30 flex items-center justify-center">
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">
              Total Library: {filtered.length} Berkas Aktif
            </p>
          </div>
        </Card>
      )}

      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={uploadDocument} />
      <DetailModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} document={detailDoc} />
      {detailLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none bg-white p-8 flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-black animate-spin mb-4" strokeWidth={3} />
            <p className="text-sm font-black uppercase tracking-widest text-black">Memuat detail modul...</p>
          </Card>
        </div>
      )}
    </div>
  )
}
