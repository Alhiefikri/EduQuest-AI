import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function PreviewWord() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/soal" className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Preview Hasil Dokumen #{id}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pastikan format sudah sesuai sebelum diunduh.</p>
        </div>
        <button className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition shadow-sm">
          <Download className="w-4 h-4" /> Unduh DOCX
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 min-h-[600px] flex items-center justify-center relative overflow-hidden">
        {/* Dekoratif latar dokumen Word */}
        <div className="absolute inset-x-8 top-12 bottom-12 bg-gray-100 dark:bg-gray-900 border shadow-inner border-gray-300 dark:border-gray-600 rounded-lg flex flex-col pt-12 items-center space-y-4">
           <FileText className="w-16 h-16 text-blue-500 opacity-50" />
           <p className="text-gray-500 font-medium max-w-sm text-center">
             Preview dokumen Word interaktif belum didukung secara realtime. Anda dapat mengunduh file untuk melihat hasil akhirnya di Microsoft Word.
           </p>
        </div>
      </div>
    </div>
  );
}
