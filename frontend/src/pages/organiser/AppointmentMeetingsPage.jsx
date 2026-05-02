import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAppointmentById, getAppointmentMeetings } from '../../services/appointmentService';
import AppointmentStudioLayout from '../../components/appointment/AppointmentStudioLayout';
import { updateBookingStatus } from '../../services/bookingService';

export default function AppointmentMeetingsPage() {
  const { id } = useParams();
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const base = user?.role === 'admin' ? '/admin' : '/organiser';
  const [appt, setAppt] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [a, m] = await Promise.all([getAppointmentById(id), getAppointmentMeetings(id)]);
      setAppt(a.data);
      setMeetings(m.data || []);
    } catch {
      showToast('Failed to load.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      showToast('Status updated!', 'success');

      setMeetings(prev => prev.map(m => m._id === bookingId ? { ...m, status: newStatus } : m));
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  if (loading) return <AppointmentStudioLayout><div className="flex justify-center py-20"><div className="loader-ring-brand w-10 h-10 rounded-full" /></div></AppointmentStudioLayout>;

  const isResourceType = appt?.bookingType?.type === 'resource';

  return (
    <AppointmentStudioLayout>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate(`${base}/appointments/${id}/edit`)} className="btn-ghost !py-2 !px-4 !text-xs !rounded-xl">← Back to Editor</button>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 shadow-sm transition-all">Reporting</button>
          <button className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 shadow-sm transition-all">Settings</button>
        </div>
      </div>

      <div className="glass-card-strong p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Meetings</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {appt?.basicInfo?.title} — {meetings.length} total
            </p>
          </div>
          <div className="relative">
             <input type="text" placeholder="Search by name..." className="input-premium !py-2 !px-4 !text-xs !rounded-xl w-64" />
          </div>
        </div>

        {meetings.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-2xl">📭</div>
            <h3 className="text-lg font-bold text-slate-800">No meetings yet</h3>
            <p className="text-sm text-slate-500">Your appointments will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subject</th>
                  <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Appointment</th>
                  <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Booked by</th>
                  {isResourceType && <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Resource</th>}
                  <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Start</th>
                  <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">End</th>
                  {isResourceType && <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Capacity</th>}
                  <th className="pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((m) => (
                  <tr key={m._id} className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                    <td className="py-5 px-4">
                      <p className="text-sm font-bold text-slate-800">{appt?.basicInfo?.title}</p>
                    </td>
                    <td className="py-5 px-4">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">{appt?.basicInfo?.title}</span>
                    </td>
                    <td className="py-5 px-4 text-sm font-medium text-slate-600">{m.customerName}</td>
                    {isResourceType && (
                      <td className="py-5 px-4 text-sm font-medium text-slate-600">
                        {m.resourceName || '—'}
                      </td>
                    )}
                    <td className="py-5 px-4 text-sm font-bold text-slate-700">{m.date} {m.time.split('-')[0]}</td>
                    <td className="py-5 px-4 text-sm font-bold text-slate-700">{m.time.split('-')[1] || '—'}</td>
                    {isResourceType && (
                      <td className="py-5 px-4 text-sm font-medium text-slate-600">
                        {m.selectedCapacity || 1}
                      </td>
                    )}
                    <td className="py-5 px-4 text-right">
                      <div className="inline-block relative">
                        <select
                          value={m.status || 'pending'}
                          onChange={(e) => handleStatusChange(m._id, e.target.value)}
                          className={`
                            appearance-none pl-4 pr-8 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer outline-none
                            ${m.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' :
                              m.status === 'cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' :
                              'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'}
                          `}
                        >
                          <option value="pending">Request</option>
                          <option value="confirmed">Booked</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppointmentStudioLayout>
  );
}