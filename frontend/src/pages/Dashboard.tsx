import { Upload, Zap, FileText, BookOpen, LayoutTemplate, ArrowRight, Folder, Lightbulb, Clock, ChevronRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDocuments } from '../hooks/useDocuments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
  const { documents, loading, error, refetch } = useDocuments()

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Dashboard Overview</h1>
          <p className="text-xs font-bold text-slate-600 uppercase tracking-widest border-l-2 border-brand-500 pl-3 leading-none">
            Manajemen Modul & Evaluasi AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-10 px-5 rounded-lg font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 shadow-sm text-xs"
          >
            <Link to="/modul">
              <Upload className="w-4 h-4 mr-2" />
              Upload Modul
            </Link>
          </Button>
          <Button asChild size="sm" className="h-10 px-5 rounded-lg font-black uppercase tracking-widest bg-slate-900 text-white shadow-sm hover:translate-y-[-1px] transition-all text-xs">
            <Link to="/soal/generate">
              <Zap className="w-4 h-4 mr-2" fill="currentColor" strokeWidth={0} />
              Generate Soal
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'TOTAL DOKUMEN', value: loading ? '...' : String(documents.length), icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: `${documents.reduce((sum, d) => sum + d.word_count, 0).toLocaleString('id-ID')} kata` },
          { label: 'FILE MODUL', value: loading ? '...' : String(documents.filter(d => d.filetype === 'pdf').length), icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'PDF Ajar' },
          { label: 'EXPORT WORD', value: loading ? '...' : String(documents.filter(d => d.filetype === 'docx').length), icon: LayoutTemplate, color: 'text-sky-600', bg: 'bg-sky-50', sub: 'Format DOCX' },
        ].map((stat, i) => (
          <Card key={i} className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden group bg-white">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black text-slate-600 uppercase tracking-widest">{stat.label}</CardTitle>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color} transition-transform group-hover:scale-105 border border-slate-100 shadow-sm`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent className="pb-5">
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              <p className="text-xs font-black text-slate-600 mt-1 uppercase tracking-widest">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column: Dokumen Terbaru (60% width) */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-500" />
              Dokumen Terbaru
            </h2>
            <Link to="/modul" className="text-xs font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest hover:underline">Semua &rarr;</Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <Card className="border border-rose-100 bg-rose-50/30 rounded-xl overflow-hidden">
              <CardContent className="p-10 text-center flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
                <p className="text-xs font-black text-rose-700 uppercase tracking-widest">{error}</p>
                <Button onClick={refetch} variant="outline" size="sm" className="mt-4 border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest">Coba Lagi</Button>
              </CardContent>
            </Card>
          ) : documents.length === 0 ? (
            <Card className="border border-slate-200 border-dashed rounded-xl bg-slate-50/20">
              <CardContent className="p-12 text-center flex flex-col items-center">
                <Folder className="w-12 h-12 text-slate-400 mb-4" />
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-6">Belum ada dokumen yang diunggah</p>
                <Button asChild size="sm" className="rounded-lg px-8 bg-slate-900 text-white font-black uppercase text-xs tracking-widest shadow-lg">
                  <Link to="/modul">Upload Sekarang</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {documents.slice(0, 4).map((doc) => (
                <Card key={doc.id} className="border border-slate-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all duration-200 group cursor-pointer rounded-xl bg-white">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`p-3 rounded-lg shrink-0 transition-colors border shadow-sm ${
                      doc.filetype === 'pdf' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-sky-50 text-sky-600 border-sky-100'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-black text-slate-900 leading-tight truncate group-hover:text-brand-600 transition-colors uppercase tracking-tight">{doc.filename}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                          {doc.page_count} Hal &bull; {doc.word_count.toLocaleString('id-ID')} Kata
                        </span>
                        <span className={`text-xs font-black px-2 py-0.5 rounded border uppercase tracking-widest ${
                          doc.filetype === 'pdf' ? 'bg-white border-rose-100 text-rose-600' : 'bg-white border-sky-100 text-sky-600'
                        }`}>{doc.filetype}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: AI Suggestion & Insight (40% width) */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              AI Insight
            </h2>
          </div>

          <Card className="bg-slate-900 border-none shadow-xl rounded-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500 rounded-full -mr-16 -mt-16 opacity-30 blur-[60px]"></div>
            <CardContent className="p-7 relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                  <Lightbulb className="w-5 h-5 text-brand-400" />
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Optimal Performance</h3>
              </div>
              <p className="text-xs text-slate-100 leading-relaxed font-black uppercase tracking-widest">
                Berdasarkan modul terbaru, AI menyarankan pembuatan <span className="text-brand-400 font-black">+3 set soal</span> tingkat kesulitan <span className="text-white underline decoration-emerald-400 decoration-2 underline-offset-4">HOTS</span> untuk evaluasi kritis.
              </p>
              <Button asChild size="sm" className="w-full h-10 rounded-lg bg-white text-slate-950 hover:bg-brand-50 font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all">
                <Link to="/soal/generate">
                  Proses AI Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 border border-slate-200 rounded-xl bg-white shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-colors cursor-pointer group">
             <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm group-hover:scale-105 transition-transform">
                <LayoutTemplate className="w-6 h-6 text-emerald-600" />
             </div>
             <div>
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest leading-none mb-1.5">Template Aktif</p>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Standar Akademik K13</p>
             </div>
          </div>
        </section>
      </div>
    </div>
  )
}
