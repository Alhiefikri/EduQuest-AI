import { Upload, Settings2, Sparkles } from 'lucide-react';

export default function GenerateSoal() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generate Soal Baru</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Upload modul ajar Anda dalam format PDF atau Word, AI kami akan mengubahnya menjadi butir soal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer">
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upload File Modul</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Seret dan lepas file di sini, atau klik untuk memilih</p>
            <p className="mt-2 text-xs text-gray-400">Mendukung: PDF, DOCX (Max 10MB)</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-gray-400" />
              Pengaturan Generate
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mata Pelajaran</label>
                  <input type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Cth: Matematika" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kelas</label>
                  <input type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Cth: 7 SMP" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tingkat Kesulitan</label>
                  <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <option>HOTS (Tingkat Tinggi)</option>
                    <option>Campuran (Mudah-Sedang-Sulit)</option>
                    <option>MOTS (Tingkat Menengah)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah Soal</label>
                  <input type="number" defaultValue={10} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
            <Sparkles className="w-8 h-8 mb-4 text-blue-200" />
            <h3 className="text-xl font-bold mb-2">Siap di-Generate!</h3>
            <p className="text-sm text-blue-100 mb-6 line-clamp-3">
              AI kami akan membaca modul Anda, memahami konteksnya, dan membuat soal yang relevan lengkap dengan kunci jawaban dan pembahasannya.
            </p>
            <button className="w-full py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              Generate Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
