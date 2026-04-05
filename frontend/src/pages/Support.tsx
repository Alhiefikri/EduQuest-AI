import { MessageCircle, Mail, Phone, ExternalLink, HelpCircle, ChevronRight, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Support() {
  const faqs = [
    { q: 'Bagaimana cara upload modul PDF?', a: 'Anda dapat mengunggah file melalui menu Modul Ajar menggunakan tombol Upload di pojok kanan atas.' },
    { q: 'Berapa lama proses generate soal?', a: 'Biasanya 15-30 detik. AI melakukan analisis mendalam untuk memastikan akurasi konteks pedagogis.' },
    { q: 'Halaman kunci jawaban terpisah?', a: 'Ya, pada halaman Pratinjau, aktifkan opsi "Halaman Kunci Jawaban" sebelum ekspor DOCX.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center space-y-4 pt-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Pusat Bantuan EduQuest</h1>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-2xl mx-auto">Kami siap membantu Anda mengoptimalkan penggunaan AI dalam proses evaluasi belajar mengajar.</p>
        
        <div className="relative mt-8 group max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
          <Input 
            type="text" 
            placeholder="Cari solusi atau panduan teknis..." 
            className="w-full pl-12 pr-6 h-12 bg-white border border-slate-200 rounded-xl text-xs font-bold shadow-xl shadow-slate-100/50 focus-visible:ring-brand-500/10 focus-visible:border-brand-500 transition-all placeholder:text-slate-400 uppercase tracking-tight"
          />
        </div>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: MessageCircle, label: 'Live Chat', desc: 'Respon instan dari tim.', action: 'Mulai Chat', color: 'brand' },
          { icon: Mail, label: 'Email', desc: 'Pertanyaan teknis detail.', action: 'support@eduquest.ai', color: 'slate' },
          { icon: Phone, label: 'WhatsApp', desc: 'Konsultasi via seluler.', action: '+62 812-3456-7890', color: 'emerald' }
        ].map((item, i) => (
          <Card key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md hover:border-brand-200 transition-all group group cursor-default">
            <CardContent className="p-0 flex flex-col items-center">
              <div className={`p-3.5 rounded-xl border shadow-sm mb-5 transition-all group-hover:scale-110 ${
                item.color === 'brand' ? 'bg-brand-50 text-brand-600 border-brand-100' : 
                item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                'bg-slate-50 text-slate-600 border-slate-100'
              }`}>
                <item.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-[11px] font-black text-slate-900 mb-1.5 uppercase tracking-[0.2em]">{item.label}</h3>
              <p className="text-[10px] font-bold text-slate-400 mb-5 uppercase tracking-wide px-2 leading-tight">{item.desc}</p>
              <button className={`text-[10px] font-black uppercase tracking-widest border-b-2 pb-0.5 transition-colors ${
                item.color === 'brand' ? 'text-brand-600 border-brand-100 hover:border-brand-500' : 
                item.color === 'emerald' ? 'text-emerald-700 border-emerald-100 hover:border-emerald-600' : 
                'text-slate-700 border-slate-200 hover:border-slate-500'
              }`}>{item.action}</button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white max-w-4xl mx-auto">
        <div className="px-8 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3.5">
          <div className="bg-slate-900 p-2 rounded-lg text-white shadow-lg">
            <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <h2 className="text-sm font-black text-slate-900 tracking-widest uppercase">Pertanyaan Populer (FAQ)</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {faqs.map((faq, index) => (
            <div key={index} className="p-8 hover:bg-slate-50/30 transition-all cursor-default group">
              <h3 className="text-xs font-black text-slate-900 mb-3 group-hover:text-brand-600 transition-colors flex items-center justify-between uppercase tracking-tight">
                {faq.q}
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-100 flex items-center justify-center transition-all group-hover:border-brand-200 group-hover:translate-x-1 shadow-sm">
                   <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600" />
                </div>
              </h3>
              <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-5xl pl-1 uppercase tracking-wide opacity-90">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="p-5 bg-slate-50/50 text-center border-t border-slate-100">
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 flex items-center gap-2 mx-auto hover:bg-white hover:text-brand-700 transition-all rounded-lg border border-transparent hover:border-brand-100">
            Lihat Dokumentasi Lengkap <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
