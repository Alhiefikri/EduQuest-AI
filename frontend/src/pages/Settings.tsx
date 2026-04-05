import { useState, useEffect } from 'react'
import { Save, Check, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface AISettings {
  provider: string
  gemini_api_key: string
  groq_api_key: string
  gemini_configured: boolean
  groq_configured: boolean
  openrouter_api_key: string
  openrouter_configured: boolean
}

export default function Settings() {
  const [aiProvider, setAiProvider] = useState('gemini')
  const [geminiKey, setGeminiKey] = useState('')
  const [groqKey, setGroqKey] = useState('')
  const [openrouterKey, setOpenrouterKey] = useState('')
  const [geminiConfigured, setGeminiConfigured] = useState(false)
  const [groqConfigured, setGroqConfigured] = useState(false)
  const [openrouterConfigured, setOpenrouterConfigured] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [showOpenrouterKey, setShowOpenrouterKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null)
  const [activeTab, setActiveTab] = useState(2)

  useEffect(() => {
    fetch(`${API_URL}/api/v1/settings/ai`)
      .then((res) => res.json())
      .then((data: AISettings) => {
        setAiProvider(data.provider)
        setGeminiConfigured(data.gemini_configured)
        setGroqConfigured(data.groq_configured)
        setOpenrouterConfigured(data.openrouter_configured)
      })
      .catch(() => {})
  }, [])

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const keys: Record<string, string> = { groq: groqKey, openrouter: openrouterKey, gemini: geminiKey }
      const apiKey = keys[aiProvider as keyof typeof keys] || geminiKey

      if (!apiKey) {
        setTestResult({ success: false, message: 'Masukkan API key terlebih dahulu' })
        setTesting(false)
        return
      }
      const res = await fetch(`${API_URL}/api/v1/settings/ai/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: aiProvider, api_key: apiKey }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Gagal menguji koneksi')
      setTestResult({ success: true, message: data.message })
    } catch (err: unknown) {
      const message = err instanceof Error && 'message' in err ? err.message : 'Gagal menguji koneksi'
      setTestResult({ success: false, message })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setSaveResult(null)
    try {
      const res = await fetch(`${API_URL}/api/v1/settings/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: aiProvider,
          gemini_api_key: geminiKey,
          groq_api_key: groqKey,
          openrouter_api_key: openrouterKey,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Gagal menyimpan pengaturan')
      setSaveResult({ success: true, message: data.message })
      setTimeout(() => setSaveResult(null), 3000)
    } catch (err: unknown) {
      const message = err instanceof Error && 'message' in err ? err.message : 'Gagal menyimpan pengaturan'
      setSaveResult({ success: false, message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b pb-6">
        <div className="space-y-1.5 px-1">
          <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Konfigurasi Sistem</h1>
          <p className="text-xs font-bold text-slate-600 border-l-2 border-brand-500 pl-4 uppercase tracking-widest leading-none">Integrasi AI & Preferensi Aplikasi</p>
        </div>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5">
          {['Detail Profil', 'Preferensi', 'Integrasi AI'].map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 px-4 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-xl ${
                i === activeTab ? 'bg-white text-brand-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-900'
              }`}>{tab}</button>
          ))}
        </div>

        <CardContent className="p-8 md:p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                <Zap className="w-4 h-4 text-brand-500" />
                Integrasi AI
              </h3>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-relaxed">Konfigurasi provider kecerdasan buatan untuk pemrosesan soal.</p>
            </div>

            <div className="md:col-span-2 space-y-6">
              {saveResult && (
                <div className={`flex items-center gap-3 p-4 rounded-xl animate-in slide-in-from-top-2 border ${
                  saveResult.success ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'
                }`}>
                  {saveResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <p className="text-xs font-black uppercase tracking-tight leading-none">
                    {saveResult.message}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase ml-1">AI Provider Engine</label>
                <div className="relative group">
                  <select
                    value={aiProvider}
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-black rounded-xl focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 block px-4 py-3 outline-none appearance-none cursor-pointer uppercase transition-all shadow-sm"
                  >
                    <option value="gemini">Google Gemini (1.5 Flash)</option>
                    <option value="groq">Groq (Llama 3.3 70B)</option>
                    <option value="openrouter">OpenRouter (Qwen Free)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
                     <Zap className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide px-1 leading-relaxed">
                  {aiProvider === 'gemini'
                    ? 'Free tier: 15 RPM. Memerlukan API key dari Google AI Studio.'
                    : aiProvider === 'groq'
                    ? 'Free tier: 30 RPM. Memerlukan API key dari Groq Cloud.'
                    : 'OpenRouter: Provider agregator pihak ketiga.'}
                </p>
              </div>

              {aiProvider === 'gemini' && (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase">Gemini API Key</label>
                    {geminiConfigured && (
                      <Badge variant="secondary" className="flex items-center gap-1.5 text-[9px] font-black text-emerald-700 bg-emerald-50 border-emerald-100 px-2 py-0 rounded-md uppercase tracking-tighter">
                        <Check className="w-3 h-3" strokeWidth={4} /> Terhubung
                      </Badge>
                    )}
                  </div>
                  <div className="relative group">
                    <Input
                      type={showGeminiKey ? 'text' : 'password'}
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder={geminiConfigured ? "Penyimpanan aktif (biarkan kosong)" : "AIza..."}
                      className="w-full h-11 bg-white border border-slate-200 text-slate-900 text-xs font-bold rounded-xl pr-12 focus-visible:ring-brand-500/10 focus-visible:border-brand-500 transition-all font-mono shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-50"
                    >
                      {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {aiProvider === 'groq' && (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase">Groq API Key</label>
                    {groqConfigured && (
                      <Badge variant="secondary" className="flex items-center gap-1.5 text-[9px] font-black text-emerald-700 bg-emerald-50 border-emerald-100 px-2 py-0 rounded-md uppercase tracking-tighter">
                        <Check className="w-3 h-3" strokeWidth={4} /> Terhubung
                      </Badge>
                    )}
                  </div>
                  <div className="relative group">
                    <Input
                      type={showGroqKey ? 'text' : 'password'}
                      value={groqKey}
                      onChange={(e) => setGroqKey(e.target.value)}
                      placeholder={groqConfigured ? "Penyimpanan aktif (biarkan kosong)" : "gsk_..."}
                      className="w-full h-11 bg-white border border-slate-200 text-slate-900 text-xs font-bold rounded-xl pr-12 focus-visible:ring-brand-500/10 focus-visible:border-brand-500 transition-all font-mono shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGroqKey(!showGroqKey)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-50"
                    >
                      {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {aiProvider === 'openrouter' && (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase">OpenRouter Key</label>
                    {openrouterConfigured && (
                      <Badge variant="secondary" className="flex items-center gap-1.5 text-[9px] font-black text-emerald-700 bg-emerald-50 border-emerald-100 px-2 py-0 rounded-md uppercase tracking-tighter">
                        <Check className="w-3 h-3" strokeWidth={4} /> Terhubung
                      </Badge>
                    )}
                  </div>
                  <div className="relative group">
                    <Input
                      type={showOpenrouterKey ? 'text' : 'password'}
                      value={openrouterKey}
                      onChange={(e) => setOpenrouterKey(e.target.value)}
                      placeholder={openrouterConfigured ? "Penyimpanan aktif (biarkan kosong)" : "sk-or-v1-..."}
                      className="w-full h-11 bg-white border border-slate-200 text-slate-900 text-xs font-bold rounded-xl pr-12 focus-visible:ring-brand-500/10 focus-visible:border-brand-500 transition-all font-mono shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOpenrouterKey(!showOpenrouterKey)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-50"
                    >
                      {showOpenrouterKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <Button
                  onClick={handleTestConnection}
                  disabled={testing}
                  variant="outline"
                  className="flex items-center gap-2.5 px-6 h-10 bg-white border-slate-200 text-slate-700 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-500" fill="currentColor" />}
                  Uji Koneksi
                </Button>

                {testResult && (
                  <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-tight animate-in slide-in-from-left-2 ${
                    testResult.success ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    {testResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center px-8">
          <Button variant="ghost" className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Reset Default</Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2.5 px-10 h-10 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:translate-y-[-1px] transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </Button>
        </div>
      </Card>
    </div>
  )
}
