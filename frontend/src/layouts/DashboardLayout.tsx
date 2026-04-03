import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BookOpen, LayoutTemplate, Plus, Settings, HelpCircle, Bell, Search, ChevronRight } from 'lucide-react';

export default function DashboardLayout() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Soal', href: '/soal', icon: FileText },
    { name: 'Modul Ajar', href: '/modul', icon: BookOpen },
    { name: 'Template Word', href: '/template', icon: LayoutTemplate },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col items-stretch z-20">
        <div className="pt-8 pb-8 px-8">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
              <Plus className="w-5 h-5" strokeWidth={3} />
            </div>
            <h1 className="text-gray-900 text-xl font-bold tracking-tight">EduQuest AI</h1>
          </div>
          <p className="text-gray-400 text-[10px] tracking-[0.2em] uppercase font-bold ml-0.5">The Cognitive Sanctuary</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-50 text-brand-500 shadow-xs' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>}
              </Link>
            )
          })}
          
          <div className="pt-8 pb-4 px-4">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors truncate">Ujian Akhir Fisika</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-brand-400"></div>
                <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors truncate">Kuis Biologi Sel</span>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-6 space-y-2 mt-auto">
          <Link to="/soal/generate" className="w-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg mb-6">
            <Plus className="w-4 h-4" strokeWidth={3} /> Create Question
          </Link>
          
          <Link to="/settings" className="flex items-center gap-3.5 px-4 py-2.5 text-[14px] font-semibold text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
            <Settings className="w-5 h-5" /> Settings
          </Link>
          <Link to="/support" className="flex items-center gap-3.5 px-4 py-2.5 text-[14px] font-semibold text-gray-500 hover:bg-gray-50 rounded-xl transition-all">
            <HelpCircle className="w-5 h-5" /> Support
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-[80px] bg-white/80 backdrop-blur-md border-b border-gray-200 px-10 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center text-sm font-semibold text-gray-400">
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Workspace</span>
            <ChevronRight className="mx-2 w-4 h-4 text-gray-300" />
            <span className="text-gray-900 capitalize">{location.pathname === '/' ? 'Overview' : location.pathname.split('/')[1].replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-10 pr-4 py-2 bg-gray-50 border-transparent border focus:border-brand-200 focus:bg-white rounded-xl text-sm w-64 transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            
            <div className="w-[1px] h-8 bg-gray-200 mx-1"></div>
            
            <button className="flex items-center gap-3.5 pl-2 pr-1 py-1 hover:bg-gray-50 rounded-2xl transition-all group">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-gray-900 leading-tight">Budi Santoso</p>
                <p className="text-[11px] font-semibold text-gray-400">Senior Educator</p>
              </div>
              <div className="relative">
                <img 
                  src="https://ui-avatars.com/api/?name=Budi+Santoso&background=1a56db&color=fff&font-size=0.4"
                  alt="User Profil" 
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-brand-100 transition-all shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 overflow-y-auto px-10 py-10 w-full max-w-[1400px] mx-auto">
          <div className="animate-in fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
