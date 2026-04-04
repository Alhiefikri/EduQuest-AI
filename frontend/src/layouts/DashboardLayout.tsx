import { Outlet, useLocation } from 'react-router-dom';
import { Bell, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-[88px] bg-white/80 backdrop-blur-md border-b-2 border-slate-100 px-10 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center text-xs font-black uppercase tracking-widest text-slate-400">
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Workspace</span>
            <ChevronRight className="mx-3 w-4 h-4 text-slate-300" strokeWidth={3} />
            <span className="text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full shadow-sm">{location.pathname === '/' ? 'Overview' : location.pathname.split('/')[1].replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={3} />
              <Input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-12 pr-4 h-11 bg-slate-50 border-2 border-transparent focus-visible:border-brand-200 focus-visible:ring-0 rounded-xl text-sm font-bold w-72 shadow-inner transition-all uppercase placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="border-2 border-slate-200 bg-white hover:bg-slate-50 shadow-sm hover:translate-y-[-1px] transition-all rounded-xl relative w-11 h-11">
                <Bell className="w-5 h-5 text-slate-500" strokeWidth={2.5} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </Button>
            </div>
            
            <div className="w-[1px] h-8 bg-slate-200 mx-1"></div>
            
            <button className="flex items-center gap-4 px-2 py-1 hover:bg-slate-50 transition-all border-2 border-transparent hover:border-slate-100 rounded-2xl group">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight leading-tight">Budi Santoso</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Senior Educator</p>
              </div>
              <div className="relative">
                <img 
                  src="https://ui-avatars.com/api/?name=Budi+Santoso&background=1a56db&color=fff&font-size=0.4"
                  alt="User Profil" 
                  className="w-11 h-11 border-2 border-slate-200 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 overflow-y-auto w-full relative bg-white">
          <div className="px-4 py-8 md:px-10 md:py-12 max-w-[1400px] mx-auto animate-in fade-in relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
