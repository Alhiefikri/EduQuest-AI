import { User, Bell, Shield, Palette, Globe, Save, ChevronRight, Check } from 'lucide-react';

export default function Settings() {
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
          {['My Details', 'Preferences', 'Integrations', 'Billing'].map((tab, i) => (
            <button key={i} className={`flex-1 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-2xl ${
              i === 0 ? 'bg-white text-brand-500 shadow-sm' : 'text-gray-400 hover:text-gray-900'
            }`}>{tab}</button>
          ))}
        </div>

        <div className="p-10 md:p-12 space-y-12">
          {/* Section 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-base font-bold text-gray-900">Personal Information</h3>
              <p className="text-sm font-medium text-gray-400 mt-2 leading-relaxed">Update your photo and personal details for your account profile.</p>
            </div>
            <div className="md:col-span-2 space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <img 
                  src="https://ui-avatars.com/api/?name=Budi+Santoso&background=1a56db&color=fff&font-size=0.4"
                  alt="Profile" 
                  className="w-20 h-20 rounded-3xl object-cover ring-4 ring-gray-50"
                />
                <div className="flex gap-3">
                   <button className="bg-brand-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-brand-600 transition-all">Change Photo</button>
                   <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">Remove</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">First Name</label>
                  <input type="text" defaultValue="Budi" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Last Name</label>
                  <input type="text" defaultValue="Santoso" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">Email Address</label>
                <input type="email" defaultValue="budi.santoso@eduquest.ai" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-50/50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-gray-100"></div>

          {/* Section 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-base font-bold text-gray-900">Notifications</h3>
              <p className="text-sm font-medium text-gray-400 mt-2 leading-relaxed">Control how you receive updates and activity alerts.</p>
            </div>
            <div className="md:col-span-2 space-y-4">
              {[
                { label: 'Weekly Activity Summary', desc: 'Get a digest of your created questions and uploads.', active: true },
                { label: 'System Announcements', desc: 'Receive updates about new AI models and features.', active: false },
                { label: 'Security Alerts', desc: 'Important notifications about account security.', active: true }
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all group">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${pref.active ? 'bg-brand-500 text-white' : 'bg-white text-gray-300 group-hover:text-gray-500 transition-colors'}`}>
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{pref.label}</p>
                      <p className="text-xs font-medium text-gray-400 mt-0.5">{pref.desc}</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${pref.active ? 'bg-brand-500' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${pref.active ? 'right-1' : 'left-1'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-4">
          <button className="px-6 py-3 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">Reset to Defaults</button>
          <button className="flex items-center gap-2.5 px-8 py-3 bg-brand-500 text-white rounded-2xl text-sm font-bold hover:bg-brand-600 transition-all shadow-lg active:scale-95">
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
