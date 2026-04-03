import { ArrowLeft, Download, FileText, ChevronRight, Share2, Printer } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function PreviewWord() {
  const { id } = useParams();

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 pb-20 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/soal" className="group flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-brand-500 hover:border-brand-200 hover:shadow-sm transition-all active:scale-95">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pratinjau Dokumen</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">ID Generasi: #{id} • Siap untuk diunduh</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-gray-900 transition-all shadow-xs"><Printer className="w-5 h-5" /></button>
          <button className="p-2.5 bg-white border border-gray-200 text-gray-500 rounded-xl hover:text-gray-900 transition-all shadow-xs"><Share2 className="w-5 h-5" /></button>
          <button className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-bold text-sm hover:bg-brand-600 transition-all shadow-md active:scale-95">
            <Download className="w-4 h-4" /> Unduh DOCX (Full)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Preview Container */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 min-h-[800px] relative overflow-hidden group">
            {/* Decorative Document Mock */}
            <div className="absolute inset-x-12 top-12 bottom-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-6 group-hover:bg-brand-50/20 group-hover:border-brand-100 transition-all">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-md flex items-center justify-center text-brand-500">
                <FileText className="w-10 h-10" />
              </div>
              <div className="text-center max-w-sm space-y-2">
                <h3 className="text-lg font-bold text-gray-900">Virtual Preview Active</h3>
                <p className="text-sm font-medium text-gray-400 leading-relaxed">
                  EduQuest AI menggunakan engine `python-docx` di sisi server. Preview realtime terbatas pada metadata. Silakan unduh untuk melihat format kop surat & styling penuh.
                </p>
              </div>
              <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                Lihat Struktur JSON
              </button>
            </div>
          </div>
        </div>

        {/* Info & Config Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-8">
            <div>
              <h3 className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-4">Metadata Dokumen</h3>
              <div className="space-y-4">
                {[
                  { label: 'Template', value: 'Kop Surat Standar' },
                  { label: 'Ukuran File', value: '156 KB' },
                  { label: 'Total Karakter', value: '12,450' },
                  { label: 'Mata Pelajaran', value: 'Matematika' }
                ].map((meta, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-xs font-bold text-gray-500">{meta.label}</span>
                    <span className="text-xs font-black text-gray-900">{meta.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-6">Konfigurasi Output</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Halaman Kunci Jawaban', active: true },
                   { label: 'Halaman Pembahasan', active: true },
                   { label: 'Nomor Halaman', active: true },
                   { label: 'Gridline Bantu', active: false },
                 ].map((opt, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                     <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">{opt.label}</span>
                     <div className={`w-10 h-5 rounded-full relative transition-colors ${opt.active ? 'bg-brand-500' : 'bg-gray-200'}`}>
                       <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${opt.active ? 'right-0.5' : 'left-0.5'}`}></div>
                     </div>
                   </div>
                 ))}
              </div>
            </div>

            <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-gray-800 transition-all shadow-lg active:scale-95">
              Sync ke Google Drive
            </button>
          </div>

          <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 flex gap-4">
            <Info className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-[12px] font-bold text-orange-800 leading-relaxed">
              Pastikan Anda telah memeriksa kunci jawaban di tahap Editor sebelum melakukan export final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
