import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAppointments, deleteAppointment } from '../../services/appointmentService';
import AppointmentStudioLayout from '../../components/appointment/AppointmentStudioLayout';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import ShareLinkModal from '../../components/appointment/ShareLinkModal';

export default function AppointmentListPage() {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const base = user?.role === 'admin' ? '/admin' : '/organiser';
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [shareTarget, setShareTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (filter !== 'all') params.status = filter;
      const res = await getAppointments(params);
      setAppointments(res.data || []);
    } catch { showToast('Failed to load appointments.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, filter]);

  const handleEdit = (a) => navigate(`${base}/appointments/${a._id}/edit`);
  const handleShare = (a) => setShareTarget(a);

  const Skeleton = () => (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-white/50 rounded-[1.75rem] border border-slate-100" />
      ))}
    </div>
  );

  return (
    <AppointmentStudioLayout>
      {}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Appointment Studio</h1>
        <p className="text-slate-500 mt-1">Design, publish, and control every booking experience.</p>
      </div>

      {}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <button onClick={() => navigate(`${base}/appointments/new`)} className="btn-brand !rounded-xl !py-2.5 !px-5 !text-sm shrink-0">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New
        </button>
        <div className="flex-1 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search appointments..." className="input-premium !rounded-xl !pl-10 w-full" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input-premium !rounded-xl !w-auto !text-sm">
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      {}
      {loading ? <Skeleton /> : appointments.length === 0 ? (
        <div className="glass-card-strong p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">No appointments yet</h3>
          <p className="text-sm text-slate-400 mb-5">Create your first booking experience.</p>
          <button onClick={() => navigate(`${base}/appointments/new`)} className="btn-brand !rounded-xl !py-2.5 !px-6 !text-sm mx-auto">Create First Appointment</button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(a => <AppointmentCard key={a._id} appointment={a} onShare={handleShare} onEdit={handleEdit} />)}
        </div>
      )}

      {shareTarget && <ShareLinkModal appointment={shareTarget} onClose={() => setShareTarget(null)} />}
    </AppointmentStudioLayout>
  );
}