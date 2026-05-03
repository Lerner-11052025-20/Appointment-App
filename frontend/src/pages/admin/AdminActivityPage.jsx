import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPlatformActivity } from '../../services/adminService';
import AdminShell from '../../components/admin/AdminShell';

const ACTIVITY_ICONS = { user: '◉', appointment: '◆', booking: '◈' };
const ACTIVITY_COLORS = { user: 'from-violet-400 to-indigo-500', appointment: 'from-cyan-400 to-blue-500', booking: 'from-emerald-400 to-emerald-600' };

export default function AdminActivityPage() {
  const { showToast } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');

  useEffect(() => {
    getPlatformActivity()
      .then(r => setData(r.data))
      .catch(() => showToast('Failed to load activity.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const tabs = [
    { key: 'users', label: 'Recent Signups', icon: '◉' },
    { key: 'appointments', label: 'New Services', icon: '◆' },
    { key: 'bookings', label: 'Recent Bookings', icon: '◈' },
  ];

  const renderTimeline = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-100/80 rounded-2xl animate-pulse" />)}
        </div>
      );
    }

    if (tab === 'users') {
      const items = data?.recentUsers || [];
      if (items.length === 0) return <EmptyState text="No recent signups." />;
      return items.map(u => (
        <TimelineItem key={u._id} type="user" title={u.fullName} subtitle={`${u.role} · ${u.email}`} date={u.createdAt} badge={u.isActive ? 'Active' : 'Inactive'} badgeColor={u.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} />
      ));
    }

    if (tab === 'appointments') {
      const items = data?.recentAppointments || [];
      if (items.length === 0) return <EmptyState text="No recent appointment types." />;
      return items.map(a => (
        <TimelineItem key={a._id} type="appointment" title={a.basicInfo?.title || 'Untitled'} subtitle={`By ${a.createdBy?.fullName || 'Unknown'}`} date={a.createdAt} badge={a.publish?.isPublished ? 'Published' : 'Draft'} badgeColor={a.publish?.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} />
      ));
    }

    if (tab === 'bookings') {
      const items = data?.recentBookings || [];
      if (items.length === 0) return <EmptyState text="No recent bookings." />;
      return items.map(b => (
        <TimelineItem key={b._id} type="booking" title={b.appointment?.basicInfo?.title || 'Booking'} subtitle={`By ${b.customer?.fullName || 'Customer'}`} date={b.createdAt} badge={b.status} badgeColor={b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : b.status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'} />
      ));
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Activity Stream</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">Recent platform events and operations.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${tab === t.key
              ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-violet-500/25'
              : 'bg-white/60 text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="mr-1.5">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div className="space-y-3">
          {renderTimeline()}
        </div>
      </div>
    </AdminShell>
  );
}

function TimelineItem({ type, title, subtitle, date, badge, badgeColor }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ACTIVITY_COLORS[type]} flex items-center justify-center text-white text-sm font-black shrink-0`}>
        {ACTIVITY_ICONS[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800 truncate">{title}</p>
        <p className="text-[10px] text-slate-400">{subtitle}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${badgeColor}`}>{badge}</span>
        <span className="text-[10px] text-slate-400">{new Date(date).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center py-16">
      <div className="w-14 h-14 rounded-3xl bg-slate-100 flex items-center justify-center text-xl mb-3">📭</div>
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}
