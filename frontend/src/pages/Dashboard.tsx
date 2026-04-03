import { Link } from 'react-router-dom';
import { FilePlus, FileText, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'Total Modul', value: '12', icon: FileText, color: 'text-blue-600 bg-blue-100' },
    { name: 'Soal Di-generate', value: '248', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
    { name: 'Draft Tersimpan', value: '3', icon: FilePlus, color: 'text-orange-600 bg-orange-100' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Selamat Datang, Guru! 👋</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Pilih aksi di bawah ini untuk mulai membuat soal secara otomatis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center gap-4">
            <div className={`p-4 rounded-lg ${stat.color} dark:bg-opacity-20`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Modul Terbaru</h2>
          <Link to="/soal/generate" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">Buat Baru &rarr;</Link>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Modul Matematika - Aljabar Kelas 7</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Diupdate 2 hari yang lalu</p>
                </div>
              </div>
              <Link to={`/soal/edit/${i}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                Lihat Soal
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
