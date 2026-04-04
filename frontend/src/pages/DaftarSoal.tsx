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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-md">Daftar Soal</h1>
          <p className="mt-3 text-lg font-bold border-l-4 border-primary pl-4">Kumpulan bank soal yang telah Anda generate melalui AI.</p>
        </div>
        <Button asChild size="lg" className="border-4 border-black font-black uppercase text-base h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <Link to="/soal/generate">
            <Plus className="w-5 h-5 mr-2" strokeWidth={3} /> Buat Baru
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardContent className="p-16 text-center flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-black animate-spin mb-4" strokeWidth={3} />
            <p className="text-xl font-black uppercase tracking-widest">Memuat daftar soal...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="bg-red-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardContent className="p-16 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-black mb-4" strokeWidth={3} />
            <p className="text-xl font-black uppercase tracking-widest">{error instanceof Error ? error.message : 'Gagal memuat data'}</p>
          </CardContent>
        </Card>
      ) : !filtered || filtered.length === 0 ? (
        <Card className="bg-[#ffc900] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <CardContent className="p-16 text-center flex flex-col items-center">
            <FileDown className="w-16 h-16 text-black mb-6" strokeWidth={2.5} />
            <p className="text-3xl font-black uppercase tracking-tighter mb-2">Belum ada soal</p>
            <p className="text-base font-bold mb-8 border-l-4 border-black pl-4">Generate soal pertama Anda untuk memulai</p>
            <Button asChild size="lg" className="border-4 border-black font-black uppercase text-base h-14 bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <Link to="/soal/generate">Generate Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden bg-white">
          <div className="p-6 border-b-4 border-black flex flex-wrap gap-4 justify-between items-center bg-[#00f0ff]">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={3} />
              <Input
                type="text"
                placeholder="Cari berdasarkan mata pelajaran atau topik..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 h-14 bg-white border-4 border-black rounded-none text-base font-bold placeholder:text-gray-500 placeholder:font-bold focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-4 border-black font-black uppercase h-14 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Filter className="w-5 h-5 mr-2" strokeWidth={3} /> Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b-4 border-black text-sm uppercase text-black font-black tracking-widest">
                  <th className="px-6 py-5 border-r-4 border-black">Judul Soal</th>
                  <th className="px-6 py-5 border-r-4 border-black">Mata Pelajaran</th>
                  <th className="px-6 py-5 border-r-4 border-black text-center">Jumlah</th>
                  <th className="px-6 py-5 border-r-4 border-black text-center">Tanggal Dibuat</th>
                  <th className="px-6 py-5 border-r-4 border-black text-center">Status</th>
                  <th className="px-6 py-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-black">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100 transition-colors group">
                    <td className="px-6 py-5 border-r-4 border-black">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-10 border-2 border-black ${item.status === 'draft' ? 'bg-gray-300' : 'bg-[#ff90e8]'}`}></div>
                        <span className="text-lg font-black text-black group-hover:underline underline-offset-4 truncate max-w-xs block">
                          {item.topik || item.mata_pelajaran}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 border-r-4 border-black">
                      <span className="text-sm font-black uppercase text-black bg-[#ffc900] border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {item.mata_pelajaran}
                      </span>
                    </td>
                    <td className="px-6 py-5 border-r-4 border-black text-center">
                      <span className="text-xl font-black text-black">{item.jumlah_soal}</span>
                    </td>
                    <td className="px-6 py-5 border-r-4 border-black text-center text-sm font-bold text-gray-700">
                      {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5 border-r-4 border-black text-center">
                      <span className={`inline-flex items-center px-3 py-1 border-2 border-black text-[11px] font-black tracking-widest uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        item.status === 'draft' ? 'bg-gray-200 text-black' : 'bg-green-400 text-black'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <Button asChild variant="outline" size="icon" className="border-2 border-black bg-white hover:bg-[#ffc900] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
                          <Link to={`/soal/edit/${item.id}`} title="Edit Soal">
                            <Edit className="w-5 h-5 text-black" strokeWidth={2.5} />
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="icon" className="border-2 border-black bg-white hover:bg-[#00f0ff] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1">
                          <Link to={`/soal/preview/${item.id}`} title="Preview Word">
                            <FileDown className="w-5 h-5 text-black" strokeWidth={2.5} />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="border-2 border-black bg-white hover:bg-red-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1"
                          title="Hapus"
                        >
                          {deletingId === item.id ? <Loader2 className="w-5 h-5 text-black animate-spin" /> : <Trash className="w-5 h-5 text-black" strokeWidth={2.5} /> }
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t-4 border-black bg-gray-100 flex items-center justify-center">
            <p className="text-sm font-black text-black uppercase tracking-widest">Total {filtered.length} Soal Tersimpan</p>
          </div>
        </Card>
      )}
    </div>
  )
}
