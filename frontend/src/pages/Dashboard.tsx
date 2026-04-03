import { Upload, Zap, FileText, BookOpen, LayoutTemplate, FlaskConical, PenTool, ArrowRight, Folder, Lightbulb, Clock, MoreHorizontal, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="space-y-10 animate-in fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 mt-2 text-base font-medium">Elevating education through cognitive intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2.5 px-5 py-3 bg-white border border-gray-200 shadow-xs text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95">
            <Upload className="w-4 h-4 text-brand-500" strokeWidth={2.5}/> 
            Upload Modul
          </button>
          <Link to="/soal/generate" className="flex items-center gap-2.5 px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
            <Zap className="w-4 h-4" fill="currentColor" strokeWidth={0} /> 
            Generate Soal
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'TOTAL SOAL', value: '15', icon: FileText, color: 'brand', trend: '+12%', sub: 'vs last month' },
          { label: 'MODUL AJAR', value: '8', icon: BookOpen, color: 'orange', sub: 'Aktif di 3 workspace' },
          { label: 'TEMPLATE WORD', value: '3', icon: LayoutTemplate, color: 'gray', sub: 'Sistem rapor terintegrasi' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                stat.color === 'brand' ? 'bg-brand-50 text-brand-500' : 
                stat.color === 'orange' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.trend && (
                <span className="flex items-center text-[13px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
                  <ArrowRight className="w-3.5 h-3.5 -rotate-45 mr-0.5" /> {stat.trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 tracking-[0.15em] uppercase mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900 leading-none">{stat.value}</p>
                <p className="text-[13px] font-semibold text-gray-500">{stat.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Soal Terakhir */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-500" />
              Soal Terakhir
            </h2>
            <Link to="/soal" className="text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">Lihat Semua</Link>
          </div>
          
          <div className="space-y-4">
            {[
              { title: 'Ujian Akhir Semester Fisika Dasar', time: '2 jam yang lalu', status: 'DRAFT', icon: FlaskConical, color: 'brand' },
              { title: 'Kuis Harian Biologi Sel & Genetika', time: '1 hari yang lalu', status: 'FINAL', icon: PenTool, color: 'orange' },
              { title: 'Latihan Matematika: Aljabar Linear', time: '3 hari yang lalu', status: 'FINAL', icon: FileText, color: 'gray' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-brand-200 transition-all group cursor-pointer">
                <div className={`p-3.5 rounded-xl shrink-0 transition-colors ${
                  item.color === 'brand' ? 'bg-brand-50 text-brand-500 group-hover:bg-brand-500 group-hover:text-white' : 
                  item.color === 'orange' ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white' : 
                  'bg-gray-50 text-gray-600 group-hover:bg-gray-900 group-hover:text-white'
                }`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 leading-tight truncate">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[13px] font-medium text-gray-400">{item.time}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md tracking-wider ${
                      item.status === 'DRAFT' ? 'bg-gray-100 text-gray-500' : 'bg-brand-50 text-brand-600'
                    }`}>{item.status}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Modul Ajar Terbaru */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Folder className="w-5 h-5 text-orange-500" />
              Modul Ajar Terbaru
            </h2>
            <Link to="/modul" className="text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">Kelola Modul</Link>
          </div>
          
          <div className="grid grid-cols-1 gap-5">
            {[
              { title: 'Matematika: Diferensial & Integral', tag: 'Kurikulum Merdeka', color: 'brand', date: '15 Okt 2023' },
              { title: 'Sastra Indonesia: Struktur Bahasa', tag: 'Peminatan', color: 'green', date: '12 Okt 2023' },
            ].map((mod, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider uppercase ${
                    mod.color === 'brand' ? 'bg-brand-50 text-brand-600' : 'bg-green-50 text-green-700'
                  }`}>{mod.tag}</span>
                  <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-brand-500 transition-colors">{mod.title}</h3>
                <p className="text-[13px] font-medium text-gray-400 mt-2 mb-6">Terakhir diupdate: {mod.date}</p>
                
                <div className="flex items-center gap-3 mt-auto relative z-10">
                  <button className="flex-1 bg-brand-500 hover:bg-brand-600 text-white flex justify-center items-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
                    <Zap className="w-4 h-4" fill="currentColor" strokeWidth={0} /> Generate Soal
                  </button>
                  <button className="px-5 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95">
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* AI Insight Card */}
      <div className="bg-brand-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-800 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-700 rounded-full -ml-16 -mb-16 opacity-30 blur-2xl"></div>
        
        <div className="bg-brand-800/50 p-5 rounded-2xl shadow-inner shrink-0 relative z-10">
          <Lightbulb className="w-8 h-8 text-brand-300 animate-pulse" />
        </div>
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-3">AI Insight: Optimal Performance</h2>
          <p className="text-brand-200 text-base leading-relaxed mb-6 max-w-2xl font-medium">
            Berdasarkan modul ajar matematika terbaru Anda, AI menyarankan pembuatan <strong className="text-white font-bold">+3 set soal</strong> dengan tingkat kesulitan HOTS untuk meningkatkan daya kritis siswa.
          </p>
          <button className="bg-white text-brand-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-50 transition-all flex items-center gap-2 mx-auto md:mx-0 shadow-lg active:scale-95">
            Mulai Generator Rekomendasi <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
