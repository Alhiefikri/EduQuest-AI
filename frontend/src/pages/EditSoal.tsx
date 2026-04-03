import { Save, FileCheck, ArrowLeft, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function EditSoal() {
  const { id } = useParams();

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-20 animate-in fade-in">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/soal" className="group flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-brand-500 hover:border-brand-200 hover:shadow-sm transition-all active:scale-95">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Editor Bank Soal</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">ID Generasi: #{id} • Modul Matematika Aljabar</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-xs active:scale-95">
            <Save className="w-4 h-4" /> Simpan Draft
          </button>
          <Link to={`/soal/preview/${id}`} className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 transition-all shadow-md active:scale-95">
            <FileCheck className="w-4 h-4" /> Selesai & Preview
          </Link>
        </div>
      </div>

      {/* Editor Main Area */}
      <div className="space-y-6">
        {/* Soal Item Card */}
        {[1].map((num) => (
          <div key={num} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden group hover:border-brand-200 transition-colors">
            <div className="p-2 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
                  <GripVertical className="w-4 h-4" />
                </div>
                <span className="bg-brand-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider uppercase">Butir {num}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Pertanyaan</label>
                <textarea 
                  className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-2xl p-5 text-base font-bold text-gray-900 outline-none transition-all min-h-[120px]"
                  defaultValue="Tentukan nilai x dan y dari sistem persamaan berikut: \n2x + 3y = 12 \nx - y = 1"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                    Kunci Jawaban
                  </label>
                  <input 
                    type="text" 
                    defaultValue="x = 3, y = 2" 
                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none transition-all" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Pembahasan</label>
                  <textarea 
                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 outline-none transition-all min-h-[80px]"
                    defaultValue="Dari persamaan (2) didapat x = y + 1. Substitusi ke persamaan (1) menjadi 2(y+1) + 3y = 12 => 5y = 10 => y = 2. Maka x = 3."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button className="w-full py-8 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold hover:border-brand-200 hover:bg-brand-50/10 hover:text-brand-600 flex flex-col items-center justify-center gap-3 transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
            <Plus className="w-6 h-6" strokeWidth={3} />
          </div>
          <span className="text-sm uppercase tracking-widest font-black">Tambah Butir Soal Manual</span>
        </button>
      </div>

      {/* Sticky Bottom Actions Mock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-lg border border-white/10 px-8 py-4 rounded-3xl shadow-2xl z-30 flex items-center gap-8 animate-in slide-in-from-bottom-8">
        <div className="flex items-center gap-4 border-r border-white/10 pr-8">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Editor Stats</p>
          <p className="text-sm font-bold text-white">20/20 <span className="text-brand-400">Soal Terisi</span></p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 text-xs font-bold text-white hover:text-brand-300 transition-colors">Batal</button>
           <button className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all">
             Simpan Permanen
           </button>
        </div>
      </div>
    </div>
  );
}
