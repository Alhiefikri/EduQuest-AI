import { Outlet, useLocation } from 'react-router-dom';
import { Bell, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50/30 font-sans overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header: Compact & Professional */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center text-xs font-black uppercase tracking-widest text-slate-600">
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Workspace</span>
            <ChevronRight className="mx-2 w-4 h-4 text-slate-400" strokeWidth={3} />
            <span className="text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">{location.pathname === '/' ? 'Overview' : location.pathname.split('/')[1].replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 h-10 bg-slate-50 border-transparent focus-visible:border-slate-200 focus-visible:ring-0 rounded-lg text-xs font-bold w-48 shadow-inner transition-all uppercase placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-lg relative hover:bg-slate-50">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </Button>
            </div>
            
            <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
            
            <button className="flex items-center gap-3 px-1.5 py-1 hover:bg-slate-50 transition-all rounded-lg group">
              <div className="text-right hidden sm:block">
                <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight leading-none">Budi Santoso</p>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest mt-1">Administrator</p>
              </div>
              <div className="relative">
                <img 
                  src="https://ui-avatars.com/api/?name=Budi+Santoso&background=1a56db&color=fff&font-size=0.4"
                  alt="User" 
                  className="w-10 h-10 border-2 border-slate-100 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
                />
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Outlet: High Density Content Container */}
        <main className="flex-1 overflow-y-auto w-full relative bg-white">
          <div className="px-4 py-6 md:px-6 md:py-8 max-w-[1600px] mx-auto animate-in fade-in relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
