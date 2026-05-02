import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AppointmentStudioLayout({ children }) {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const base = user?.role === 'admin' ? '/admin' : '/organiser';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ede9fe_0%,transparent_35%),radial-gradient(circle_at_bottom_right,#cffafe_0%,transparent_30%)] bg-surface-50">
      {}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
          <Link to={`${base}/dashboard`} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-brand">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <span className="text-lg font-bold text-gradient-brand hidden sm:inline">SlotIQ</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link to={`${base}/appointments`} className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${loc.pathname.includes('/appointments') ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>Studio</Link>
            <button className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">Reporting</button>
            <button className="px-3.5 py-1.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all">Settings</button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <button onClick={logout} className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">{children}</main>
    </div>
  );
}