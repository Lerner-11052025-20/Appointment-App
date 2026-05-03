import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';

export default function MyAppointmentsPage() {
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getMyBookings();
      setBookings(res.data || []);
    } catch { showToast('Failed to load bookings', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancelBooking(cancelTarget._id, cancelReason);
      showToast('Booking cancelled successfully', 'success');
      setCancelTarget(null);
      setCancelReason('');

      navigate(`/customer/book/${cancelTarget.appointment?._id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel', 'error');
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'confirmed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'pending') return 'bg-amber-50 text-amber-600 border-amber-200';
    if (status === 'cancelled') return 'bg-rose-50 text-rose-600 border-rose-200';
    if (status === 'rescheduled') return 'bg-blue-50 text-blue-600 border-blue-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20 pt-12">
      <div className="max-w-3xl mx-auto px-4 md:px-0">

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-1">My Appointments</h1>
          <p className="text-sm text-slate-500">Manage your upcoming and past bookings.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-28 bg-white border border-slate-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-1">No bookings yet</h3>
            <p className="text-sm text-slate-500 mb-6">Looks like you haven't booked anything yet.</p>
            <button onClick={() => navigate('/customer/appointments')} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">Explore Services</button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const isPast = new Date(b.bookingDate) < new Date(new Date().setHours(0,0,0,0));
              const isActive = b.status === 'confirmed' || b.status === 'pending';








              const appointmentDateTime = new Date(`${b.bookingDate}T${b.startTime}`);
              const hoursUntil = (appointmentDateTime - new Date()) / (1000 * 60 * 60);
              const hasRescheduled = b.rescheduleHistory && b.rescheduleHistory.length >= 1;
              const isWithin24Hours = hoursUntil < 24;






              return (
                <div key={b._id} className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm flex flex-col md:flex-row md:items-center gap-5 transition-colors hover:border-slate-300">

                  <div className="bg-slate-50 rounded-xl p-3 text-center min-w-[80px] border border-slate-100 flex-shrink-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      {new Date(b.bookingDate).toLocaleString('default', { month: 'short' })}
                    </p>
                    <p className="text-2xl font-black text-slate-800 leading-none mb-1">
                      {new Date(b.bookingDate).getDate()}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500">{b.startTime}</p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-lg font-bold text-slate-900 truncate">{b.appointment?.basicInfo?.title || 'Unknown Service'}</h3>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${getStatusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      {b.providerUser && <p><span className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider mr-1">Provider</span>{b.providerUser.fullName}</p>}
                      {b.resource && <p><span className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider mr-1">Resource</span>{b.resource.name}</p>}
                      {b.selectedCapacity > 1 && <p><span className="font-semibold text-slate-400 uppercase text-[9px] tracking-wider mr-1">Seats</span>{b.selectedCapacity}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 mt-2 md:mt-0">
                    {!isPast && isActive && (
                      <>
                        <button
                          onClick={() => navigate(`/customer/bookings/${b._id}/reschedule`)}
                          disabled={hasRescheduled || isWithin24Hours}
                          title={hasRescheduled ? 'You can only reschedule once.' : isWithin24Hours ? 'Cannot reschedule within 24 hours of appointment.' : ''}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            hasRescheduled || isWithin24Hours
                              ? 'text-slate-400 bg-slate-50 border-slate-100 cursor-not-allowed opacity-70'
                              : 'text-slate-600 bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                          }`}
                        >Reschedule</button>
                        <button
                          onClick={() => setCancelTarget(b)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors"
                        >Cancel</button>
                      </>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Cancel Appointment?</h3>
            <p className="text-sm text-slate-500 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>

            <textarea
              value={cancelReason} onChange={e => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)"
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-brand-500 text-sm mb-6" rows={3}
            />

            <div className="flex gap-3">
              <button onClick={() => setCancelTarget(null)} disabled={cancelling} className="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">Keep It</button>
              <button onClick={handleCancelConfirm} disabled={cancelling} className="flex-1 px-4 py-2 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm">
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}