import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  BarChart3, 
  ArrowRightLeft, 
  Search, 
  TrendingUp 
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'District Deep-Dive', path: '/districts', icon: Search },
    { name: 'State Comparison', path: '/compare', icon: ArrowRightLeft },
    { name: 'Geospatial Map', path: '/map', icon: MapIcon },
    { name: 'Trends & Forecasting', path: '/trends', icon: TrendingUp },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#FDFCF8] border-r border-slate-100 hidden lg:flex flex-col z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 bg-[#8B4513] rounded-2xl flex items-center justify-center shadow-lg shadow-amber-900/20">
            <BarChart3 className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1A1A1A] tracking-tighter">CENSUS</h1>
            <p className="text-[10px] text-[#8B4513] font-bold tracking-widest uppercase">Analytics Pro</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#F5F0E6] text-[#8B4513] shadow-sm' 
                    : 'text-slate-500 hover:bg-[#F3F4F6] hover:text-[#1A1A1A]'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
