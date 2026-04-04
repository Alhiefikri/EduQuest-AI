import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Edit, FileDown, Trash, Plus, MoreVertical, Loader2, AlertCircle } from 'lucide-react'
import { useSoalList, useDeleteSoal } from '../hooks/useSoal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

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
    <div className="space-y-10 animate-in fade-in pb-12 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 px-2">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">Daftar Soal</h1>
          <p className="text-lg font-medium text-slate-500 border-l-4 border-brand-500 pl-4">Kumpulan bank soal yang telah Anda generate melalui bantuan AI.</p>
        </div>
        <Button asChild size="lg" className="h-14 px-8 rounded-2xl font-bold bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-200 transition-all hover:translate-y-[-1px]">
          <Link to="/soal/generate">
            <Plus className="w-5 h-5 mr-2" strokeWidth={3} /> Buat Baru
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-2 border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
          <CardContent className="p-20 text-center flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" strokeWidth={3} />
            <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Basis Data...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-2 border-rose-100 bg-rose-50/30 rounded-[2rem] overflow-hidden">
          <CardContent className="p-20 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-rose-400 mb-4" strokeWidth={2} />
            <p className="text-xl font-bold text-rose-700 uppercase tracking-tight">{error instanceof Error ? error.message : 'Gagal memuat data'}</p>
          </CardContent>
        </Card>
      ) : !filtered || filtered.length === 0 ? (
        <Card className="bg-slate-50 border-2 border-slate-100 border-dashed rounded-[2rem] overflow-hidden">
          <CardContent className="p-20 text-center flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-8">
              <FileDown className="w-12 h-12 text-slate-200" strokeWidth={2} />
            </div>
            <p className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">Bank Soal Kosong</p>
            <p className="text-lg font-medium text-slate-500 mb-10 border-l-4 border-slate-200 pl-6">Generate soal pertama Anda untuk mulai mengisi library ini.</p>
            <Button asChild size="lg" className="h-14 px-10 rounded-2xl font-bold bg-brand-600 shadow-lg">
              <Link to="/soal/generate">Generate Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-slate-100 shadow-xl shadow-slate-100 rounded-[2rem] overflow-hidden bg-white">
          <div className="p-8 border-b-2 border-slate-50 flex flex-wrap gap-6 justify-between items-center bg-slate-50/50">
            <div className="relative w-full max-w-lg group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-brand-500" strokeWidth={2.5} />
              <Input
                type="text"
                placeholder="Cari mata pelajaran atau topik..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 h-14 bg-white border-2 border-slate-100 rounded-2xl text-base font-bold placeholder:text-slate-300 focus-visible:ring-brand-500/10 focus-visible:border-brand-200 shadow-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="h-14 px-6 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-white hover:border-slate-200 shadow-sm">
                <Filter className="w-5 h-5 mr-3 text-slate-400" strokeWidth={2.5} /> Filter Pencarian
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100 text-[11px] uppercase text-slate-400 font-black tracking-[0.2em]">
                  <th className="px-10 py-6">Identitas Soal</th>
                  <th className="px-8 py-6">Kategori</th>
                  <th className="px-8 py-6 text-center">Volume</th>
                  <th className="px-8 py-6 text-center">Kronologi</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-10 py-6 text-right">Manajemen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className={`w-1.5 h-10 rounded-full shadow-inner ${item.status === 'draft' ? 'bg-slate-200' : 'bg-brand-500 shadow-brand-200'}`}></div>
                        <span className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate max-w-xs block tracking-tight">
                          {item.topik || item.mata_pelajaran}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black uppercase text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        {item.mata_pelajaran}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-xl font-black text-slate-900 tracking-tighter">{item.jumlah_soal} <span className="text-[10px] text-slate-300 uppercase ml-1">ITEM</span></span>
                    </td>
                    <td className="px-8 py-6 text-center text-[13px] font-bold text-slate-400">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                        item.status === 'draft' ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                        <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2 border-slate-100 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 shadow-sm transition-all">
                          <Link to={`/soal/edit/${item.id}`} title="Edit Soal">
                            <Edit className="w-4 h-4" strokeWidth={2.5} />
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="h-10 w-10 rounded-xl border-2 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm transition-all">
                          <Link to={`/soal/preview/${item.id}`} title="Preview & Download">
                            <FileDown className="w-4 h-4" strokeWidth={2.5} />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="h-10 w-10 rounded-xl border-2 border-slate-100 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 shadow-sm transition-all disabled:opacity-50"
                          title="Hapus"
                        >
                          {deletingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" strokeWidth={2.5} /> }
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 border-t-2 border-slate-50 bg-slate-50/30 flex items-center justify-center">
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">Arsip Digital Terverifikasi &bull; {filtered.length} Entri</p>
          </div>
        </Card>
      )}
    </div>
  )
}
