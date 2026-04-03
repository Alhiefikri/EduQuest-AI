import { ArrowLeft, Book, Info, CheckCircle2, Circle, Settings2, SlidersHorizontal, BrainCircuit, Rocket, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GenerateSoal() {
  return (
    <div className="max-w-[900px] mx-auto space-y-10 pb-20 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/soal" className="group flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-brand-500 hover:border-brand-200 hover:shadow-sm transition-all active:scale-95">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Generate Soal Baru</h1>
              <span className="bg-brand-50 text-brand-600 text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider uppercase border border-brand-100">
                AI Powered
              </span>
            </div>
            <p className="text-sm font-medium text-gray-500 mt-1">Transformasikan modul ajar menjadi bank soal berkualitas.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Step 1: Sumber Materi */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 relative overflow-hidden group hover:border-brand-200 transition-colors">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-50/50 rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-brand-50 p-3 rounded-2xl text-brand-500 shadow-inner">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">1. Sumber Materi</h2>
              <p className="text-sm font-medium text-gray-500">Pilih basis data untuk pembuatan soal.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {/* Selected Radio Card */}
              <div className="border-2 border-brand-500 bg-brand-50/30 p-5 rounded-2xl flex items-start gap-4 cursor-pointer relative shadow-sm">
                <div className="bg-brand-500 p-0.5 rounded-full mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Gunakan Modul Ajar</h3>
                  <p className="text-xs font-semibold text-brand-600 mt-1 uppercase tracking-wide">Direkomendasikan</p>
                </div>
              </div>
              
              {/* Unselected Radio Card */}
              <div className="border border-gray-200 bg-gray-50/50 p-5 rounded-2xl flex items-start gap-4 cursor-pointer hover:bg-white hover:border-brand-200 transition-all">
                <Circle className="w-5 h-5 text-gray-300 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Input Manual</h3>
                  <p className="text-xs font-medium text-gray-400 mt-1">Gunakan deskripsi topik mandiri</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col justify-center">
              <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Pilih Modul dari Library</label>
              <div className="relative">
                <select className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none shadow-xs appearance-none cursor-pointer">
                  <option>Matematika Kls 7 - Aljabar</option>
                  <option>Fisika Kls 10 - Gerak Lurus</option>
                  <option>Biologi Kls 11 - Sel & Genetika</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ChevronRight className="w-4 h-4 rotate-90" />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-5 p-3 bg-white/50 border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <FileText className="w-4 h-4 text-brand-400"/> 15 Halaman
                </div>
                <div className="w-[1px] h-3 bg-gray-200"></div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                  <Settings2 className="w-4 h-4 text-brand-400" /> 4.5k Kata
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Konfigurasi Soal */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-orange-50 p-3 rounded-2xl text-orange-600 shadow-inner">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">2. Konfigurasi Parameter</h2>
              <p className="text-sm font-medium text-gray-500">Tentukan spesifikasi soal yang diinginkan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Mata Pelajaran</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none transition-all" defaultValue="Matematika" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Tipe Soal</label>
                <div className="flex flex-wrap gap-2">
                  {['Pilihan Ganda', 'Isian', 'Essay', 'Campuran'].map((type, i) => (
                    <button key={i} className={`px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-xs ${
                      type === 'Pilihan Ganda' 
                        ? 'bg-brand-500 text-white shadow-md' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-200'
                    }`}>{type}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase">Jumlah Soal</label>
                  <span className="text-brand-600 font-black text-sm">20 <span className="text-gray-400 font-bold uppercase text-[10px]">Butir</span></span>
                </div>
                <input type="range" min="1" max="50" defaultValue="20" className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-500" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Topik Spesifik</label>
                <input type="text" className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none transition-all" defaultValue="Persamaan Linear Satu Variabel" />
              </div>
              <div>
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-3">Tingkat Kesulitan</label>
                <select className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none appearance-none cursor-pointer">
                  <option>Mudah</option>
                  <option selected>Sedang</option>
                  <option>Sulit</option>
                  <option>Campuran (HOTS)</option>
                </select>
              </div>
              <div className="pt-2">
                <label className="block text-[11px] font-black text-gray-400 tracking-widest uppercase mb-4">Opsi Tambahan</label>
                <div className="space-y-4">
                  {[
                    { label: 'Sertakan Pembahasan Lengkap', active: true },
                    { label: 'Halaman Kunci Jawaban', active: true },
                    { label: 'Generate Gambar AI', active: false }
                  ].map((opt, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        opt.active ? 'bg-brand-500 border-brand-500 shadow-sm' : 'border-gray-200 bg-white group-hover:border-brand-300'
                      }`}>
                        {opt.active && <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                      </div>
                      <span className={`text-[13px] font-bold ${opt.active ? 'text-gray-900' : 'text-gray-500'}`}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Logic Preview */}
        <div className="bg-brand-900 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-800 rounded-full -mr-16 -mt-16 opacity-40 blur-2xl"></div>
          <div className="bg-brand-800/50 p-4 rounded-2xl shadow-inner shrink-0 mt-1 border border-brand-700">
            <BrainCircuit className="w-6 h-6 text-brand-300 animate-pulse-slow" />
          </div>
          <div>
            <h3 className="text-sm font-black text-brand-400 uppercase tracking-widest mb-3">Konsep Pemrosesan AI</h3>
            <p className="text-[15px] text-brand-50 font-medium leading-relaxed italic opacity-95">
              "AI akan membedah modul <strong className="text-white border-b border-brand-500">Aljabar Kls 7</strong> untuk mengekstrak kompetensi dasar <strong className="text-white">Persamaan Linear</strong>. Soal akan difokuskan pada penalaran kritis (Sedang) sebanyak <strong className="text-white">20 butir</strong>. Output akan dioptimasi untuk format cetak Word."
            </p>
          </div>
        </div>

        {/* Submit Action */}
        <div className="text-center pt-4">
          <button className="w-full bg-brand-500 hover:bg-brand-600 text-white flex gap-3 justify-center items-center py-5 rounded-2xl font-black text-lg shadow-xl shadow-brand-500/20 transition-all active:scale-[0.98] transform hover:-translate-y-1">
            <Rocket className="w-6 h-6" /> GENERATE BANK SOAL
          </button>
          <p className="text-[11px] text-gray-400 mt-6 font-black uppercase tracking-[0.2em]">
            Processing time: ~25 Seconds • Free Tier Active
          </p>
        </div>
      </div>
    </div>
  );
}
