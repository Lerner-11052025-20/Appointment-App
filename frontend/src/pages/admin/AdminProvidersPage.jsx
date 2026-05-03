import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProviders } from '../../services/adminService';
import AdminShell from '../../components/admin/AdminShell';

export default function AdminProvidersPage() {
  const { showToast } = useAuth();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProviders()
      .then(r => setProviders(r.data))
      .catch(() => showToast('Failed to load providers.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Provider Nodes</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">Monitor service providers and their appointment ecosystem.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white/60 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-16 shadow-[0_24px_80px_rgba(15,23,42,0.06)] text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-violet-50 flex items-center justify-center text-2xl mb-4">◈</div>
          <h3 className="text-lg font-bold text-slate-800">No Providers Found</h3>
          <p className="text-sm text-slate-500 mt-1">No organiser accounts exist on the platform yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {providers.map(p => {
            const maxBookings = Math.max(...providers.map(pr => pr.totalBookingsCount || 0), 1);
            const utilPct = Math.round(((p.totalBookingsCount || 0) / maxBookings) * 100);
            const utilLabel = utilPct >= 80 ? 'High Load' : utilPct >= 50 ? 'Healthy' : 'Available';
            const utilColor = utilPct >= 80 ? 'text-rose-600' : utilPct >= 50 ? 'text-emerald-600' : 'text-cyan-600';
            const barColor = utilPct >= 80 ? 'from-rose-400 to-rose-600' : utilPct >= 50 ? 'from-emerald-400 to-emerald-600' : 'from-cyan-400 to-cyan-600';

            return (
              <div key={p._id} className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-violet-500/20">
                      {p.fullName?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${p.isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate">{p.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{p.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="p-3 rounded-xl bg-slate-50/80 text-center">
                    <p className="text-lg font-black text-violet-600">{p.appointmentTypesCount}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Services</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50/80 text-center">
                    <p className="text-lg font-black text-indigo-600">{p.publishedAppointmentsCount}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Published</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50/80 text-center">
                    <p className="text-lg font-black text-cyan-600">{p.totalBookingsCount}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Bookings</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-500">Utilization</span>
                    <span className={`text-[10px] font-black ${utilColor}`}>{utilLabel} · {utilPct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`} style={{ width: `${utilPct}%` }} />
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/admin/users/${p._id}`)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-colors"
                >
                  View Details →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
