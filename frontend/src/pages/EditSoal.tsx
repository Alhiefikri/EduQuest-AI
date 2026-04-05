import { useState, useEffect } from 'react'
import { Save, FileCheck, ArrowLeft, Plus, Loader2, AlertCircle, RefreshCcw, X } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSoalDetail, useUpdateSoal, useRegenerateSingleSoal } from '../hooks/useSoal'
import type { SoalItem } from '../types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSoalItem } from '../components/SortableSoalItem';


export default function EditSoal() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: soal, isLoading, error } = useSoalDetail(id || '')
  const updateMutation = useUpdateSoal()
  const regenerateMutation = useRegenerateSingleSoal()
  const [editedSoal, setEditedSoal] = useState<SoalItem[]>([])
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  
  const [regenerateIndex, setRegenerateIndex] = useState<number | null>(null)
  const [regenerateFeedback, setRegenerateFeedback] = useState('')
  const [regenerateGayaSoal, setRegenerateGayaSoal] = useState<string[]>(['formal_academic'])
  const [regenerateBloomLevels, setRegenerateBloomLevels] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setEditedSoal((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        // Recalculate nomor based on new order
        return newItems.map((item, index) => ({ ...item, nomor: index + 1 }));
      });
    }
  };

  useEffect(() => {
    if (soal?.data_soal) {
      // User Requested Feedback: Ensure stable IDs for each question to prevent focus loss anti-pattern
      const mappedSoal = soal.data_soal.map(item => ({
        ...item,
        id: item.id || crypto.randomUUID()
      }));
      setEditedSoal(mappedSoal)
    }
    if (soal?.gaya_soal) {
      const gaya = Array.isArray(soal.gaya_soal) ? soal.gaya_soal : [soal.gaya_soal]
      setRegenerateGayaSoal(gaya)
    }
    if (soal?.bloom_levels) {
      setRegenerateBloomLevels(soal.bloom_levels)
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
      toast.success(finalized ? "Soal Final Disimpan" : "Draft Tersimpan", {
        description: finalized ? "Anda akan dialihkan ke daftar soal." : "Perubahan Anda telah disimpan ke draft.",
      })

      if (finalized) {
        setTimeout(() => navigate('/soal'), 1500)
      } else {
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch {
      const errMessage = 'Gagal menyimpan perubahan'
      setSaveError(errMessage)
      toast.error("Gagal Menyimpan", { description: errMessage })
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
        id: crypto.randomUUID(),
        nomor: prev.length > 0 ? Math.max(...prev.map(i => i.nomor)) + 1 : 1, 
        pertanyaan: '', 
        jawaban: '', 
        pilihan: ['A. ', 'B. ', 'C. ', 'D. '], 
        pembahasan: '' 
      },
    ])
  }

  const moveSoalItemUp = (index: number) => {
    if (index === 0) return;
    setEditedSoal((prev) => {
      const newItems = arrayMove(prev, index, index - 1);
      return newItems.map((item, idx) => ({ ...item, nomor: idx + 1 }));
    });
  }

  const moveSoalItemDown = (index: number) => {
    setEditedSoal((prev) => {
      if (index === prev.length - 1) return prev;
      const newItems = arrayMove(prev, index, index + 1);
      return newItems.map((item, idx) => ({ ...item, nomor: idx + 1 }));
    });
  }

  const handleRegenerate = async () => {
    if (regenerateIndex === null || !id) return
    const itemToRegenerate = editedSoal[regenerateIndex]

    try {
      const newSoalItem = await regenerateMutation.mutateAsync({
        id,
        data: {
          nomor_soal: itemToRegenerate.nomor,
          soal_lama: itemToRegenerate,
          gaya_soal: regenerateGayaSoal,
          bloom_levels: regenerateBloomLevels,
          feedback: regenerateFeedback || undefined,
        },
      })

      setEditedSoal(prev => 
        prev.map((item, i) => (i === regenerateIndex ? { ...newSoalItem, nomor: item.nomor, id: item.id } : item))
      )
      toast.success("Berhasil Generate Ulang", {
        description: `Soal no ${itemToRegenerate.nomor} telah diperbarui.`,
      })
      setRegenerateIndex(null)
      setRegenerateFeedback('')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Silakan coba lagi.'
      toast.error("Gagal Generate Soal", {
        description: errorMsg
      })
    }
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

  const activeRegenerateItem = regenerateIndex !== null ? editedSoal[regenerateIndex] : null;

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
          {saveError && (
            <span className="text-[10px] md:text-sm font-black text-rose-600 bg-rose-50 border border-rose-100 shadow-sm px-4 py-2 rounded-full uppercase tracking-wider animate-in fade-in slide-in-from-right-4">{saveError}</span>
          )}
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

      <div className="space-y-6">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={editedSoal.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {editedSoal.map((item, index) => (
              <SortableSoalItem
                key={item.id}
                id={item.id}
                index={index}
                item={item}
                totalLength={editedSoal.length}
                onUpdate={updateSoalItem}
                onRemove={removeSoalItem}
                onMoveUp={moveSoalItemUp}
                onMoveDown={moveSoalItemDown}
                onRegenerate={setRegenerateIndex}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Global Regenerate Modal (DRY implementation) */}
        {regenerateIndex !== null && activeRegenerateItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-in fade-in">
            <Card className="w-full max-w-lg border-2 border-slate-200 shadow-2xl rounded-2xl relative animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white rounded-t-2xl">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                  <RefreshCcw className="w-5 h-5 text-brand-500" />
                  Regenerate Soal {activeRegenerateItem.nomor}
                </h3>
                <Button variant="ghost" size="icon" onClick={() => {
                  setRegenerateIndex(null); 
                  setRegenerateFeedback('');
                }}>
                  <X className="w-5 h-5 text-slate-400" />
                </Button>
              </div>
              <CardContent className="p-6 bg-slate-50 space-y-4 rounded-b-2xl">
                <div className="space-y-4 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gaya Soal (Multi-Select)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                    {[
                      { id: "light_story", label: "Cerita Ringan" },
                      { id: "formal_academic", label: "Akademik Formal" },
                      { id: "case_study", label: "Studi Kasus" },
                      { id: "standard_exam", label: "Ujian Standar" },
                      { id: "hots", label: "Tingkat Tinggi (HOTS)" },
                    ].map((style) => (
                      <div 
                        key={style.id} 
                        className={cn(
                          "flex items-center space-x-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer",
                          regenerateGayaSoal.includes(style.id) 
                            ? 'bg-brand-50 border-brand-200' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        )}
                        onClick={() => {
                          if (regenerateGayaSoal.includes(style.id)) {
                            setRegenerateGayaSoal(regenerateGayaSoal.filter(id => id !== style.id))
                          } else {
                            setRegenerateGayaSoal([...regenerateGayaSoal, style.id])
                          }
                        }}
                      >
                        <Checkbox 
                          id={`reg-${style.id}`} 
                          checked={regenerateGayaSoal.includes(style.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setRegenerateGayaSoal([...regenerateGayaSoal, style.id])
                            } else {
                              setRegenerateGayaSoal(regenerateGayaSoal.filter(id => id !== style.id))
                            }
                          }}
                          className="border-2 border-slate-300 data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500 w-4 h-4"
                        />
                        <Label htmlFor={`reg-${style.id}`} className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                          {style.label}
                        </Label>
                      </div>
                    ))}
                  </div>

                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taksonomi Bloom (Opsional)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'C1', label: 'C1' },
                      { id: 'C2', label: 'C2' },
                      { id: 'C3', label: 'C3' },
                      { id: 'C4', label: 'C4' },
                      { id: 'C5', label: 'C5' },
                      { id: 'C6', label: 'C6' },
                    ].map((bloom) => (
                      <div 
                        key={bloom.id}
                        onClick={() => {
                          if (regenerateBloomLevels.includes(bloom.id)) {
                            setRegenerateBloomLevels(regenerateBloomLevels.filter(b => b !== bloom.id))
                          } else {
                            setRegenerateBloomLevels([...regenerateBloomLevels, bloom.id])
                          }
                        }}
                        className={cn(
                          "flex items-center justify-center p-2 rounded-lg border-2 transition-all cursor-pointer text-[10px] font-black",
                          regenerateBloomLevels.includes(bloom.id)
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-white border-slate-100 text-slate-400'
                        )}
                      >
                        {bloom.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instruksi Tambahan (Opsional)</label>
                  <Textarea 
                    placeholder="Contoh: Buat lebih sulit, gunakan bahasa yang lebih sederhana..."
                    value={regenerateFeedback}
                    onChange={(e) => setRegenerateFeedback(e.target.value)}
                    className="bg-white border-2 border-slate-200 rounded-xl focus-visible:ring-brand-500/20 text-sm font-medium text-slate-600"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setRegenerateIndex(null)} className="rounded-xl font-bold uppercase tracking-tight">Batal</Button>
                  <Button 
                    onClick={handleRegenerate}
                    disabled={regenerateMutation.isPending}
                    className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 uppercase tracking-tight"
                  >
                    {regenerateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <RefreshCcw className="w-5 h-5 mr-2" />}
                    Mulai Generate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
