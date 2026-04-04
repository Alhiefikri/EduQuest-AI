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
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r-4 border-black flex flex-col items-stretch z-20 shadow-[4px_0px_0px_0px_rgba(0,0,0,1)]">
        <div className="pt-8 pb-8 px-8 border-b-4 border-black">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-[#00f0ff] border-4 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-3 hover:rotate-0 transition-transform">
              <Plus className="w-6 h-6" strokeWidth={3} />
            </div>
            <h1 className="text-black text-2xl font-black uppercase tracking-tighter">EduQuest AI</h1>
          </div>
          <p className="text-black text-xs tracking-widest uppercase font-black ml-1 mt-2 bg-[#ffc900] inline-block px-2 border-2 border-black">The Cognitive Sanctuary</p>
        </div>
        
        <nav className="flex-1 px-6 space-y-3 py-8 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center justify-between px-4 py-3 border-4 border-transparent transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#ff90e8] border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' 
                    : 'text-gray-600 hover:border-black hover:bg-gray-100 hover:text-black'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <item.icon className="w-6 h-6 flex-shrink-0" strokeWidth={isActive ? 3 : 2} />
                  <span className="font-black uppercase tracking-widest text-sm">{item.name}</span>
                </div>
                {isActive && <div className="w-2 h-2 bg-black"></div>}
              </Link>
            )
          })}
          
          <div className="pt-8 pb-4">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Recent Activity</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 group cursor-pointer border-l-4 border-red-400 pl-3 hover:border-black transition-colors">
                <span className="text-sm font-bold text-gray-600 group-hover:text-black uppercase">Ujian Akhir Fisika</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer border-l-4 border-[#00f0ff] pl-3 hover:border-black transition-colors">
                <span className="text-sm font-bold text-gray-600 group-hover:text-black uppercase">Kuis Biologi Sel</span>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-6 border-t-4 border-black bg-gray-50">
          <Button asChild className="w-full bg-black text-white hover:bg-black/80 flex items-center justify-center gap-3 py-6 border-4 border-black text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-6 rounded-none">
            <Link to="/soal/generate">
              <Plus className="w-5 h-5" strokeWidth={3} /> Create Question
            </Link>
          </Button>
          
          <div className="space-y-2">
            <Link to="/settings" className="flex items-center gap-4 px-4 py-3 text-sm font-black text-gray-600 hover:bg-[#ffc900] hover:text-black hover:border-4 hover:border-black transition-all uppercase tracking-widest border-4 border-transparent">
              <Settings className="w-5 h-5" strokeWidth={2.5} /> Settings
            </Link>
            <Link to="/support" className="flex items-center gap-4 px-4 py-3 text-sm font-black text-gray-600 hover:bg-[#00f0ff] hover:text-black hover:border-4 hover:border-black transition-all uppercase tracking-widest border-4 border-transparent">
              <HelpCircle className="w-5 h-5" strokeWidth={2.5} /> Support
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-[88px] bg-white border-b-4 border-black px-10 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center text-sm font-black uppercase tracking-widest text-gray-400">
            <span className="hover:text-black cursor-pointer transition-colors">Workspace</span>
            <ChevronRight className="mx-3 w-5 h-5 text-black" strokeWidth={3} />
            <span className="text-black bg-[#ff90e8] border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{location.pathname === '/' ? 'Overview' : location.pathname.split('/')[1].replace('-', ' ')}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={3} />
              <Input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-12 pr-4 h-12 bg-white border-4 border-black focus-visible:ring-0 rounded-none text-sm font-bold w-72 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="border-4 border-black bg-white hover:bg-[#ffc900] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none relative">
                <Bell className="w-5 h-5 text-black" strokeWidth={2.5} />
                <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-none border-2 border-black"></span>
              </Button>
            </div>
            
            <div className="w-1 h-10 bg-black mx-2"></div>
            
            <button className="flex items-center gap-4 px-2 py-1 hover:bg-gray-100 transition-all border-4 border-transparent hover:border-black group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-black uppercase tracking-widest leading-tight">Budi Santoso</p>
                <p className="text-xs font-bold text-gray-500 uppercase">Senior Educator</p>
              </div>
              <div className="relative">
                <img 
                  src="https://ui-avatars.com/api/?name=Budi+Santoso&background=000&color=fff&font-size=0.4"
                  alt="User Profil" 
                  className="w-12 h-12 border-4 border-black object-cover shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-black rounded-none"></div>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 overflow-y-auto w-full relative bg-[radial-gradient(circle_at_1px_1px,#e5e7eb_1px,transparent_0)] bg-[size:40px_40px]">
          <div className="px-4 py-8 md:px-10 md:py-12 max-w-[1400px] mx-auto animate-in fade-in relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
