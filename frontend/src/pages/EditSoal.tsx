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

  useEffect(() => {
    if (regenerateIndex !== null) {
      if (soal?.gaya_soal) {
        const gaya = Array.isArray(soal.gaya_soal) ? soal.gaya_soal : [soal.gaya_soal]
        setRegenerateGayaSoal(gaya)
      }
      if (soal?.bloom_levels) {
        setRegenerateBloomLevels(soal.bloom_levels)
      }
      setRegenerateFeedback('')
    }
  }, [regenerateIndex, soal])

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
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 py-8 space-y-6 animate-in fade-in">
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <Loader2 className="w-10 h-10 text-brand-500 animate-spin" strokeWidth={2.5} />
          <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Singkronisasi Library...</p>
        </div>
      </div>
    )
  }

  if (error || !soal) {
    return (
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 py-8 space-y-6 animate-in fade-in">
        <Card className="border border-rose-100 bg-white shadow-sm rounded-xl overflow-hidden text-center">
          <CardContent className="p-12">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <p className="text-xl font-black text-slate-900 uppercase tracking-tight">Data Tidak Ditemukan</p>
            <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-wide mb-8">{error instanceof Error ? error.message : 'Soal tidak ditemukan di basis data'}</p>
            <Button asChild size="sm" variant="outline" className="h-10 px-8 rounded-lg border border-slate-200 font-black uppercase text-xs tracking-widest">
              <Link to="/soal">Kembali ke Daftar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeRegenerateItem = regenerateIndex !== null ? editedSoal[regenerateIndex] : null;

  return (
    <div className="max-w-5xl xl:max-w-6xl mx-auto px-4 py-6 space-y-8 animate-in fade-in pb-40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="w-9 h-9 border border-slate-200 hover:bg-slate-50 rounded-lg transition-all shrink-0">
            <Link to="/soal">
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none break-words">Editor Soal</h1>
            <p className="text-xs font-black text-slate-600 border-l-2 border-brand-500 pl-3 uppercase tracking-widest">
              {soal.mata_pelajaran} {soal.topik ? ` • ${soal.topik}` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {saveError && (
            <span className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-full uppercase tracking-widest animate-in fade-in">{saveError}</span>
          )}
          {saveSuccess && (
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full uppercase tracking-widest animate-in fade-in">Tersimpan!</span>
          )}
          <Button
            onClick={() => handleSave(false)}
            disabled={saving}
            variant="outline"
            className="flex-1 sm:flex-none h-9 border border-slate-200 text-slate-700 font-black uppercase px-4 rounded-lg shadow-sm hover:bg-slate-50 transition-all text-xs tracking-widest"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />} Simpan Draft
          </Button>
          <Button asChild className="flex-1 sm:flex-none h-9 font-black uppercase px-6 rounded-lg bg-slate-900 text-white shadow-sm hover:translate-y-[-1px] transition-all text-xs tracking-widest">
            <Link to={`/soal/preview/${id}`}>
              <FileCheck className="w-3.5 h-3.5 mr-2" /> Selesai & Preview
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in">
            <Card className="w-full max-w-lg border border-slate-200 shadow-2xl rounded-xl relative animate-in zoom-in-95 duration-200 bg-white">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
                  <RefreshCcw className="w-4.5 h-4.5 text-brand-500" />
                  Regenerate Soal {activeRegenerateItem.nomor}
                </h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => {
                  setRegenerateIndex(null); 
                  setRegenerateFeedback('');
                }}>
                  <X className="w-4 h-4 text-slate-600" />
                </Button>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Gaya Soal (Multi-Select)</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: "light_story", label: "Cerita" },
                        { id: "formal_academic", label: "Formal" },
                        { id: "case_study", label: "Studi Kasus" },
                        { id: "standard_exam", label: "Standar" },
                        { id: "hots", label: "HOTS" },
                      ].map((style) => (
                        <div 
                          key={style.id} 
                          className={cn(
                            "flex items-center space-x-3 p-2.5 rounded-lg border-2 transition-all cursor-pointer",
                            regenerateGayaSoal.includes(style.id) 
                              ? 'bg-brand-50 border-brand-200 shadow-sm' 
                              : 'bg-white border-slate-50 hover:border-slate-100'
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
                            className="w-4 h-4 border-slate-300"
                          />
                          <Label htmlFor={`reg-${style.id}`} className="text-xs font-black text-slate-800 cursor-pointer select-none uppercase tracking-tight">
                            {style.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Taksonomi Bloom</label>
                    <div className="grid grid-cols-6 gap-1.5">
                      {['C1', 'C2', 'C3', 'C4', 'C5', 'C6'].map((bloom) => (
                        <div 
                          key={bloom}
                          onClick={() => {
                            if (regenerateBloomLevels.includes(bloom)) {
                              setRegenerateBloomLevels(regenerateBloomLevels.filter(b => b !== bloom))
                            } else {
                              setRegenerateBloomLevels([...regenerateBloomLevels, bloom])
                            }
                          }}
                          className={cn(
                            "flex items-center justify-center h-9 rounded-lg border-2 transition-all cursor-pointer text-xs font-black",
                            regenerateBloomLevels.includes(bloom)
                              ? 'bg-brand-600 border-brand-600 text-white shadow-md'
                              : 'bg-white border-slate-50 text-slate-600 hover:border-slate-100'
                          )}
                        >
                          {bloom}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Instruksi Tambahan</label>
                  <Textarea 
                    placeholder="Contoh: Buat lebih sulit, gunakan studi kasus nyata..."
                    value={regenerateFeedback}
                    onChange={(e) => setRegenerateFeedback(e.target.value)}
                    className="bg-slate-50 border-slate-100 rounded-lg focus-visible:ring-brand-500/10 text-xs font-bold text-slate-800 min-h-[80px] p-3 transition-all"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-3">
                  <Button variant="ghost" size="sm" onClick={() => setRegenerateIndex(null)} className="rounded-lg font-black uppercase tracking-widest text-xs h-10 px-6">Batal</Button>
                  <Button 
                    onClick={handleRegenerate}
                    disabled={regenerateMutation.isPending}
                    size="sm"
                    className="rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-black px-8 uppercase tracking-widest text-xs h-10 shadow-lg transition-all active:scale-95"
                  >
                    {regenerateMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <RefreshCcw className="w-3.5 h-3.5 mr-2" />}
                    Mulai Regenerate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Button
          onClick={addSoalItem}
          variant="outline"
          className="w-full h-24 border border-dashed border-slate-300 bg-slate-50/20 text-slate-400 font-bold uppercase tracking-widest hover:bg-slate-50 hover:border-brand-400 hover:text-brand-600 transition-all group rounded-xl shadow-inner"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center group-hover:scale-105 group-hover:border-brand-300 transition-all shadow-sm">
              <Plus className="w-6 h-6 text-slate-400 group-hover:text-brand-600" />
            </div>
            <span className="text-xs font-black tracking-widest uppercase">Tambah Butir Soal Baru</span>
          </div>
        </Button>
      </div>

      {/* Floating Action Bar (Optimized Contrast) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 px-6 py-4 rounded-xl shadow-2xl z-30 flex items-center gap-6 animate-in slide-in-from-bottom-10 w-[95%] max-w-xl">
        <div className="flex items-center gap-5 border-r border-white/20 pr-6">
          <div>
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Editor Status</p>
             <p className="text-base font-black text-white tracking-tight leading-none">{editedSoal.length} <span className="text-brand-400 uppercase text-xs ml-1 tracking-widest font-black">Butir Soal</span></p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-1">
          <button onClick={() => navigate('/soal')} className="px-4 py-2 text-xs font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors mr-auto">Batal</button>
          <Button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="h-10 bg-white text-slate-950 hover:bg-brand-50 rounded-lg font-black uppercase tracking-widest text-xs px-8 shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />} Simpan Final
          </Button>
        </div>
      </div>
    </div>
  )
}
