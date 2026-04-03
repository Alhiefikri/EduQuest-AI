import { Save, FileCheck, ArrowLeft, Plus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function EditSoal() {
  const { id } = useParams();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/soal" className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Soal #{id}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Modul Matematika - Sistem Persamaan Linear</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm transition">
            <Save className="w-4 h-4" /> Simpan Draft
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition">
            <FileCheck className="w-4 h-4" /> Selesai & Preview
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-6">
        {/* Soal Item */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded">Soal 1</span>
            <button className="text-red-500 hover:text-red-600 text-sm font-medium">Hapus</button>
          </div>
          <textarea 
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none"
            defaultValue="Tentukan nilai x dan y dari sistem persamaan berikut: \n2x + 3y = 12 \nx - y = 1"
          />
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Kunci Jawaban</label>
              <input type="text" defaultValue="x = 3, y = 2" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">Pembahasan Singkat</label>
              <textarea defaultValue="Dari persamaan (2) didapat x = y + 1. Substitusi ke persamaan (1) menjadi 2(y+1) + 3y = 12 => 5y = 10 => y = 2. Maka x = 3." className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        <button className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 hover:border-blue-500 flex items-center justify-center gap-2 transition">
          <Plus className="w-5 h-5" /> Tambah Soal Manual
        </button>
      </div>
    </div>
  );
}
