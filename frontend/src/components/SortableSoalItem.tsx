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

export function SortableSoalItem({ 
  id, 
  index, 
  item, 
  totalLength,
  onUpdate, 
  onRemove, 
  onMoveUp,
  onMoveDown,
  onRegenerate, 
}: SortableItemProps) {
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
        "relative shadow-md shadow-slate-100 border-2 border-slate-100 rounded-[2rem] overflow-hidden group hover:border-brand-200 transition-all duration-300",
        isDragging && "border-brand-500 shadow-xl"
      )}>
        <div className="py-2 px-4 bg-slate-50 border-b-2 border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              {...attributes} 
              {...listeners}
              className="p-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors shrink-0"
            >
              <GripVertical className="w-5 h-5" />
            </div>
            <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm whitespace-nowrap">
              Butir Soal {item.nomor}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRegenerate(index)}
              className="h-8 px-2 hover:bg-brand-50 text-brand-600 border-brand-200 rounded-lg flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider"
            >
              <RefreshCcw className="w-3 h-3" strokeWidth={2.5} />
              <span className="hidden sm:inline">Regenerate</span>
            </Button>
            <div className="w-px h-5 bg-slate-200 mx-1 hidden sm:block"></div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onMoveUp(index)} 
              disabled={index === 0}
              className="h-8 w-8 hover:bg-slate-200 text-slate-400 rounded-lg disabled:opacity-30"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onMoveDown(index)} 
              disabled={index === totalLength - 1}
              className="h-8 w-8 hover:bg-slate-200 text-slate-400 rounded-lg disabled:opacity-30"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => onRemove(index)} className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 text-slate-300 rounded-lg transition-all ml-1">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4 md:p-6 space-y-5">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4" /> Pertanyaan
            </label>
            <Textarea 
              value={item.pertanyaan}
              onChange={(e) => onUpdate(index, 'pertanyaan', e.target.value)}
              className="min-h-[80px] text-base font-bold text-slate-800 border-2 border-slate-100 focus-visible:border-brand-200 focus-visible:ring-0 rounded-xl p-4 bg-slate-50/30 transition-all leading-relaxed shadow-sm"
            />
          </div>

          {(item.pilihan && item.pilihan.length > 0) && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ChevronDown className="w-3.5 h-3.5" /> Pilihan Jawaban
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {item.pilihan?.map((opt, optIndex) => (
                  <div key={optIndex} className="flex gap-2 items-start group/opt">
                    <div className="w-8 h-8 rounded-lg bg-white border-2 border-slate-100 flex items-center justify-center text-[12px] font-black text-slate-400 shrink-0 group-focus-within/opt:border-brand-200 group-focus-within/opt:text-brand-500 transition-all uppercase">
                      {String.fromCharCode(65 + optIndex)}
                    </div>
                    <Input 
                      value={opt.replace(/^[A-Z]\.\s*/, '')}
                      onChange={(e) => {
                        const newPilihan = [...(item.pilihan || [])]
                        newPilihan[optIndex] = `${String.fromCharCode(65 + optIndex)}. ${e.target.value}`
                        onUpdate(index, 'pilihan', newPilihan)
                      }}
                      className="h-8 border-2 border-slate-100 focus-visible:border-brand-200 focus-visible:ring-0 rounded-lg text-[13px] font-bold transition-all bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 text-brand-600">
                <Plus className="w-3.5 h-3.5 text-brand-500" /> Jawaban Benar
              </label>
              <Input 
                value={item.jawaban}
                onChange={(e) => onUpdate(index, 'jawaban', e.target.value)}
                className="h-9 border-2 border-brand-100 focus-visible:border-brand-200 focus-visible:ring-0 rounded-lg text-[13px] font-black uppercase bg-brand-50/30 text-brand-700 px-4 transition-all"
              />
            </div>
            {item.pembahasan && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Pembahasan
                </label>
                <Textarea 
                  value={item.pembahasan}
                  onChange={(e) => onUpdate(index, 'pembahasan', e.target.value)}
                  className="min-h-[60px] border-2 border-slate-100 focus-visible:border-brand-200 focus-visible:ring-0 rounded-lg text-xs font-medium text-slate-600 p-3 transition-all leading-snug"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
