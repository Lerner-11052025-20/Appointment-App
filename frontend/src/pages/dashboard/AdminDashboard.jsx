import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminStats } from '../../services/userService';

export default function AdminDashboard() {
  const { user, logout, showToast } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(r => setStats(r.data))
      .catch(() => showToast('Failed to load admin stats.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface-50 relative overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gradient-brand">SlotIQ</span>
          </div>
          <button onClick={logout} className="btn-ghost text-sm py-2 px-4">Logout</button>
        </div>

        <div className="glass-card-strong p-8 animate-slide-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              ⚙
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
              <p className="text-sm text-slate-500">Platform-wide control panel</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="float-card text-center">
              <p className="text-3xl font-bold text-brand-600">{loading ? '...' : stats.totalUsers}</p>
              <p className="text-xs text-slate-500 mt-1">Total Users</p>
            </div>
            <div className="float-card text-center">
              <p className="text-3xl font-bold text-emerald-600">{loading ? '...' : stats.totalProviders}</p>
              <p className="text-xs text-slate-500 mt-1">Total Providers</p>
            </div>
            <div className="float-card text-center">
              <p className="text-3xl font-bold text-cyan-600">{loading ? '...' : stats.totalAppointments}</p>
              <p className="text-xs text-slate-500 mt-1">Total Appointments</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-700 font-medium">🔐 Role: <span className="font-bold uppercase tracking-wide">System Admin</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}