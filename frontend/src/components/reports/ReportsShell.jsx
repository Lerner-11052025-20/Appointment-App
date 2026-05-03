import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/reports', label: 'Overview', icon: '◉' },
  { path: '/reports/peak-hours', label: 'Peak Hours', icon: '◎' },
  { path: '/reports/provider-utilization', label: 'Provider Load', icon: '◈' },
];

export default function ReportsShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const backPath = user?.role === 'admin' ? '/admin/dashboard' : '/organiser/dashboard';

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-violet-200/25 rounded-full blur-[120px]" />
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] bg-cyan-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-amber-100/15 rounded-full blur-[100px]" />
      </div>

      <header className="sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl px-6 py-3 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(backPath)} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">← Back</button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white text-xs font-black">◉</div>
              <span className="text-sm font-black text-slate-800 hidden sm:block">Insight Observatory</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Live</span>
            </div>
            <span className="text-xs font-bold text-slate-500 hidden sm:block">{user?.fullName}</span>
            <button onClick={logout} className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <nav className="px-6 mb-6">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/reports'}
              className={({ isActive }) => `px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${isActive
                ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-violet-500/25'
                : 'bg-white/60 text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="mr-1.5">{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
