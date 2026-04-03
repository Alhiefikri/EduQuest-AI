import { FileCheck, LayoutTemplate, Plus, MoreHorizontal, ChevronRight, Info } from 'lucide-react';

export default function TemplateWord() {
  const templates = [
    { id: 1, name: 'Template Standar Sekolah', isDefault: true, date: '01 Apr 2026' },
    { id: 2, name: 'Template Ujian Akhir Semester', isDefault: false, date: '28 Mar 2026' },
    { id: 3, name: 'Kop Surat Yayasan Pendidikan', isDefault: false, date: '15 Mar 2026' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Template Word</h1>
          <p className="text-gray-500 mt-2 font-medium">Sesuaikan tampilan output soal dengan template .docx kustom Anda.</p>
        </div>
        <button className="flex items-center gap-2.5 px-6 py-3 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 transition-all shadow-md active:scale-95">
          <Plus className="w-4 h-4" /> Upload Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-brand-200 transition-all relative group cursor-default">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-brand-50 p-4 rounded-2xl text-brand-500 shadow-inner group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <LayoutTemplate className="w-7 h-7" />
              </div>
              {tpl.isDefault && (
                <span className="bg-green-50 text-green-700 text-[10px] font-black px-3 py-1 rounded-lg border border-green-100 tracking-widest uppercase">Default</span>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">{tpl.name}</h3>
            <p className="text-sm font-medium text-gray-400 mb-8">Ditambahkan pada {tpl.date}</p>
            
            <div className="flex items-center gap-2 mt-auto">
              <button className="flex-1 bg-gray-50 text-gray-700 text-xs font-black uppercase tracking-widest py-3 rounded-xl hover:bg-gray-100 transition-all active:scale-95">
                Pratinjau
              </button>
              <button className="p-3 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-xl transition-all"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button className="border-2 border-dashed border-gray-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-4 hover:border-brand-200 hover:bg-brand-50/10 transition-all group min-h-[220px]">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors shadow-inner">
            <Plus className="w-8 h-8" strokeWidth={3} />
          </div>
          <span className="text-xs font-black text-gray-400 group-hover:text-brand-600 uppercase tracking-[0.2em] transition-colors">Upload Baru</span>
        </button>
      </div>

      <div className="bg-brand-900 rounded-3xl p-8 flex gap-6 items-start shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-800 rounded-full -mr-16 -mt-16 opacity-40 blur-2xl"></div>
        <div className="bg-brand-800/50 p-3.5 rounded-2xl shadow-inner shrink-0 mt-0.5 border border-brand-700">
          <Info className="w-6 h-6 text-brand-300" />
        </div>
        <div>
          <h4 className="text-sm font-black text-brand-400 uppercase tracking-widest mb-3">Panduan Integrasi Template</h4>
          <p className="text-base text-brand-50 font-medium leading-relaxed max-w-3xl opacity-90">
            Sistem kami mendukung injeksi variabel dinamis. Gunakan tag berikut di file Word Anda: <br/>
            <code className="bg-brand-800/80 px-2 py-0.5 rounded text-white mr-2">{"{{JUDUL}}"}</code> 
            <code className="bg-brand-800/80 px-2 py-0.5 rounded text-white mr-2">{"{{SOAL}}"}</code> 
            <code className="bg-brand-800/80 px-2 py-0.5 rounded text-white">{"{{KUNCI}}"}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
