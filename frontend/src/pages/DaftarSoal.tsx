import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Edit, FileDown, Trash, Plus, MoreVertical, Loader2, AlertCircle } from 'lucide-react'
import { useSoalList, useDeleteSoal } from '../hooks/useSoal'

export default function DaftarSoal() {
  const { data: soalList, isLoading, error } = useSoalList()
  const deleteMutation = useDeleteSoal()
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus soal ini?')) return
    setDeletingId(id)
    try {
      await deleteMutation.mutateAsync(id)
    } catch {
      alert('Gagal menghapus soal')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = soalList?.filter((s) => {
    const q = search.toLowerCase()
    return s.mata_pelajaran.toLowerCase().includes(q) || (s.topik?.toLowerCase().includes(q) ?? false)
  })

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Daftar Soal</h1>
          <p className="mt-2 text-gray-500 font-medium">Kumpulan bank soal yang telah Anda generate melalui AI.</p>
        </div>
        <Link to="/soal/generate" className="flex items-center gap-2 px-5 py-3 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-all shadow-md hover:shadow-lg active:scale-95 text-sm">
          <Plus className="w-4 h-4" strokeWidth={3} /> Buat Baru
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-12 text-center">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">Memuat daftar soal...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-700">{error instanceof Error ? error.message : 'Gagal memuat data'}</p>
        </div>
      ) : !filtered || filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-12 text-center">
          <FileDown className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">Belum ada soal</p>
          <p className="text-xs text-gray-400 mt-1 mb-4">Generate soal pertama Anda untuk memulai</p>
          <Link to="/soal/generate" className="text-sm font-bold text-brand-500 hover:text-brand-600">Generate Sekarang</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                placeholder="Cari berdasarkan mata pelajaran atau topik..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-200 transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-xs">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <button className="p-2.5 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-xs">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase text-gray-400 font-black tracking-widest">
                  <th className="px-8 py-5">Judul Soal</th>
                  <th className="px-8 py-5">Mata Pelajaran</th>
                  <th className="px-8 py-5">Jumlah</th>
                  <th className="px-8 py-5">Tanggal Dibuat</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-8 rounded-full ${item.status === 'draft' ? 'bg-gray-300' : 'bg-brand-500'}`}></div>
                        <span className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors truncate max-w-xs">
                          {item.topik || item.mata_pelajaran}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">{item.mata_pelajaran}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-gray-900">{item.jumlah_soal} <span className="text-gray-400 font-medium">Butir</span></span>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-500">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                        item.status === 'draft' ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/soal/edit/${item.id}`} className="p-2 text-gray-400 hover:text-brand-600 bg-white rounded-xl border border-gray-200 hover:border-brand-100 hover:shadow-sm transition-all" title="Edit Soal">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link to={`/soal/preview/${item.id}`} className="p-2 text-gray-400 hover:text-green-600 bg-white rounded-xl border border-gray-200 hover:border-green-100 hover:shadow-sm transition-all" title="Preview Word">
                          <FileDown className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="p-2 text-gray-400 hover:text-red-600 bg-white rounded-xl border border-gray-200 hover:border-red-100 hover:shadow-sm transition-all disabled:opacity-50"
                          title="Hapus"
                        >
                          {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-5 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total {filtered.length} soal</p>
          </div>
        </div>
      )}
    </div>
  )
}
