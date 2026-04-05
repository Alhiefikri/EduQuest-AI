import { useState } from 'react'
import { Upload, FileText, Search, Trash2, ExternalLink, Loader2, AlertCircle, X, Hash, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { useDocuments } from '../hooks/useDocuments'
import { getDocumentDetail, deleteDocument } from '../services/documents'
import type { DocumentItem } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in transition-all" onClick={onClose}>
      <Card className="w-full max-w-lg mx-4 overflow-hidden border border-slate-200 shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100 shadow-sm">
                <Upload className="w-4.5 h-4.5 text-brand-600" strokeWidth={2.5} />
             </div>
             <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 leading-none">Upload Modul Ajar</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-50 rounded-xl text-slate-500 h-9 w-9">
            <X className="w-5 h-5" strokeWidth={2.5} />
          </Button>
        </div>

        <CardContent className="p-6">
          {success ? (
            <div className="flex flex-col items-center py-10 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl border-4 border-white bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 shadow-inner">
                <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
              </div>
              <p className="text-base font-black text-slate-900 uppercase tracking-widest">Upload Berhasil</p>
              <p className="text-xs font-bold text-slate-600 mt-2 uppercase tracking-wide">Modul ajar telah ditambahkan ke bank data</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer group ${
                  dragActive ? 'border-brand-500 bg-brand-50/50 scale-[1.01] shadow-sm' : 'border-slate-200 hover:border-brand-400 hover:bg-slate-50/50 hover:shadow-sm'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
              >
                <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center mx-auto mb-5 transition-transform group-hover:scale-105">
                   <Upload className="w-7 h-7 text-brand-500" strokeWidth={2} />
                </div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-relaxed">
                  Tarik & lepas file di sini, atau{' '}
                  <label className="text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md hover:bg-brand-100 cursor-pointer transition-colors inline-block mt-2">
                    pilih berkas
                    <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileSelect} />
                  </label>
                </p>
                <p className="text-[10px] font-black text-slate-400 mt-5 uppercase tracking-widest border-t border-slate-100 pt-5">
                   PDF / DOCX &bull; MAKSIMUM 10MB
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl animate-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" strokeWidth={2.5} />
                  <p className="text-xs text-rose-800 font-bold uppercase tracking-tight leading-relaxed">{error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function DetailModal({ isOpen, onClose, document }: { isOpen: boolean; onClose: () => void; document: DocumentItem | null }) {
  if (!isOpen || !document) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
      <Card className="w-full max-w-3xl mx-4 overflow-hidden max-h-[85vh] flex flex-col border border-slate-200 shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center border border-brand-100 shadow-sm">
                <FileText className="w-4.5 h-4.5 text-brand-600" strokeWidth={2.5} />
             </div>
             <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 leading-none">Detail Modul Ajar</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-50 rounded-xl text-slate-500 h-9 w-9">
            <X className="w-5 h-5" strokeWidth={2.5} />
          </Button>
        </div>

        <CardContent className="p-6 overflow-y-auto flex-1 bg-white space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl shadow-sm hover:border-brand-200 transition-colors group">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-200/50 pb-2.5">
                <FileText className="w-4 h-4 text-brand-600" strokeWidth={2.5} />
                <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Nama Berkas</span>
              </div>
              <p className="text-sm font-black text-slate-900 truncate tracking-tight">{document.filename}</p>
            </div>
            
            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-200/50 pb-2.5">
                <Hash className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Format Ekstensi</span>
              </div>
              <Badge variant="outline" className="bg-white text-xs font-black uppercase tracking-widest border-slate-200 px-3 py-0.5 rounded-md">
                 {document.filetype}
              </Badge>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-200/50 pb-2.5">
                <Calendar className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Waktu Unggah</span>
              </div>
              <p className="text-sm font-black text-slate-900 tracking-tight uppercase leading-none">
                {new Date(document.uploaded_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-200/50 pb-2.5">
                <Clock className="w-4 h-4 text-sky-600" strokeWidth={2.5} />
                <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Kapasitas & Konten</span>
              </div>
              <div className="flex items-center gap-3">
                 <p className="text-sm font-black text-slate-900">{(document.filesize / 1024 / 1024).toFixed(1)} MB</p>
                 <span className="text-slate-200">&bull;</span>
                 <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">{document.page_count} Hal &bull; {document.word_count.toLocaleString('id-ID')} Kata</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black text-slate-900 tracking-widest uppercase flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  Konten Ekstraksi AI
               </h3>
               <Badge variant="secondary" className="bg-slate-100 text-[10px] font-black tracking-tighter uppercase px-2 py-0">PROCESSED</Badge>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-h-[300px] overflow-y-auto shadow-inner group">
               <p className="text-xs font-bold text-slate-700 leading-relaxed font-mono whitespace-pre-wrap select-all">
                  {document.content}
               </p>
            </div>
          </div>
        </CardContent>
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
           <Button onClick={onClose} size="sm" className="h-9 px-6 rounded-lg bg-slate-900 text-white font-black uppercase text-xs tracking-widest shadow-lg">Tutup Detail</Button>
        </div>
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
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b pb-6">
        <div className="space-y-1.5 px-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Modul Ajar Library</h1>
          <p className="text-xs font-bold text-slate-600 border-l-2 border-brand-500 pl-4 uppercase tracking-widest leading-none">Manajemen Basis Data & Pengetahuan AI</p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          size="sm"
          className="h-10 px-6 rounded-lg font-black bg-slate-900 border border-slate-950 text-white shadow-xl hover:translate-y-[-1px] transition-all uppercase tracking-widest text-xs"
        >
          <Upload className="w-4 h-4 mr-2.5" strokeWidth={3} /> Upload Modul
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-10 h-10 text-brand-500 animate-spin" strokeWidth={3} />
          <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Sinkronisasi Aset...</p>
        </div>
      ) : error ? (
        <Card className="border border-rose-100 bg-rose-50/30 rounded-xl overflow-hidden">
          <CardContent className="p-16 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mb-4" strokeWidth={2.5} />
            <p className="text-xs font-black text-rose-700 uppercase tracking-widest">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm" className="mt-4 border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest px-6 h-9">Coba Lagi</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Filters Area */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between px-1">
            <div className="relative w-full lg:max-w-md group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 transition-colors group-focus-within:text-brand-500" strokeWidth={2.5} />
              <Input
                type="text"
                placeholder="Cari dokumentasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-5 h-11 bg-white border border-slate-200 rounded-xl text-sm font-bold placeholder:text-slate-400 focus-visible:ring-brand-500/10 focus-visible:border-brand-300 shadow-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-11 px-4 rounded-xl border border-slate-200 font-black text-slate-700 bg-white shadow-sm flex-1 lg:w-[160px] uppercase tracking-widest text-[11px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent className="border border-slate-200 rounded-xl shadow-2xl">
                  <SelectItem value="all" className="font-black text-[11px] py-2.5 uppercase tracking-widest">SEMUA FORMAT</SelectItem>
                  <SelectItem value="pdf" className="font-black text-[11px] py-2.5 uppercase tracking-widest">PDF AIAR</SelectItem>
                  <SelectItem value="docx" className="font-black text-[11px] py-2.5 uppercase tracking-widest">DOCX FORMAT</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                <SelectTrigger className="h-11 px-4 rounded-xl border border-slate-200 font-black text-slate-700 bg-white shadow-sm flex-1 lg:w-[160px] uppercase tracking-widest text-[11px]">
                  <SelectValue placeholder="Urutan" />
                </SelectTrigger>
                <SelectContent className="border border-slate-200 rounded-xl shadow-2xl">
                  <SelectItem value="newest" className="font-black text-[11px] py-2.5 uppercase tracking-widest">TERBARU</SelectItem>
                  <SelectItem value="oldest" className="font-black text-[11px] py-2.5 uppercase tracking-widest">TERLAMA</SelectItem>
                  <SelectItem value="name" className="font-black text-[11px] py-2.5 uppercase tracking-widest">NAMA A-Z</SelectItem>
                  <SelectItem value="size" className="font-black text-[11px] py-2.5 uppercase tracking-widest">UKURAN FILE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <Card className="border border-slate-200 border-dashed rounded-2xl bg-slate-50/20">
              <CardContent className="p-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 border border-slate-200 shadow-inner">
                   <FileText className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-3">
                  {search || filterType !== 'all' ? 'Modul Tidak Ditemukan' : 'Penyimpanan Kosong'}
                </p>
                <p className="text-xs font-bold text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed uppercase tracking-wider">
                  {search || filterType !== 'all' ? 'Ubah kata kunci pencarian atau reset filter untuk melihat dokumen lain.' : 'Mulai bangun basis pengetahuan AI dengan mengunggah modul ajar pertama Anda.'}
                </p>
                <Button
                  onClick={() => setUploadOpen(true)}
                  size="sm"
                  className="h-11 px-10 rounded-xl font-black bg-slate-900 text-white uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                >
                  <Upload className="w-4 h-4 mr-2.5" /> Mulai Upload
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-100/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest">Informasi Berkas</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest text-center hidden md:table-cell">Format</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest text-center">Kapasitas</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest text-center hidden lg:table-cell">Sinkronsasi</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-600 uppercase tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((mod) => (
                    <tr key={mod.id} className="hover:bg-slate-50/50 transition-all group duration-200 leading-none">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:scale-105 border-slate-100 ${
                            mod.filetype === 'pdf' ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-sky-600'
                          }`}>
                            <FileText className="w-5.5 h-5.5" strokeWidth={2.5} />
                          </div>
                          <div className="min-w-0">
                             <p className="text-sm font-black text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight truncate leading-tight">
                                {mod.filename}
                             </p>
                             <div className="flex items-center gap-2 mt-1.5 md:hidden">
                                <Badge variant="secondary" className="bg-slate-100 text-[10px] py-0 px-1.5 font-black uppercase">{mod.filetype}</Badge>
                                <span className="text-[10px] font-bold text-slate-500">{(mod.filesize / 1024 / 1024).toFixed(1)} MB</span>
                             </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center hidden md:table-cell">
                        <Badge className={`text-[10px] font-black uppercase text-white px-2.5 py-0.5 rounded-md tracking-widest border-none shadow-sm ${
                          mod.filetype === 'pdf' ? 'bg-rose-500' : 'bg-sky-500'
                        }`}>
                          {mod.filetype}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 text-center">
                         <div className="flex flex-col gap-0.5 items-center">
                            <span className="text-sm font-black text-slate-900 tracking-tighter">{(mod.filesize / 1024 / 1024).toFixed(1)} <span className="text-[10px] text-slate-400 font-black ml-0.5 uppercase">MB</span></span>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">{mod.page_count} Hal</span>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-center hidden lg:table-cell">
                         <div className="flex flex-col gap-0.5 items-center">
                            <span className="text-xs font-black text-slate-700 leading-tight uppercase tracking-tight">
                               {new Date(mod.uploaded_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               {new Date(mod.uploaded_at).getFullYear()}
                            </span>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetail(mod.id)}
                            className="h-9 w-9 rounded-lg hover:bg-brand-50 hover:text-brand-600 text-slate-600 border border-transparent hover:border-brand-100 transition-all active:scale-95 shadow-none"
                            title="Detail"
                          >
                            <ExternalLink className="w-4.5 h-4.5" strokeWidth={2.5} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(mod.id)}
                            disabled={deletingId === mod.id}
                            className="h-9 w-9 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-slate-600 border border-transparent hover:border-rose-100 transition-all active:scale-95 shadow-none disabled:opacity-50"
                            title="Hapus"
                          >
                            {deletingId === mod.id ? <Loader2 className="w-4.5 h-4.5 text-slate-400 animate-spin" /> : <Trash2 className="w-4.5 h-4.5" strokeWidth={2.5} />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest">
                  Library Registry: {filtered.length} Berkas Sinkron
                </p>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" disabled className="h-8 min-w-[70px] text-[10px] font-black uppercase tracking-widest rounded-md border-slate-200 bg-white">Prev</Button>
                   <Button variant="outline" size="sm" disabled className="h-8 min-w-[70px] text-[10px] font-black uppercase tracking-widest rounded-md border-slate-200 bg-white">Next</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={uploadDocument} />
      <DetailModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} document={detailDoc} />
      
      {detailLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <Card className="border border-slate-200 shadow-2xl rounded-2xl bg-white p-10 flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-5" strokeWidth={3} />
            <p className="text-xs font-black uppercase tracking-widest text-slate-900">Mengambil Metadata Modul...</p>
          </Card>
        </div>
      )}
    </div>
  )
}
