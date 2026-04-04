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
    <div className="space-y-10 animate-in fade-in pb-12 p-2 md:p-8 max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 px-2">
        <div className="space-y-2 w-full lg:w-auto">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none break-words">Daftar Soal</h1>
          <p className="text-base md:text-lg font-medium text-slate-500 border-l-4 border-brand-500 pl-4 max-w-2xl">Kumpulan bank soal yang telah Anda generate melalui bantuan AI.</p>
        </div>
        <Button asChild size="lg" className="h-14 px-8 w-full sm:w-auto rounded-2xl font-bold bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-200 transition-all hover:translate-y-[-1px] shrink-0">
          <Link to="/soal/generate">
            <Plus className="w-5 h-5 mr-2" strokeWidth={3} /> Buat Baru
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-2 border-slate-100 shadow-sm rounded-[2rem] overflow-hidden">
          <CardContent className="p-10 md:p-20 text-center flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" strokeWidth={3} />
            <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Basis Data...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-2 border-rose-100 bg-rose-50/30 rounded-[2rem] overflow-hidden">
          <CardContent className="p-10 md:p-20 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-rose-400 mb-4" strokeWidth={3} />
            <p className="text-xl font-bold text-rose-700 uppercase tracking-tight">{error instanceof Error ? error.message : 'Gagal memuat data'}</p>
          </CardContent>
        </Card>
      ) : !filtered || filtered.length === 0 ? (
        <Card className="bg-slate-50 border-2 border-slate-100 border-dashed rounded-[2rem] overflow-hidden">
          <CardContent className="p-10 md:p-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-8">
              <FileDown className="w-10 h-10 md:w-12 md:h-12 text-slate-200" strokeWidth={2} />
            </div>
            <p className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight mb-3 text-center">Bank Soal Kosong</p>
            <p className="text-base md:text-lg font-medium text-slate-500 mb-10 border-l-4 border-slate-200 pl-6 max-w-md text-left">Generate soal pertama Anda untuk mulai mengisi library ini.</p>
            <Button asChild size="lg" className="h-14 px-10 rounded-2xl font-bold bg-brand-600 shadow-lg w-full sm:w-auto">
              <Link to="/soal/generate">Generate Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-slate-100 shadow-xl shadow-slate-100 rounded-[2rem] overflow-hidden bg-white max-w-full">
          <div className="p-4 md:p-8 border-b-2 border-slate-50 flex flex-col sm:flex-row gap-6 justify-between items-stretch sm:items-center bg-slate-50/50">
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
            <div className="flex items-center gap-4 shrink-0">
              <Button variant="outline" className="h-14 px-6 flex-1 sm:flex-none rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:bg-white hover:border-slate-200 shadow-sm">
                <Filter className="w-5 h-5 mr-3 text-slate-400" strokeWidth={2.5} /> Filter
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-left border-collapse table-fixed lg:table-auto">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100 text-[10px] md:text-[11px] uppercase text-slate-400 font-black tracking-[0.2em]">
                    <th className="px-6 md:px-10 py-6 min-w-[200px]">Identitas Soal</th>
                    <th className="px-4 md:px-8 py-6 text-center w-32 md:w-48">Kategori</th>
                    <th className="px-4 md:px-8 py-6 text-center w-24 md:w-32">Volume</th>
                    <th className="hidden md:table-cell px-8 py-6 text-center">Kronologi</th>
                    <th className="px-4 md:px-8 py-6 text-center w-28 md:w-36">Status</th>
                    <th className="px-6 md:px-10 py-6 text-right w-40 md:w-56">Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 md:px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-1.5 h-10 rounded-full shadow-inner shrink-0 ${item.status === 'draft' ? 'bg-slate-200' : 'bg-brand-500 shadow-brand-200'}`}></div>
                          <span className="text-base md:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate block tracking-tight" title={item.topik || item.mata_pelajaran}>
                            {item.topik || item.mata_pelajaran}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-8 py-6 text-center">
                        <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2 md:px-3 py-1.5 rounded-lg border border-slate-200 truncate inline-block max-w-full">
                          {item.mata_pelajaran}
                        </span>
                      </td>
                      <td className="px-4 md:px-8 py-6 text-center">
                        <span className="text-lg md:text-xl font-black text-slate-900 tracking-tighter shrink-0">{item.jumlah_soal} <span className="hidden sm:inline text-[10px] text-slate-300 uppercase ml-1">ITEM</span></span>
                      </td>
                      <td className="hidden md:table-cell px-8 py-6 text-center text-[13px] font-bold text-slate-400">
                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 md:px-8 py-6 text-center">
                        <span className={`inline-flex items-center px-3 md:px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                          item.status === 'draft' ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 md:px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 md:gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all transform lg:translate-x-4 lg:group-hover:translate-x-0">
                          <Button asChild variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10 rounded-xl border-2 border-slate-100 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600 shadow-sm transition-all">
                            <Link to={`/soal/edit/${item.id}`} title="Edit Soal">
                              <Edit className="w-4 h-4" strokeWidth={2.5} />
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10 rounded-xl border-2 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 shadow-sm transition-all">
                            <Link to={`/soal/preview/${item.id}`} title="Preview & Download">
                              <FileDown className="w-4 h-4" strokeWidth={2.5} />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="h-9 w-9 md:h-10 md:w-10 rounded-xl border-2 border-slate-100 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 shadow-sm transition-all disabled:opacity-50"
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
          </div>

          <div className="p-6 md:p-8 border-t-2 border-slate-50 bg-slate-50/30 flex items-center justify-center">
            <p className="text-[10px] md:text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] text-center">Arsip Digital Terverifikasi &bull; {filtered.length} Entri Tersimpan</p>
          </div>
        </Card>
      )}
    </div>
  )
}
