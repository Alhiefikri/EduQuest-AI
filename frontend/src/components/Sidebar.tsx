import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  LayoutTemplate, 
  Plus, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Soal', href: '/soal', icon: FileText },
    { name: 'Modul Ajar', href: '/modul', icon: BookOpen },
    { name: 'Template Word', href: '/template', icon: LayoutTemplate },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside 
      className={cn(
        "flex-shrink-0 bg-white border-r-2 border-slate-200 flex flex-col items-stretch z-20 shadow-sm transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-20" : "w-72",
        className
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3.5 top-10 w-7 h-7 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-brand-600 hover:border-brand-100 shadow-sm z-30 transition-all"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Logo Area */}
      <div className={cn(
        "pt-8 pb-8 px-6 border-b-2 border-slate-100 overflow-hidden whitespace-nowrap",
        isCollapsed ? "px-4 flex justify-center" : "px-8"
      )}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-brand-500 border-2 border-black flex-shrink-0 flex items-center justify-center text-white shadow-sm rounded-lg">
            <Plus className="w-6 h-6" strokeWidth={3} />
          </div>
          {!isCollapsed && (
            <h1 className="text-slate-900 text-2xl font-black uppercase tracking-tighter">EduQuest AI</h1>
          )}
        </div>
        {!isCollapsed && (
          <p className="text-slate-400 text-[10px] tracking-widest uppercase font-bold ml-1 mt-2 bg-slate-50 inline-block px-2 py-0.5 border border-slate-200 rounded-full">
            The Cognitive Sanctuary
          </p>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 py-8 overflow-y-auto overflow-x-hidden">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-4 py-3 border-2 transition-all duration-200 rounded-xl group relative",
                isActive 
                  ? 'bg-brand-50 border-brand-100 text-brand-600 shadow-sm' 
                  : 'text-slate-500 border-transparent hover:border-slate-100 hover:bg-slate-50 hover:text-slate-900',
                isCollapsed ? "justify-center px-0 w-12 h-12 mx-auto" : "justify-between"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <div className="flex items-center gap-3.5">
                <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                {!isCollapsed && (
                  <span className="font-bold uppercase tracking-wider text-[13px]">{item.name}</span>
                )}
              </div>
              {isActive && !isCollapsed && <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>}
              {isActive && isCollapsed && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-500 rounded-l-full" />
              )}
            </Link>
          )
        })}
        
        {!isCollapsed && (
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
        )}
      </nav>

      {/* Footer Area */}
      <div className={cn(
        "p-6 border-t-2 border-slate-100 bg-slate-50/50",
        isCollapsed && "p-4 flex flex-col items-center"
      )}>
        <Button 
          asChild 
          className={cn(
            "bg-brand-600 text-white hover:bg-brand-700 flex items-center justify-center border-2 border-black font-black uppercase tracking-widest shadow-md hover:translate-y-[-2px] hover:shadow-lg mb-6 rounded-xl transition-all",
            isCollapsed ? "w-11 h-11 p-0 px-0" : "w-full py-6 gap-3 text-sm"
          )}
        >
          <Link to="/soal/generate">
            <Plus className="w-6 h-6" strokeWidth={3} />
            {!isCollapsed && "Create Question"}
          </Link>
        </Button>
        
        <div className="space-y-1 w-full">
          <Link 
            to="/settings" 
            className={cn(
              "flex items-center gap-4 py-2.5 text-[13px] font-bold text-slate-500 hover:bg-white hover:text-brand-600 hover:border-slate-200 transition-all uppercase tracking-widest border-2 border-transparent rounded-xl",
              isCollapsed ? "justify-center px-0" : "px-4"
            )}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
            {!isCollapsed && "Settings"}
          </Link>
          <Link 
            to="/support" 
            className={cn(
              "flex items-center gap-4 py-2.5 text-[13px] font-bold text-slate-500 hover:bg-white hover:text-brand-600 hover:border-slate-200 transition-all uppercase tracking-widest border-2 border-transparent rounded-xl",
              isCollapsed ? "justify-center px-0" : "px-4"
            )}
            title={isCollapsed ? "Support" : undefined}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
            {!isCollapsed && "Support"}
          </Link>
        </div>
      </div>
    </aside>
  );
}
