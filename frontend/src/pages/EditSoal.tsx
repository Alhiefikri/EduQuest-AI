import { useState, useEffect } from 'react'
import { Save, FileCheck, ArrowLeft, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Loader2, AlertCircle } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSoalDetail, useUpdateSoal } from '../hooks/useSoal'
import type { SoalItem } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function EditSoal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: soal, isLoading, error } = useSoalDetail(id || '')
  const updateMutation = useUpdateSoal()
  const [editedSoal, setEditedSoal] = useState<SoalItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (soal?.data_soal) {
      setEditedSoal(soal.data_soal)
    }
  }, [soal])

  const handleSave = async (finalized: boolean = false) => {
    if (!id) return
    setSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    try {
      await updateMutation.mutateAsync({ 
        id, 
        data: { 
          data_soal: editedSoal,
          status: finalized ? 'finalized' : undefined 
        } 
      })
      setSaveSuccess(true)
      if (finalized) {
        setTimeout(() => navigate('/soal'), 1500)
      } else {
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch {
      setSaveError('Gagal menyimpan perubahan')
    } finally {
      setSaving(false)
    }
  }

  const updateSoalItem = (index: number, field: keyof SoalItem, value: any) => {
    setEditedSoal((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const removeSoalItem = (index: number) => {
    setEditedSoal((prev) => prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, nomor: i + 1 })))
  }

  const addSoalItem = () => {
    setEditedSoal((prev) => [
      ...prev,
      { 
        nomor: prev.length + 1, 
        pertanyaan: '', 
        jawaban: '', 
        pilihan: ['A. ', 'B. ', 'C. ', 'D. '], 
        pembahasan: '' 
      },
    ])
  }

  if (isLoading) {
    return (
      <div className="max-w-[1000px] mx-auto space-y-8 pb-20 animate-in fade-in p-4 md:p-8">
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin" strokeWidth={2.5} />
          <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Data...</p>
        </div>
      </div>
    )
  }

  if (error || !soal) {
    return (
      <div className="max-w-[1000px] mx-auto space-y-8 pb-20 animate-in fade-in p-4 md:p-8">
        <Card className="border-2 border-rose-100 shadow-xl rounded-[2rem] overflow-hidden text-center">
          <CardContent className="p-16">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-rose-500" strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Data Tidak Ditemukan</p>
            <p className="text-slate-500 mt-2 font-medium mb-10">{error instanceof Error ? error.message : 'Soal tidak ditemukan di basis data'}</p>
            <Button asChild size="lg" variant="outline" className="rounded-xl border-2 border-slate-200 hover:bg-slate-50 font-bold px-10">
              <Link to="/soal">Kembali ke Daftar Soal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-12 pb-40 animate-in fade-in p-2 md:p-8 max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 px-2">
        <div className="flex items-center gap-6">
          <Button asChild variant="outline" size="icon" className="w-12 h-12 border-2 border-slate-200 shadow-sm hover:bg-slate-50 rounded-xl transition-all shrink-0">
            <Link to="/soal">
              <ArrowLeft className="w-6 h-6 text-slate-600" strokeWidth={2.5} />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase leading-none break-words">Editor Soal</h1>
            <p className="text-sm md:text-base font-bold text-slate-400 border-l-4 border-brand-500 pl-4 uppercase tracking-wider">
              {soal.mata_pelajaran} {soal.topik ? ` - ${soal.topik}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4 flex-wrap w-full lg:w-auto">
          {saveSuccess && (
            <span className="text-[10px] md:text-sm font-black text-emerald-600 bg-emerald-50 border border-emerald-100 shadow-sm px-4 py-2 rounded-full uppercase tracking-wider animate-in fade-in slide-in-from-right-4">Tersimpan!</span>
          )}
          <Button
            onClick={() => handleSave(false)}
            disabled={saving}
            variant="outline"
            className="flex-1 lg:flex-none h-12 border-2 border-slate-200 text-slate-700 font-bold uppercase px-6 rounded-xl shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50 text-xs md:text-sm"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />} <span className="hidden sm:inline">Simpan</span> Draft
          </Button>
          <Button asChild className="flex-1 lg:flex-none h-12 border-none font-bold uppercase px-8 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-200 transition-all hover:translate-y-[-1px] text-xs md:text-sm">
            <Link to={`/soal/preview/${id}`}>
              <FileCheck className="w-5 h-5 mr-2" /> Selesai <span className="hidden sm:inline">& Preview</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {editedSoal.map((item, index) => (
          <Card key={index} className="shadow-md shadow-slate-100 border-2 border-slate-100 rounded-[2rem] overflow-hidden group hover:border-brand-200 transition-all duration-300">
            <div className="p-4 bg-slate-50 border-b-2 border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors">
                  <GripVertical className="w-5 h-5" />
                </div>
                <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm">Butir Soal {item.nomor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-200 text-slate-400 rounded-lg">
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-200 text-slate-400 rounded-lg">
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-slate-200 mx-2"></div>
                <Button variant="ghost" size="icon" onClick={() => removeSoalItem(index)} className="h-9 w-9 hover:bg-rose-50 hover:text-rose-600 text-slate-300 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-10 space-y-12">
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Pertanyaan</label>
                <Textarea
                  className="w-full bg-slate-50/50 border-2 border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-2xl p-6 text-lg font-bold text-slate-900 outline-none transition-all min-h-[140px] shadow-inner"
                  value={item.pertanyaan}
                  onChange={(e) => updateSoalItem(index, 'pertanyaan', e.target.value)}
                />
              </div>

              {item.pilihan && (
                <div className="space-y-6 p-8 bg-slate-50/50 rounded-3xl border-2 border-slate-100 shadow-inner">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Opsi Jawaban (Multi Pilihan)</label>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPilihan = item.pilihan?.length ? [] : ['A. ', 'B. ', 'C. ', 'D. ']
                        updateSoalItem(index, 'pilihan', newPilihan)
                      }}
                      className="text-[10px] font-black uppercase rounded-lg border-2 border-slate-200 h-8 px-4"
                    >
                      {item.pilihan?.length ? 'Hapus Pilihan' : 'Aktifkan Pilihan Ganda'}
                    </Button>
                  </div>
                  {item.pilihan.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6 pt-2">
                      {item.pilihan.map((opsi, oi) => (
                        <div key={oi} className="relative group">
                          <Input
                            type="text"
                            value={opsi}
                            onChange={(e) => {
                              const newPilihan = [...item.pilihan!]
                              newPilihan[oi] = e.target.value
                              updateSoalItem(index, 'pilihan', newPilihan)
                            }}
                            className="w-full bg-white border-2 border-slate-100 focus:border-brand-200 focus:ring-0 rounded-xl h-14 pl-12 pr-4 text-sm font-bold shadow-sm transition-all"
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 group-focus-within:text-brand-500">#{oi + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                    Kunci Jawaban Valid
                  </label>
                  <Input
                    type="text"
                    value={item.jawaban}
                    onChange={(e) => updateSoalItem(index, 'jawaban', e.target.value)}
                    className="w-full bg-slate-50/50 border-2 border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-xl h-14 px-6 text-base font-black text-brand-600 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">AI Visual Prompt (Opsional)</label>
                  <Input
                    type="text"
                    value={item.gambar_prompt || ''}
                    onChange={(e) => updateSoalItem(index, 'gambar_prompt', e.target.value)}
                    placeholder="Contoh: Ilustrasi sebuah mikroskop cahaya..."
                    className="w-full bg-slate-50/50 border-2 border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-xl h-14 px-6 text-sm font-medium text-slate-500 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pembahasan & Penjelasan</label>
                <Textarea
                  value={item.pembahasan || ''}
                  onChange={(e) => updateSoalItem(index, 'pembahasan', e.target.value)}
                  className="w-full bg-slate-50/50 border-2 border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-2xl p-6 text-sm font-medium text-slate-600 outline-none transition-all min-h-[120px] shadow-inner leading-relaxed"
                  placeholder="Berikan alasan mengapa jawaban tersebut benar..."
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={addSoalItem}
          variant="outline"
          className="w-full h-32 border-2 border-dashed border-slate-200 bg-slate-50/30 text-slate-400 font-bold uppercase tracking-widest hover:bg-slate-50 hover:border-brand-300 hover:text-brand-600 transition-all group rounded-[2rem]"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:border-brand-200 group-hover:shadow-md transition-all shadow-sm">
              <Plus className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <span className="text-xs font-black">Tambah Butir Soal Baru</span>
          </div>
        </Button>
      </div>

      <div className="fixed bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-white/10 px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2.5rem] shadow-2xl z-30 flex flex-col sm:flex-row items-center gap-4 md:gap-10 animate-in slide-in-from-bottom-10 border-t-2 border-t-white/5 w-[95%] max-w-2xl">
        <div className="flex items-center gap-4 md:gap-6 sm:border-r border-white/10 sm:pr-10">
          <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Editor Status</p>
          <p className="text-sm md:text-base font-bold text-white tracking-tight">{editedSoal.length} <span className="text-brand-400">Butir</span></p>
        </div>
        <div className="flex items-center gap-3 md:gap-5 w-full sm:w-auto">
          <button onClick={() => navigate('/soal')} className="flex-1 sm:flex-none px-4 md:px-6 py-2 text-[10px] md:text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Batal</button>
          <Button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex-2 sm:flex-none h-10 md:h-12 bg-white text-slate-950 hover:bg-brand-50 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs px-6 md:px-10 shadow-lg active:scale-95 transition-all disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin mr-3" />} Simpan Permanen
          </Button>
        </div>
      </div>
    </div>
  )
}
