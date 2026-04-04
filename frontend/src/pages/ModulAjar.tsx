import { useState } from 'react'
import { Upload, FileText, Search, MoreVertical, Trash2, ExternalLink, Filter, Loader2, AlertCircle } from 'lucide-react'
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
            <Upload className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
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

export default function ModulAjar() {
  const { documents, loading, error, uploadDocument, refetch } = useDocuments()
  const [uploadOpen, setUploadOpen] = useState(false)
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

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Modul Ajar</h1>
          <p className="text-gray-500 mt-2 font-medium">Kelola berkas modul sebagai sumber materi ekstraksi AI.</p>
        </div>
        <button
          onClick={() => setUploadOpen(true)}
          className="flex items-center gap-2.5 px-6 py-3 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 transition-all shadow-md active:scale-95"
        >
          <Upload className="w-4 h-4" /> Upload Modul
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-12 text-center">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">Memuat daftar modul...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                placeholder="Cari modul berdasarkan nama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all appearance-none cursor-pointer"
              >
                <option value="all">Semua Format</option>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all appearance-none cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="name">Nama A-Z</option>
                <option value="size">Ukuran Terbesar</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-700">
                {search || filterType !== 'all' ? 'Tidak ada modul yang sesuai filter' : 'Belum ada modul ajar'}
              </p>
              <p className="text-xs text-gray-400 mt-1 mb-4">
                {search || filterType !== 'all' ? 'Coba ubah kata kunci atau filter' : 'Upload modul pertama Anda untuk memulai'}
              </p>
              {!search && filterType === 'all' && (
                <button
                  onClick={() => setUploadOpen(true)}
                  className="text-sm font-bold text-brand-500 hover:text-brand-600"
                >
                  Upload Sekarang
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-8 py-5">Nama Modul</th>
                    <th className="px-8 py-5">Format</th>
                    <th className="px-8 py-5">Ukuran</th>
                    <th className="px-8 py-5">Tanggal Upload</th>
                    <th className="px-8 py-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((mod) => (
                    <tr key={mod.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl shadow-inner ${
                            mod.filetype === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors truncate max-w-xs">
                            {mod.filename}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md tracking-wider uppercase ${
                          mod.filetype === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>{mod.filetype}</span>
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-gray-500">
                        {(mod.filesize / 1024 / 1024).toFixed(1)} MB
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-gray-500">
                        {new Date(mod.uploaded_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-brand-500 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all" title="Lihat Detail">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(mod.id)}
                            disabled={deletingId === mod.id}
                            className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all disabled:opacity-50"
                            title="Hapus"
                          >
                            {deletingId === mod.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-5 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Menampilkan {filtered.length} dari {documents.length} modul
            </p>
          </div>
        </div>
      )}

      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} onSuccess={uploadDocument} />
    </div>
  )
}
