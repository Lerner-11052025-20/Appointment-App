import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: 'Command Center', icon: '◉' },
  { path: '/admin/users', label: 'User Registry', icon: '◎' },
  { path: '/admin/providers', label: 'Provider Nodes', icon: '◈' },
  { path: '/admin/activity', label: 'Activity Stream', icon: '◇' },
  { path: '/admin/appointments', label: 'Appointments', icon: '◆' },
  { path: '/admin/reports', label: 'Reports & Insights', icon: '◐' },
];

export default function AdminShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-violet-200/30 rounded-full blur-[120px]" />
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] bg-cyan-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] bg-amber-100/20 rounded-full blur-[100px]" />
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg flex items-center justify-center text-slate-600"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      <aside className={`fixed top-0 left-0 z-40 h-screen w-[260px] pt-6 pb-6 px-4 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex-1 flex flex-col bg-white/75 backdrop-blur-2xl border border-white/70 rounded-[2rem] shadow-[0_24px_80px_rgba(15,23,42,0.08)] p-5 overflow-hidden">
          <div className="flex items-center gap-3 mb-8 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-violet-500/30">⬡</div>
            <div>
              <p className="text-sm font-black text-slate-900 tracking-tight leading-none">SlotIQ</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Admin</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group ${isActive
                  ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-violet-500/25'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className="text-base opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                {user?.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors text-left">
              ← Sign Out
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={() => setSidebarOpen(false)} />}

      <main className="lg:ml-[260px] relative z-10 min-h-screen">
        <header className="sticky top-0 z-20 px-6 lg:px-10 py-4">
          <div className="flex items-center justify-between bg-white/60 backdrop-blur-xl border border-white/50 rounded-2xl px-6 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">System Online</span>
              </div>
              <span className="text-xs font-medium text-slate-400 hidden sm:block">{today}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 hidden sm:block">{user?.fullName}</span>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">
                {user?.fullName?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-10 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
