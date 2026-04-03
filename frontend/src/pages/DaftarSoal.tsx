import { Link } from 'react-router-dom';
import { Search, Filter, Edit, FileDown, Trash } from 'lucide-react';

export default function DaftarSoal() {
  const dummyData = [
    { id: 1, judul: 'Soal Sistem Persamaan Linear', mapel: 'Matematika', tanggal: '04 Apr 2026', jumlah: 15, status: 'Completed' },
    { id: 2, judul: 'Ujian Tengah Semester - Biologi', mapel: 'Biologi', tanggal: '02 Apr 2026', jumlah: 40, status: 'Completed' },
    { id: 3, judul: 'Latihan Soal PPKN Bab 3', mapel: 'PPKN', tanggal: '30 Mar 2026', jumlah: 10, status: 'Draft' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daftar Soal</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Kumpulan bank soal yang telah Anda generate.</p>
        </div>
        <Link to="/soal/generate" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
          + Buat Baru
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari judul soal..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                <th className="px-6 py-4">Judul Soal</th>
                <th className="px-6 py-4">Mata Pelajaran</th>
                <th className="px-6 py-4">Jumlah</th>
                <th className="px-6 py-4">Tanggal dibuat</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dummyData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.judul}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.mapel}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.jumlah} butir</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{item.tanggal}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/soal/edit/${item.id}`} className="p-2 text-gray-400 hover:text-blue-600 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition" title="Edit Soal">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link to={`/soal/preview/${item.id}`} className="p-2 text-gray-400 hover:text-green-600 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-700 transition" title="Preview Word">
                        <FileDown className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-red-600 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-gray-700 transition" title="Hapus">
                        <Trash className="w-4 h-4" />
                      </button>
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
