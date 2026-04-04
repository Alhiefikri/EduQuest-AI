import { useState, useEffect } from 'react'
import { Save, FileCheck, ArrowLeft, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Loader2, AlertCircle } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSoalDetail, useUpdateSoal } from '../hooks/useSoal'
import type { SoalItem } from '../types'

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
      <div className="max-w-[1000px] mx-auto space-y-8 pb-20 animate-in fade-in">
        <div className="flex items-center gap-4">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
          <p className="text-sm font-semibold text-gray-700">Memuat data soal...</p>
        </div>
      </div>
    )
  }

  if (error || !soal) {
    return (
      <div className="max-w-[1000px] mx-auto space-y-8 pb-20 animate-in fade-in">
        <div className="bg-white p-8 rounded-2xl border border-red-100 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-red-700">{error instanceof Error ? error.message : 'Soal tidak ditemukan'}</p>
          <Link to="/soal" className="mt-3 inline-block text-sm font-bold text-brand-500 hover:text-brand-600">Kembali ke Daftar Soal</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-20 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link to="/soal" className="group flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-brand-500 hover:border-brand-200 hover:shadow-sm transition-all active:scale-95">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Editor Bank Soal</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              ID: {soal.id} • {soal.mata_pelajaran}{soal.topik ? ` - ${soal.topik}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">Tersimpan!</span>
          )}
          {saveError && (
            <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">{saveError}</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-xs active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan Draft
          </button>
          <Link to={`/soal/preview/${id}`} className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-bold hover:bg-brand-600 transition-all shadow-md active:scale-95">
            <FileCheck className="w-4 h-4" /> Selesai & Preview
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {editedSoal.map((item, index) => (
          <div key={index} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden group hover:border-brand-200 transition-colors">
            <div className="p-2 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500">
                  <GripVertical className="w-4 h-4" />
                </div>
                <span className="bg-brand-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider uppercase">Butir {item.nomor}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><ChevronUp className="w-4 h-4" /></button>
                <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><ChevronDown className="w-4 h-4" /></button>
                <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                <button onClick={() => removeSoalItem(index)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Pertanyaan</label>
                <textarea
                  className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-2xl p-5 text-base font-bold text-gray-900 outline-none transition-all min-h-[120px]"
                  value={item.pertanyaan}
                  onChange={(e) => updateSoalItem(index, 'pertanyaan', e.target.value)}
                />
              </div>

              {item.pilihan && item.pilihan.length > 0 && (
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Pilihan Jawaban</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {item.pilihan.map((opsi, oi) => (
                      <input
                        key={oi}
                        type="text"
                        value={opsi}
                        onChange={(e) => {
                          const newPilihan = [...item.pilihan!]
                          newPilihan[oi] = e.target.value
                          updateSoalItem(index, 'pilihan', newPilihan)
                        }}
                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                    Kunci Jawaban
                  </label>
                  <input
                    type="text"
                    value={item.jawaban}
                    onChange={(e) => updateSoalItem(index, 'jawaban', e.target.value)}
                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Pembahasan</label>
                  <textarea
                    value={item.pembahasan || ''}
                    onChange={(e) => updateSoalItem(index, 'pembahasan', e.target.value)}
                    className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 outline-none transition-all min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addSoalItem}
          className="w-full py-8 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold hover:border-brand-200 hover:bg-brand-50/10 hover:text-brand-600 flex flex-col items-center justify-center gap-3 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
            <Plus className="w-6 h-6" strokeWidth={3} />
          </div>
          <span className="text-sm uppercase tracking-widest font-black">Tambah Butir Soal Manual</span>
        </button>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-lg border border-white/10 px-8 py-4 rounded-3xl shadow-2xl z-30 flex items-center gap-8 animate-in slide-in-from-bottom-8">
        <div className="flex items-center gap-4 border-r border-white/10 pr-8">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Editor Stats</p>
          <p className="text-sm font-bold text-white">{editedSoal.length} <span className="text-brand-400">Soal</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/soal')} className="px-4 py-2 text-xs font-bold text-white hover:text-brand-300 transition-colors">Batal</button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Simpan Permanen
          </button>
        </div>
      </div>
    </div>
  )
}
