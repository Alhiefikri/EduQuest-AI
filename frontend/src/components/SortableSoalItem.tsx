import { GripVertical, RefreshCcw, ChevronUp, ChevronDown, Trash2, FileText, BookOpen, Plus } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { SoalItem } from '../types'

interface SortableItemProps {
  id: string;
  index: number;
  item: SoalItem;
  totalLength: number;
  onUpdate: (index: number, field: keyof SoalItem, value: any) => void;
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRegenerate: (index: number) => void;
}

export const SortableSoalItem = ({ 
  id, 
  index, 
  item, 
  totalLength,
  onUpdate, 
  onRemove, 
  onMoveUp,
  onMoveDown,
  onRegenerate, 
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="touch-none">
      <Card className={cn(
        "relative shadow-sm border border-slate-200 rounded-xl overflow-hidden group hover:border-brand-300 transition-all duration-300 bg-white",
        isDragging && "border-brand-500 shadow-md ring-2 ring-brand-500/10"
      )}>
        <div className="py-3 px-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              {...attributes} 
              {...listeners}
              className="p-1.5 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-700 transition-colors shrink-0"
            >
              <GripVertical className="w-4.5 h-4.5" />
            </div>
            <span className="bg-slate-900 text-white text-xs font-black px-3.5 py-1.5 rounded-lg uppercase tracking-widest shadow-md whitespace-nowrap">
              Butir Soal {item.nomor}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRegenerate(index)}
              className="h-9 px-4 hover:bg-brand-50 text-brand-700 border-brand-200 rounded-lg flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-sm transition-all active:scale-95"
            >
              <RefreshCcw className="w-3.5 h-3.5" strokeWidth={3} />
              <span className="hidden sm:inline">Regenerate</span>
            </Button>
            <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onMoveUp(index)} 
              disabled={index === 0}
              className="h-9 w-9 hover:bg-slate-100 text-slate-700 rounded-lg disabled:opacity-20 transition-all active:scale-95"
            >
              <ChevronUp className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onMoveDown(index)} 
              disabled={index === totalLength - 1}
              className="h-9 w-9 hover:bg-slate-100 text-slate-700 rounded-lg disabled:opacity-20 transition-all active:scale-95"
            >
              <ChevronDown className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => onRemove(index)} className="h-9 w-9 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg transition-all ml-1 border border-transparent hover:border-rose-100 active:scale-95">
              <Trash2 className="w-4.5 h-4.5" />
            </Button>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-3.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2.5">
              <FileText className="w-4.5 h-4.5 text-brand-600" /> Pertanyaan
            </label>
            <Textarea 
              value={item.pertanyaan}
              onChange={(e) => onUpdate(index, 'pertanyaan', e.target.value)}
              className="min-h-[100px] text-sm font-bold text-slate-900 border-slate-200 focus-visible:border-brand-300 focus-visible:ring-0 rounded-xl p-4 bg-slate-50/30 transition-all leading-relaxed shadow-none placeholder:text-slate-400"
            />
          </div>

          {(item.pilihan && item.pilihan.length > 0) && (
            <div className="space-y-3.5">
              <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2.5">
                <ChevronDown className="w-4 h-4 text-slate-500" /> Pilihan Jawaban
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.pilihan?.map((opt, optIndex) => (
                  <div key={optIndex} className="flex gap-3 items-center group/opt">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-700 shrink-0 group-focus-within/opt:border-brand-500 group-focus-within/opt:text-brand-700 shadow-sm transition-all">
                      {String.fromCharCode(65 + optIndex)}
                    </div>
                    <Input 
                      value={opt.replace(/^[A-Z]\.\s*/, '')}
                      onChange={(e) => {
                        const newPilihan = [...(item.pilihan || [])]
                        newPilihan[optIndex] = `${String.fromCharCode(65 + optIndex)}. ${e.target.value}`
                        onUpdate(index, 'pilihan', newPilihan)
                      }}
                      className="h-10 border-slate-200 focus-visible:border-brand-500/20 focus-visible:ring-0 rounded-xl text-xs font-black transition-all bg-white shadow-none px-4 placeholder:text-slate-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3.5">
              <label className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2.5">
                <Plus className="w-4.5 h-4.5 text-brand-600" /> Kunci Jawaban
              </label>
              <Textarea 
                value={item.jawaban}
                onChange={(e) => onUpdate(index, 'jawaban', e.target.value)}
                className="min-h-[60px] border-2 border-brand-100 focus-visible:border-brand-300 focus-visible:ring-0 rounded-xl text-xs font-black uppercase bg-brand-50/30 text-brand-800 px-4 py-3.5 transition-all shadow-none"
              />
            </div>
            {item.pembahasan && (
              <div className="space-y-3.5">
                <label className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2.5">
                  <BookOpen className="w-4.5 h-4.5 text-slate-600" /> Pembahasan
                </label>
                <Textarea 
                  value={item.pembahasan}
                  onChange={(e) => onUpdate(index, 'pembahasan', e.target.value)}
                  className="min-h-[60px] border border-slate-200 focus-visible:border-brand-300 focus-visible:ring-0 rounded-xl text-xs font-bold text-slate-800 p-4 transition-all leading-relaxed shadow-none bg-slate-50/10"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SortableSoalItem;
