import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BookOpen, LayoutTemplate, Plus, Settings, HelpCircle, Bell, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DashboardLayout() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Soal', href: '/soal', icon: FileText },
    { name: 'Modul Ajar', href: '/modul', icon: BookOpen },
    { name: 'Template Word', href: '/template', icon: LayoutTemplate },
  ];

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r-2 border-slate-200 flex flex-col items-stretch z-20 shadow-sm">
        <div className="pt-8 pb-8 px-8 border-b-2 border-slate-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-brand-500 border-2 border-black flex items-center justify-center text-white shadow-sm rounded-lg">
              <Plus className="w-6 h-6" strokeWidth={3} />
            </div>
            <h1 className="text-slate-900 text-2xl font-black uppercase tracking-tighter">EduQuest AI</h1>
          </div>
          <p className="text-slate-400 text-[10px] tracking-widest uppercase font-bold ml-1 mt-2 bg-slate-50 inline-block px-2 py-0.5 border border-slate-200 rounded-full">The Cognitive Sanctuary</p>
        </div>
        
        <nav className="flex-1 px-6 space-y-2 py-8 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-4 py-3 border-2 transition-all duration-200 rounded-xl ${
                  isActive 
                    ? 'bg-brand-50 border-brand-100 text-brand-600 shadow-sm' 
                    : 'text-slate-500 border-transparent hover:border-slate-100 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="font-bold uppercase tracking-wider text-[13px]">{item.name}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>}
              </Link>
            )
          })}
          
          <div className="pt-8 pb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4">Recent Activity</h3>
            <ul className="space-y-1">
              <li className="flex items-center gap-3 group cursor-pointer px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900 uppercase">Ujian Akhir Fisika</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"></div>
                <span className="text-[13px] font-semibold text-slate-600 group-hover:text-slate-900 uppercase">Kuis Biologi Sel</span>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-6 border-t-2 border-slate-100 bg-slate-50/50">
          <Button asChild className="w-full bg-brand-600 text-white hover:bg-brand-700 flex items-center justify-center gap-3 py-6 border-2 border-black text-sm font-black uppercase tracking-widest shadow-md hover:translate-y-[-2px] hover:shadow-lg mb-6 rounded-xl transition-all">
            <Link to="/soal/generate">
              <Plus className="w-5 h-5" strokeWidth={3} /> Create Question
            </Link>
          </Button>
          
          <div className="space-y-1">
            <Link to="/settings" className="flex items-center gap-4 px-4 py-2.5 text-[13px] font-bold text-slate-500 hover:bg-white hover:text-brand-600 hover:border-slate-200 transition-all uppercase tracking-widest border-2 border-transparent rounded-xl">
              <Settings className="w-5 h-5" strokeWidth={2.5} /> Settings
            </Link>
            <Link to="/support" className="flex items-center gap-4 px-4 py-2.5 text-[13px] font-bold text-slate-500 hover:bg-white hover:text-brand-600 hover:border-slate-200 transition-all uppercase tracking-widest border-2 border-transparent rounded-xl">
              <HelpCircle className="w-5 h-5" strokeWidth={2.5} /> Support
            </Link>
          </div>
        </div>
      </aside>

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
