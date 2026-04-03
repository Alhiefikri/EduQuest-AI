import { MessageCircle, Mail, Phone, ExternalLink, HelpCircle, ChevronRight, Search } from 'lucide-react';

export default function Support() {
  const faqs = [
    { q: 'Bagaimana cara upload modul PDF?', a: 'Anda dapat mengunggah file PDF melalui menu Modul Ajar di sidebar menggunakan tombol Upload di pojok kanan atas.' },
    { q: 'Berapa lama proses generate soal?', a: 'Biasanya memakan waktu 15-30 detik. AI kami memproses teks secara mendalam untuk memastikan akurasi konteks.' },
    { q: 'Apakah saya bisa mengunduh kunci jawaban terpisah?', a: 'Ya, pada halaman Pratinjau, Anda dapat mengaktifkan opsi "Halaman Kunci Jawaban" sebelum mengunduh file DOCX.' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto space-y-12 pb-20 animate-in fade-in">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Pusat Bantuan</h1>
        <p className="text-lg font-medium text-gray-500 leading-relaxed">Kami siap membantu Anda mengoptimalkan penggunaan EduQuest AI dalam proses belajar mengajar.</p>
        
        <div className="relative mt-8 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Cari solusi atau pertanyaan..." 
            className="w-full pl-14 pr-6 py-5 bg-white border border-gray-200 rounded-3xl text-base font-medium shadow-lg shadow-gray-200/50 outline-none focus:ring-4 focus:ring-brand-50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: MessageCircle, label: 'Live Chat', desc: 'Respon instan dari tim support.', action: 'Mulai Chat', color: 'brand' },
          { icon: Mail, label: 'Email Support', desc: 'Kirim pertanyaan detail Anda.', action: 'support@eduquest.ai', color: 'orange' },
          { icon: Phone, label: 'WhatsApp', desc: 'Konsultasi via pesan singkat.', action: '+62 812-3456-7890', color: 'green' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all group">
            <div className={`p-4 rounded-2xl shadow-inner mb-6 transition-colors ${
              item.color === 'brand' ? 'bg-brand-50 text-brand-500 group-hover:bg-brand-500 group-hover:text-white' : 
              item.color === 'orange' ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white' : 
              'bg-green-50 text-green-700 group-hover:bg-green-700 group-hover:text-white'
            }`}>
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-2 uppercase tracking-widest">{item.label}</h3>
            <p className="text-sm font-medium text-gray-400 mb-6">{item.desc}</p>
            <button className={`text-sm font-black transition-colors ${
              item.color === 'brand' ? 'text-brand-600 hover:text-brand-700' : 
              item.color === 'orange' ? 'text-orange-700 hover:text-orange-800' : 
              'text-green-700 hover:text-green-800'
            }`}>{item.action}</button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
          <div className="bg-brand-500 p-2 rounded-lg text-white">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Pertanyaan Populer (FAQ)</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, index) => (
            <div key={index} className="p-10 hover:bg-gray-50/30 transition-all cursor-default group">
              <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-brand-500 transition-colors flex items-center justify-between">
                {faq.q}
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed max-w-4xl">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="p-6 bg-gray-50 text-center border-t border-gray-100">
          <button className="text-xs font-black uppercase tracking-[0.2em] text-brand-500 flex items-center gap-2 mx-auto hover:text-brand-600 transition-colors">
            Lihat Dokumentasi Lengkap <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
