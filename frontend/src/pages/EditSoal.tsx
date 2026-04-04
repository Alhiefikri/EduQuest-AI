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
        <div className="flex items-center gap-4">
          <Loader2 className="w-8 h-8 text-black animate-spin" strokeWidth={3} />
          <p className="text-base font-black uppercase tracking-widest">Memuat data soal...</p>
        </div>
      </div>
    )
  }

  if (error || !soal) {
    return (
      <div className="max-w-[1000px] mx-auto space-y-8 pb-20 animate-in fade-in p-4 md:p-8">
        <Card className="bg-red-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <CardContent className="p-12">
            <AlertCircle className="w-12 h-12 text-black mx-auto mb-4" strokeWidth={2.5} />
            <p className="text-xl font-black uppercase">{error instanceof Error ? error.message : 'Soal tidak ditemukan'}</p>
            <Button asChild variant="default" className="mt-6 uppercase font-bold border-2 border-black bg-white text-black hover:bg-gray-100">
              <Link to="/soal">Kembali ke Daftar Soal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-12 pb-32 animate-in fade-in p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Button asChild variant="outline" size="icon" className="w-12 h-12 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
            <Link to="/soal">
              <ArrowLeft className="w-6 h-6" strokeWidth={3} />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter drop-shadow-md">Editor Bank Soal</h1>
            <p className="text-base font-bold mt-2 border-l-4 border-primary pl-3">
              ID: <span className="bg-yellow-200 px-1 border-2 border-black">{soal.id}</span> &bull; {soal.mata_pelajaran}{soal.topik ? ` - ${soal.topik}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {saveSuccess && (
            <span className="text-sm font-black text-black bg-green-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-4 py-2 uppercase">Tersimpan!</span>
          )}
          {saveError && (
            <span className="text-sm font-black text-black bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-4 py-2 uppercase">{saveError}</span>
          )}
          <Button
            onClick={() => handleSave(false)}
            disabled={saving}
            variant="outline"
            className="border-4 border-black text-black font-black uppercase px-6 h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />} Simpan Draft
          </Button>
          <Button asChild className="border-4 border-black font-black uppercase px-6 h-12 bg-[#00f0ff] text-black hover:bg-[#00f0ff]/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Link to={`/soal/preview/${id}`}>
              <FileCheck className="w-5 h-5 mr-2" /> Selesai & Preview
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {editedSoal.map((item, index) => (
          <Card key={index} className="shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden group">
            <div className="p-3 bg-[#ffc900] border-b-4 border-black flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 cursor-grab active:cursor-grabbing text-black hover:bg-black/10 rounded-md transition-colors">
                  <GripVertical className="w-5 h-5" />
                </div>
                <span className="bg-black text-white text-xs font-black px-3 py-1 uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">Butir {item.nomor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-black/10 text-black rounded-none">
                  <ChevronUp className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-black/10 text-black rounded-none">
                  <ChevronDown className="w-5 h-5" />
                </Button>
                <div className="w-1 h-6 bg-black/20 mx-2"></div>
                <Button variant="ghost" size="icon" onClick={() => removeSoalItem(index)} className="hover:bg-red-400 hover:text-black text-black rounded-none border-2 border-transparent hover:border-black">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <CardContent className="p-8 space-y-10">
              <div className="space-y-4">
                <label className="text-sm font-black uppercase bg-black text-white px-2 py-1">Pertanyaan</label>
                <Textarea
                  className="w-full bg-white border-4 border-black focus:ring-0 rounded-none p-5 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[120px]"
                  value={item.pertanyaan}
                  onChange={(e) => updateSoalItem(index, 'pertanyaan', e.target.value)}
                />
              </div>

              {item.pilihan && (
                <div className="space-y-4 p-6 bg-gray-50 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-4">
                    <label className="text-sm font-black uppercase">Pilihan Jawaban</label>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newPilihan = item.pilihan?.length ? [] : ['A. ', 'B. ', 'C. ', 'D. ']
                        updateSoalItem(index, 'pilihan', newPilihan)
                      }}
                      className="text-xs font-black uppercase border-2 border-black"
                    >
                      {item.pilihan?.length ? 'Hapus Pilihan' : 'Tambah Pilihan (PG)'}
                    </Button>
                  </div>
                  {item.pilihan.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {item.pilihan.map((opsi, oi) => (
                        <Input
                          key={oi}
                          type="text"
                          value={opsi}
                          onChange={(e) => {
                            const newPilihan = [...item.pilihan!]
                            newPilihan[oi] = e.target.value
                            updateSoalItem(index, 'pilihan', newPilihan)
                          }}
                          className="w-full bg-white border-4 border-black focus:ring-0 rounded-none h-12 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-sm font-black uppercase bg-[#00f0ff] text-black px-2 py-1 border-2 border-black inline-flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    Kunci Jawaban
                  </label>
                  <Input
                    type="text"
                    value={item.jawaban}
                    onChange={(e) => updateSoalItem(index, 'jawaban', e.target.value)}
                    className="w-full bg-white border-4 border-black focus:ring-0 rounded-none h-14 text-base font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-black uppercase bg-[#ff90e8] text-black px-2 py-1 border-2 border-black">Gambar Prompt (AI)</label>
                  <Input
                    type="text"
                    value={item.gambar_prompt || ''}
                    onChange={(e) => updateSoalItem(index, 'gambar_prompt', e.target.value)}
                    placeholder="Deskripsi visual..."
                    className="w-full bg-white border-4 border-black focus:ring-0 rounded-none h-14 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black uppercase bg-gray-200 text-black px-2 py-1 border-2 border-black">Pembahasan</label>
                <Textarea
                  value={item.pembahasan || ''}
                  onChange={(e) => updateSoalItem(index, 'pembahasan', e.target.value)}
                  className="w-full bg-white border-4 border-black focus:ring-0 rounded-none p-5 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={addSoalItem}
          variant="outline"
          className="w-full h-32 border-4 border-dashed border-black bg-gray-50 text-black font-black uppercase tracking-widest hover:bg-[#ffc900] hover:border-solid hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group rounded-none"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Plus className="w-8 h-8" strokeWidth={3} />
            </div>
            <span>Tambah Butir Soal Manual</span>
          </div>
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#ff90e8] border-t-8 border-black p-6 z-30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0px_-8px_0px_0px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-6">
          <p className="text-sm font-black text-black uppercase tracking-widest bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Editor Stats: <span className="text-[#00f0ff] stroke-black" style={{ WebkitTextStroke: '1px black' }}>{editedSoal.length} SOAL</span>
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button onClick={() => navigate('/soal')} variant="outline" className="flex-1 md:flex-none border-4 border-black font-black uppercase px-8 h-14 bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Batal
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex-2 md:flex-none border-4 border-black font-black uppercase px-10 h-14 bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black/80 hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-base"
          >
            {saving && <Loader2 className="w-6 h-6 animate-spin mr-3" />} Simpan Permanen
          </Button>
        </div>
      </div>
    </div>
  )
}
