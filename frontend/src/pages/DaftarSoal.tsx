import { FileText, Search, Plus, Filter, Download, Edit, Trash2, ChevronRight, AlertCircle, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSoalList } from '../hooks/useSoal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DaftarSoal() {
  const { data: soalList, isLoading, error, refetch } = useSoalList()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-in fade-in">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" strokeWidth={2.5} />
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Memuat Bank Soal...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Bank Soal AI</h1>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest border-l-2 border-brand-500 pl-3 leading-none">
            Manajemen & Distribusi Evaluasi
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
            <Input 
              placeholder="Cari soal..." 
              className="pl-9 h-10 w-full sm:w-[260px] bg-white border-slate-200 rounded-lg text-sm font-bold focus-visible:ring-brand-500/10 placeholder:text-slate-400"
            />
          </div>
          <Button asChild size="sm" className="h-10 px-5 rounded-lg bg-slate-900 text-xs font-black uppercase tracking-widest text-white hover:translate-y-[-1px] transition-all shadow-sm">
            <Link to="/soal/generate">
              <Plus className="w-4 h-4 mr-2" strokeWidth={3} />
              Generate Baru
            </Link>
          </Button>
        </div>
      </div>

      {error ? (
        <Card className="border-rose-100 bg-rose-50/30 rounded-xl overflow-hidden">
          <CardContent className="p-12 text-center flex flex-col items-center">
            <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
            <p className="text-xs font-black text-rose-700 uppercase tracking-widest">Gagal mengambil data: {(error as any).message}</p>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4 border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest">Coba Lagi</Button>
          </CardContent>
        </Card>
      ) : !soalList || soalList.length === 0 ? (
        <Card className="border border-slate-200 border-dashed rounded-xl bg-slate-50/20">
          <CardContent className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Belum ada bank soal tersimpan</p>
            <Button asChild className="rounded-lg px-8 bg-slate-900 text-white font-black uppercase text-xs tracking-[0.2em] shadow-lg">
              <Link to="/soal/generate">Mulai Generate Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-5 py-3.5 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Detail Dokumen</th>
                <th className="px-5 py-3.5 text-left text-xs font-black text-slate-600 uppercase tracking-widest hidden md:table-cell">Materi</th>
                <th className="px-5 py-3.5 text-left text-xs font-black text-slate-600 uppercase tracking-widest">Status</th>
                <th className="px-5 py-3.5 text-right text-xs font-black text-slate-600 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {soalList.map((soal) => (
                <tr key={soal.id} className="group hover:bg-slate-50/50 transition-all duration-200">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 shrink-0 border border-indigo-100 shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight truncate leading-tight group-hover:text-brand-600 transition-colors uppercase">{soal.mata_pelajaran}</p>
                        <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wide truncate">
                          {soal.topik || 'Umum'} &bull; {soal.jumlah_soal} Butir Soal
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{soal.tipe_soal}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs h-5 px-2 border-slate-200 text-slate-700 font-black uppercase tracking-tighter bg-white shadow-sm">
                          {soal.difficulty}
                        </Badge>
                        <span className="text-xs font-black text-slate-400">&bull;</span>
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{soal.fase || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {soal.status === 'draft' ? (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">Draft</Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">Final</Badge>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button asChild variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-brand-50 hover:text-brand-600 text-slate-600 transition-all border border-transparent hover:border-brand-100 active:scale-95 shadow-none">
                        <Link to={`/soal/edit/${soal.id}`}>
                          <Edit className="w-4.5 h-4.5" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-brand-50 hover:text-brand-600 text-slate-600 transition-all border border-transparent hover:border-brand-100 active:scale-95 shadow-none">
                        <Link to={`/soal/preview/${soal.id}`}>
                          <Download className="w-4.5 h-4.5" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-9 h-9 rounded-lg hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-all border border-transparent hover:border-rose-100 active:scale-95 shadow-none"
                        onClick={() => {/* TODO: Implement Delete */}}
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Total {soalList.length} Bank Soal Tersertifikasi AI</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled className="h-9 px-4 text-xs font-black uppercase tracking-widest rounded-lg border-slate-200 bg-white">Prev</Button>
              <Button variant="outline" size="sm" disabled className="h-9 px-4 text-xs font-black uppercase tracking-widest rounded-lg border-slate-200 bg-white">Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
