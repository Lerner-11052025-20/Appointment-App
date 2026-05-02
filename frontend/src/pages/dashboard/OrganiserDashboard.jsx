import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getOrganiserStats } from '../../services/userService';

export default function OrganiserDashboard() {
  const { user, logout, showToast } = useAuth();
  const [stats, setStats] = useState({
    activeServices: 0,
    totalBookings: 0,
    totalResources: 0,
    pendingConfirm: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrganiserStats()
      .then(r => setStats(r.data))
      .catch(() => showToast('Failed to load dashboard stats.', 'error'))
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
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.fullName}!</h1>
              <p className="text-sm text-slate-500">Manage your services and appointments</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
            <div className="float-card text-center">
              <p className="text-3xl font-bold text-brand-600">{loading ? '...' : stats.activeServices}</p>
              <p className="text-xs text-slate-500 mt-1">Active Services</p>
            </div>
            <div className="float-card text-center">
              <p className="text-3xl font-bold text-cyan-600">{loading ? '...' : stats.totalBookings}</p>
              <p className="text-xs text-slate-500 mt-1">Total Bookings</p>
            </div>
            <div className="float-card text-center">
              <p className="text-3xl font-bold text-emerald-600">{loading ? '...' : stats.totalResources}</p>
              <p className="text-xs text-slate-500 mt-1">Resources</p>
            </div>
            <div className="float-card text-center">
              <p className="text-3xl font-bold text-amber-500">{loading ? '...' : stats.pendingConfirm}</p>
              <p className="text-xs text-slate-500 mt-1">Pending Confirm</p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-brand-50/50 border border-brand-100">
            <p className="text-sm text-brand-700 font-medium">🏢 Role: <span className="font-bold uppercase tracking-wide">Organiser</span></p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a href="/organiser/appointments" className="flex-1 text-center py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all">
              🎯 Appointment Studio
            </a>
            <a href="/organiser/resources" className="flex-1 text-center py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 active:scale-[0.98] transition-all">
              🏢 Manage Resources
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}