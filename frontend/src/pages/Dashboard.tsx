import { Upload, Zap, FileText, BookOpen, LayoutTemplate, ArrowRight, Folder, Lightbulb, Clock, ChevronRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDocuments } from '../hooks/useDocuments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Dashboard() {
  const { documents, loading, error, refetch } = useDocuments()

  return (
    <div className="space-y-12 animate-in fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-2">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">Dashboard</h1>
          <p className="text-lg font-medium text-slate-500 max-w-xl">Kelola modul ajar dan generate soal evaluasi dengan cerdas menggunakan bantuan AI.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-6 rounded-xl font-bold border-2 border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Link to="/modul">
              <Upload className="w-5 h-5 mr-2" strokeWidth={2.5} />
              Upload Modul
            </Link>
          </Button>
          <Button asChild size="lg" className="h-12 px-6 rounded-xl font-bold bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-200 transition-all hover:translate-y-[-1px]">
            <Link to="/soal/generate">
              <Zap className="w-5 h-5 mr-2" fill="currentColor" strokeWidth={0} />
              Generate Soal
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'TOTAL DOKUMEN', value: loading ? '...' : String(documents.length), icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: `${documents.reduce((sum, d) => sum + d.word_count, 0).toLocaleString('id-ID')} kata total` },
          { label: 'MODUL AJAR', value: loading ? '...' : String(documents.filter(d => d.filetype === 'pdf').length), icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'File PDF terupload' },
          { label: 'FILE WORD', value: loading ? '...' : String(documents.filter(d => d.filetype === 'docx').length), icon: LayoutTemplate, color: 'text-sky-600', bg: 'bg-sky-50', sub: 'File DOCX terupload' },
        ].map((stat, i) => (
          <Card key={i} className="border-2 border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</CardTitle>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <p className="text-5xl font-black text-slate-900">{stat.value}</p>
              </div>
              <p className="text-[13px] font-bold text-slate-500 mt-2 uppercase tracking-wide">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Dokumen Terbaru */}
        <section className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Clock className="w-6 h-6 text-brand-500" strokeWidth={2.5} />
              Dokumen Terbaru
            </h2>
            <Link to="/modul" className="text-sm font-bold text-brand-600 hover:text-brand-700 underline underline-offset-4 decoration-2">Kelola Semua</Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-slate-50 border-2 border-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <Card className="border-2 border-rose-100 bg-rose-50/30 rounded-2xl overflow-hidden">
              <CardContent className="p-10 text-center flex flex-col items-center">
                <AlertCircle className="w-12 h-12 text-rose-400 mb-4" strokeWidth={2} />
                <p className="text-lg font-bold text-rose-700">{error}</p>
                <Button onClick={refetch} variant="outline" className="mt-6 border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl">Coba Lagi</Button>
              </CardContent>
            </Card>
          ) : documents.length === 0 ? (
            <Card className="border-2 border-slate-100 border-dashed rounded-2xl bg-slate-50/50">
              <CardContent className="p-12 text-center flex flex-col items-center">
                <Folder className="w-12 h-12 text-slate-300 mb-4" strokeWidth={2} />
                <p className="text-xl font-bold text-slate-900 mb-2">Belum ada dokumen</p>
                <p className="text-slate-500 mb-8 max-w-[240px]">Mulai dengan mengupload modul ajar pertama Anda.</p>
                <Button asChild className="rounded-xl px-8 bg-brand-600 shadow-md">
                  <Link to="/modul">Upload Sekarang</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {documents.slice(0, 5).map((doc) => (
                <Card key={doc.id} className="border-2 border-slate-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all duration-200 group cursor-pointer rounded-2xl">
                  <CardContent className="p-5 flex items-center gap-5">
                    <div className={`p-4 rounded-xl shrink-0 transition-colors ${
                      doc.filetype === 'pdf' ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-sky-600'
                    }`}>
                      <FileText className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight truncate group-hover:text-brand-600 transition-colors">{doc.filename}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-semibold text-slate-400">
                          {doc.page_count} hal &bull; {doc.word_count.toLocaleString('id-ID')} kata
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border tracking-wider uppercase ${
                          doc.filetype === 'pdf' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-sky-50 border-sky-100 text-sky-600'
                        }`}>{doc.filetype}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" strokeWidth={3} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Statistik Dokumen */}
        <section className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <Folder className="w-6 h-6 text-amber-500" strokeWidth={2.5} />
              Statistik Dokumen
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 bg-slate-50 border-2 border-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <Card className="border-2 border-slate-100 border-dashed rounded-2xl bg-slate-50/50 h-[400px] flex items-center justify-center">
              <CardContent className="p-10 text-center flex flex-col items-center">
                <BookOpen className="w-12 h-12 text-slate-300 mb-4" strokeWidth={2} />
                <p className="text-lg font-bold text-slate-400">Data modul kosong</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {documents.slice(0, 4).map((doc) => (
                <Card key={doc.id} className="border-2 border-slate-100 shadow-sm rounded-2xl overflow-hidden group hover:border-brand-100">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${
                        doc.filetype === 'pdf' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-sky-50 border-sky-100 text-sky-600'
                      }`}>{doc.filetype}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 truncate group-hover:text-brand-600 transition-colors">{doc.filename}</h3>
                    <p className="text-sm font-semibold text-slate-400 mb-6">
                      {doc.page_count} hal &bull; {doc.word_count.toLocaleString('id-ID')} kata &bull; {(doc.filesize / 1024 / 1024).toFixed(1)} MB
                    </p>
                    <Button asChild variant="outline" className="w-full mt-auto border-2 border-slate-200 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 font-bold rounded-xl transition-all h-11">
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
      <Card className="bg-slate-900 border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative mt-16 group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 rounded-full -mr-32 -mt-32 opacity-20 blur-[100px] group-hover:opacity-30 transition-opacity"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full -ml-24 -mb-24 opacity-10 blur-[80px]"></div>
        <CardContent className="p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-sm border border-white/10 shadow-inner shrink-0 transform transition-transform group-hover:scale-105 duration-500">
            <Lightbulb className="w-16 h-16 text-brand-400 animate-pulse-slow" strokeWidth={2} />
          </div>
          <div className="text-center md:text-left flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">AI Insight: Optimal Performance</h2>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium max-w-3xl">
              Berdasarkan modul ajar terbaru Anda, AI menyarankan pembuatan <strong className="text-white bg-brand-600 px-3 py-1 rounded-lg">+3 set soal</strong> dengan tingkat kesulitan <strong className="text-white underline underline-offset-4 decoration-emerald-400">HOTS</strong> untuk meningkatkan daya kritis siswa secara signifikan.
            </p>
            <div className="pt-4">
              <Button asChild size="lg" className="h-14 px-10 rounded-2xl bg-white text-slate-950 hover:bg-brand-50 font-black uppercase tracking-widest text-base shadow-xl active:scale-95 transition-all">
                <Link to="/soal/generate">
                  Mulai Generator <ArrowRight className="w-5 h-5 ml-3" strokeWidth={3} />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
