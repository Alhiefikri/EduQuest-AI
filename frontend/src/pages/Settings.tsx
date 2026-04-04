import { useState, useEffect } from 'react'
import { Save, Check, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Zap } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface AISettings {
  provider: string
  gemini_api_key: string
  groq_api_key: string
  gemini_configured: boolean
  groq_configured: boolean
}

export default function Settings() {
  const [aiProvider, setAiProvider] = useState('gemini')
  const [geminiKey, setGeminiKey] = useState('')
  const [groqKey, setGroqKey] = useState('')
  const [geminiConfigured, setGeminiConfigured] = useState(false)
  const [groqConfigured, setGroqConfigured] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState(2)

  useEffect(() => {
    fetch(`${API_URL}/api/v1/settings/ai`)
      .then((res) => res.json())
      .then((data: AISettings) => {
        setAiProvider(data.provider)
        setGeminiConfigured(data.gemini_configured)
        setGroqConfigured(data.groq_configured)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [])

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const apiKey = aiProvider === 'groq' ? groqKey : geminiKey
      if (!apiKey) {
        setTestResult({ success: false, message: 'Masukkan API key terlebih dahulu untuk menguji koneksi' })
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
    <div className="max-w-[1000px] mx-auto space-y-10 pb-20 animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your personal profile and application preferences.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50 p-1">
          {['My Details', 'Preferences', 'AI Integration'].map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-2xl ${
                i === activeTab ? 'bg-white text-brand-500 shadow-sm' : 'text-gray-400 hover:text-gray-900'
              }`}>{tab}</button>
          ))}
        </div>

        <div className="p-10 md:p-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-brand-500" />
                AI Integration
              </h3>
              <p className="text-sm font-medium text-gray-400 mt-2 leading-relaxed">Configure your AI provider and API key for question generation.</p>
            </div>

            <div className="md:col-span-2 space-y-8">
              {saveResult && (
                <div className={`flex items-center gap-2 p-4 rounded-xl ${
                  saveResult.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
                }`}>
                  {saveResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                  <p className={`text-sm font-medium ${saveResult.success ? 'text-green-700' : 'text-red-700'}`}>
                    {saveResult.message}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">AI Provider</label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 outline-none appearance-none cursor-pointer"
                >
                  <option value="gemini">Google Gemini (gemini-1.5-flash)</option>
                  <option value="groq">Groq (llama-3.3-70b-versatile)</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {aiProvider === 'gemini'
                    ? 'Free tier: 15 RPM. Requires Google AI Studio API key.'
                    : 'Free tier: 30 RPM. Requires Groq Cloud API key.'}
                </p>
              </div>

              {aiProvider === 'gemini' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Gemini API Key</label>
                    {geminiConfigured && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                        <Check className="w-3 h-3" strokeWidth={3} /> Tersimpan
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showGeminiKey ? 'text' : 'password'}
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder={geminiConfigured ? "Biarkan kosong untuk menggunakan key yang sudah tersimpan" : "AIza..."}
                      className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 pr-12 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {aiProvider === 'groq' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Groq API Key</label>
                    {groqConfigured && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                        <Check className="w-3 h-3" strokeWidth={3} /> Tersimpan
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showGroqKey ? 'text' : 'password'}
                      value={groqKey}
                      onChange={(e) => setGroqKey(e.target.value)}
                      placeholder={groqConfigured ? "Biarkan kosong untuk menggunakan key yang sudah tersimpan" : "gsk_..."}
                      className="w-full bg-gray-50 border border-gray-100 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-brand-100 focus:border-brand-500 block px-4 py-3 pr-12 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowGroqKey(!showGroqKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showGroqKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-xs active:scale-95 disabled:opacity-50"
                >
                  {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Test Connection
                </button>

                {testResult && (
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${
                    testResult.success ? 'text-green-600' : 'text-red-600'
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
        </div>

        <div className="p-8 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-4">
          <button className="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">Reset to Defaults</button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2.5 px-8 py-3 bg-brand-500 text-white rounded-2xl text-sm font-bold hover:bg-brand-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
