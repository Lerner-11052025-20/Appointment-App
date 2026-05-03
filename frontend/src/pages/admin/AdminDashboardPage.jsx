import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminDashboard } from '../../services/adminService';
import AdminShell from '../../components/admin/AdminShell';

const StatCard = ({ label, value, color, icon, loading }) => (
  <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] hover:-translate-y-1 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>
      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${color}`}>{label}</span>
    </div>
    <p className={`text-4xl font-black tracking-tight ${color}`}>{loading ? '···' : value}</p>
  </div>
);

const HealthBar = ({ label, current, total, color }) => {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">{label}</span>
        <span className={`text-xs font-black ${color}`}>{pct}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${color === 'text-emerald-600' ? 'from-emerald-400 to-emerald-600' : color === 'text-violet-600' ? 'from-violet-400 to-violet-600' : color === 'text-cyan-600' ? 'from-cyan-400 to-cyan-600' : 'from-amber-400 to-amber-600'}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-slate-400 font-medium">{current} of {total}</p>
    </div>
  );
};

export default function AdminDashboardPage() {
  const { showToast } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getAdminDashboard()
      .then(r => setData(r.data))
      .catch(() => { setError(true); showToast('Failed to load dashboard.', 'error'); })
      .finally(() => setLoading(false));
  }, []);

  const s = data?.stats || {};

  if (error && !loading) {
    return (
      <AdminShell>
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl mb-6">⚠</div>
          <h2 className="text-xl font-black text-slate-800 mb-2">Failed to Load Dashboard</h2>
          <p className="text-sm text-slate-500 mb-6">There was an error fetching system data.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all">
            Retry
          </button>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Control Center</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">Monitor users, providers, appointments, and platform activity from one command layer.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Users" value={s.totalUsers} color="text-violet-600" icon="◉" loading={loading} />
        <StatCard label="Providers" value={s.totalOrganisers} color="text-indigo-600" icon="◎" loading={loading} />
        <StatCard label="Appointments" value={s.totalAppointments} color="text-cyan-600" icon="◆" loading={loading} />
        <StatCard label="Bookings" value={s.totalBookings} color="text-blue-600" icon="◈" loading={loading} />
        <StatCard label="Active" value={s.activeUsers} color="text-emerald-600" icon="◇" loading={loading} />
        <StatCard label="Pending" value={s.pendingBookings} color="text-amber-600" icon="◐" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-6">System Health</h2>
          <div className="space-y-5">
            <HealthBar label="Active Users" current={s.activeUsers || 0} total={s.totalUsers || 1} color="text-emerald-600" />
            <HealthBar label="Published Services" current={s.publishedAppointments || 0} total={s.totalAppointments || 1} color="text-violet-600" />
            <HealthBar label="Confirmed Bookings" current={s.confirmedBookings || 0} total={s.totalBookings || 1} color="text-cyan-600" />
            <HealthBar label="Pending Approvals" current={s.pendingBookings || 0} total={s.totalBookings || 1} color="text-amber-600" />
          </div>
        </div>

        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-6">Role Distribution</h2>
          <div className="space-y-4">
            {(data?.roleDistribution || []).map((r) => {
              const total = s.totalUsers || 1;
              const pct = Math.round((r.value / total) * 100);
              const colors = r.name === 'Customers' ? 'from-cyan-400 to-cyan-600' : r.name === 'Organisers' ? 'from-violet-400 to-violet-600' : 'from-rose-400 to-rose-600';
              const textColor = r.name === 'Customers' ? 'text-cyan-600' : r.name === 'Organisers' ? 'text-violet-600' : 'text-rose-600';
              return (
                <div key={r.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-700">{r.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-black ${textColor}`}>{r.value}</span>
                      <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${colors} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-6">Booking Status</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-44 h-44">
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-3xl font-black text-slate-900">{loading ? '···' : s.totalBookings}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</p>
              </div>
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  const total = s.totalBookings || 1;
                  const segments = [
                    { value: s.confirmedBookings || 0, color: '#10b981' },
                    { value: s.pendingBookings || 0, color: '#f59e0b' },
                    { value: s.cancelledBookings || 0, color: '#f43f5e' },
                    { value: s.completedBookings || 0, color: '#6366f1' },
                  ];
                  let offset = 0;
                  const circumference = 2 * Math.PI * 42;
                  return segments.map((seg, i) => {
                    const pct = seg.value / total;
                    const dash = pct * circumference;
                    const el = <circle key={i} cx="50" cy="50" r="42" fill="none" stroke={seg.color} strokeWidth="8" strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={-offset} strokeLinecap="round" className="transition-all duration-700" />;
                    offset += dash;
                    return el;
                  });
                })()}
              </svg>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              { label: 'Confirmed', value: s.confirmedBookings, color: 'bg-emerald-500' },
              { label: 'Pending', value: s.pendingBookings, color: 'bg-amber-500' },
              { label: 'Cancelled', value: s.cancelledBookings, color: 'bg-rose-500' },
              { label: 'Completed', value: s.completedBookings, color: 'bg-indigo-500' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${b.color}`} />
                <span className="text-xs font-bold text-slate-600">{b.label}: {loading ? '·' : b.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-6">Recent Activity</h2>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
            {(data?.recentUsers || []).map((u) => (
              <div key={u._id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-black shrink-0">
                  {u.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{u.fullName}</p>
                  <p className="text-[10px] text-slate-400">{u.role} · {new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${u.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
            {(!data?.recentUsers || data.recentUsers.length === 0) && !loading && (
              <p className="text-sm text-slate-400 text-center py-8">No recent users.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Manage Users', path: '/admin/users', icon: '◎', desc: 'View, search & control accounts' },
          { label: 'Manage Providers', path: '/admin/providers', icon: '◈', desc: 'Monitor service providers' },
          { label: 'View Activity', path: '/admin/activity', icon: '◇', desc: 'Recent platform events' },
          { label: 'Appointments', path: '/admin/appointments', icon: '◆', desc: 'Browse appointment types' },
        ].map(a => (
          <button
            key={a.path}
            onClick={() => navigate(a.path)}
            className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.04)] hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)] transition-all duration-300 text-left group"
          >
            <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity block mb-3">{a.icon}</span>
            <p className="text-sm font-black text-slate-800 mb-1">{a.label}</p>
            <p className="text-[10px] text-slate-400 font-medium">{a.desc}</p>
          </button>
        ))}
      </div>
    </AdminShell>
  );
}
