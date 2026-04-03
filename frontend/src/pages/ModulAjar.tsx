import { Upload, FileText, Search, MoreVertical, Trash2, ExternalLink, Filter } from 'lucide-react';

export default function ModulAjar() {
  const modules = [
    { id: 1, name: 'Modul Matematika Kls 7 - Aljabar', type: 'PDF', size: '2.4 MB', date: '04 Apr 2026', color: 'brand' },
    { id: 2, name: 'Fisika Kls 10 - Gerak Lurus', type: 'DOCX', size: '1.1 MB', date: '02 Apr 2026', color: 'orange' },
    { id: 3, name: 'Biologi - Sel & Genetika', type: 'PDF', size: '4.5 MB', date: '30 Mar 2026', color: 'green' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Modul Ajar</h1>
          <p className="text-gray-500 mt-2 font-medium">Kelola berkas modul sebagai sumber materi ekstraksi AI.</p>
        </div>
        <button className="flex items-center gap-2.5 px-6 py-3 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 transition-all shadow-md active:scale-95">
          <Upload className="w-4 h-4" /> Upload Modul
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari modul berdasarkan nama..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">Nama Modul</th>
                <th className="px-8 py-5">Format</th>
                <th className="px-8 py-5">Ukuran</th>
                <th className="px-8 py-5">Tanggal Upload</th>
                <th className="px-8 py-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {modules.map((mod) => (
                <tr key={mod.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl shadow-inner ${
                        mod.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 group-hover:text-brand-600 transition-colors">{mod.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black px-2 py-1 bg-gray-100 text-gray-500 rounded-md tracking-wider">{mod.type}</span>
                  </td>
                  <td className="px-8 py-5 text-sm font-semibold text-gray-500">{mod.size}</td>
                  <td className="px-8 py-5 text-sm font-semibold text-gray-500">{mod.date}</td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-400 hover:text-brand-500 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all"><ExternalLink className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all"><Trash2 className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-gray-900 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
