import { LayoutTemplate, Plus, MoreHorizontal, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TemplateWord() {
  const templates = [
    { id: 1, name: 'Template Standar Sekolah', isDefault: true, date: '01 Apr 2026' },
    { id: 2, name: 'Template Ujian Akhir Semester', isDefault: false, date: '28 Mar 2026' },
    { id: 3, name: 'Kop Surat Yayasan Pendidikan', isDefault: false, date: '15 Mar 2026' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b pb-6">
        <div className="space-y-1.5 px-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Template Word</h1>
          <p className="text-xs font-bold text-slate-600 border-l-2 border-brand-500 pl-4 uppercase tracking-widest leading-none">Personalisasi Output Dokumen Evaluasi</p>
        </div>
        <Button
          size="sm"
          className="h-10 px-6 rounded-lg font-black bg-slate-900 border border-slate-950 text-white shadow-xl hover:translate-y-[-1px] transition-all uppercase tracking-widest text-xs"
        >
          <Plus className="w-4 h-4 mr-2.5" strokeWidth={3} /> Upload Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="border border-slate-100 shadow-sm hover:border-brand-200 hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden group bg-white">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-100 shadow-sm group-hover:scale-105 transition-transform">
                  <LayoutTemplate className="w-6 h-6" strokeWidth={2} />
                </div>
                {tpl.isDefault && (
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md shadow-sm">
                    Default
                  </Badge>
                )}
              </div>
              
              <h3 className="text-sm font-black text-slate-900 mb-1 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{tpl.name}</h3>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-8">DIPERBARUI: {tpl.date}</p>
              
              <div className="flex items-center gap-2 mt-auto">
                <Button variant="outline" className="flex-1 h-9 bg-slate-50 border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-100 transition-all active:scale-95 shadow-none">
                  Pratinjau
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100 transition-all active:scale-95">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Card */}
        <button className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-brand-300 hover:bg-brand-50/20 transition-all group min-h-[200px] bg-white/50">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all border border-slate-100 shadow-inner">
            <Plus className="w-7 h-7" strokeWidth={3} />
          </div>
          <span className="text-[10px] font-black text-slate-400 group-hover:text-brand-600 uppercase tracking-[0.2em] transition-colors">Tambah Template Baru</span>
        </button>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500 rounded-full -mr-20 -mt-20 opacity-20 blur-[60px]"></div>
        <div className="bg-brand-500/10 p-3 rounded-xl shadow-inner border border-brand-500/20 shrink-0">
          <Info className="w-5 h-5 text-brand-400" strokeWidth={2.5} />
        </div>
        <div className="relative z-10 space-y-2">
          <h4 className="text-[11px] font-black text-brand-400 uppercase tracking-widest">Panduan Integrasi Template</h4>
          <p className="text-xs text-slate-200 font-bold leading-relaxed max-w-4xl uppercase tracking-wide opacity-90">
            Gunakan variabel dinamis berikut di file Word Anda: 
            <code className="bg-white/10 px-2 py-0.5 rounded text-white mx-1.5 border border-white/10">{"{{JUDUL}}"}</code> 
            <code className="bg-white/10 px-2 py-0.5 rounded text-white mx-1.5 border border-white/10">{"{{SOAL}}"}</code> 
            <code className="bg-white/10 px-2 py-0.5 rounded text-white ml-1.5 border border-white/10">{"{{KUNCI}}"}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
