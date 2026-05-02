import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';

export default function ProfileAppointmentDetailsPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const res = await profileService.getMyProfileAppointmentDetails(bookingId);
      setBooking(res.data.data);
    } catch (err) {
      showToast('Failed to load booking details', 'error');
      navigate('/customer/profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="loader-ring-brand w-12 h-12 rounded-full" />
      </div>
    );
  }

  if (!booking) return null;

  const statusColors = {
    confirmed: 'bg-emerald-500 text-white',
    pending: 'bg-amber-500 text-white',
    cancelled: 'bg-rose-500 text-white',
    completed: 'bg-slate-500 text-white',
    rescheduled: 'bg-indigo-500 text-white'
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-100 py-6 px-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/customer/profile')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Profile
          </button>
          <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${statusColors[booking.status]}`}>
            {booking.status}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        {}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            {booking.appointment?.basicInfo?.title}
          </h1>
          <p className="text-slate-500 font-medium">Booking Reference: <span className="text-slate-900 font-bold">{booking._id.substring(18).toUpperCase()}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {}
          <div className="md:col-span-2 space-y-6">
            {}
            <div className="glass-card-strong p-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Schedule Information</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Date</p>
                  <p className="text-lg font-bold text-slate-800">{new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Time Window</p>
                  <p className="text-lg font-bold text-slate-800">{booking.startTime} - {booking.endTime}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</p>
                  <p className="text-lg font-bold text-slate-800">{booking.appointment?.basicInfo?.duration} {booking.appointment?.basicInfo?.durationUnit}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned To</p>
                  <p className="text-lg font-bold text-brand-600">{booking.providerUser?.fullName || booking.resource?.name || 'Any Available'}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Venue / Location</p>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shrink-0">
                    {booking.appointment?.basicInfo?.isOnline ? '🌐' : '📍'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{booking.appointment?.basicInfo?.isOnline ? 'Online Meeting' : booking.appointment?.basicInfo?.location}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{booking.appointment?.basicInfo?.isOnline ? 'Meeting link will be sent to your email.' : 'Please arrive 10 minutes before the scheduled time.'}</p>
                  </div>
                </div>
              </div>
            </div>

            {}
            {booking.answers && booking.answers.length > 0 && (
              <div className="glass-card-strong p-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Your Answers</h3>
                <div className="space-y-6">
                  {booking.answers.map((ans, i) => (
                    <div key={i} className="border-l-2 border-brand-200 pl-4">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">{ans.label}</p>
                      <p className="text-slate-800 font-medium">{ans.answer || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {}
            {booking.rescheduleHistory && booking.rescheduleHistory.length > 0 && (
              <div className="glass-card-strong p-8">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Reschedule History</h3>
                <div className="space-y-4">
                  {booking.rescheduleHistory.map((h, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100 flex justify-between items-center text-sm">
                       <div>
                         <p className="text-[10px] font-bold text-indigo-400 uppercase">Changed To</p>
                         <p className="font-bold text-indigo-900">{new Date(h.newDate).toLocaleDateString()} at {h.newStartTime}</p>
                       </div>
                       <p className="text-xs text-indigo-400 italic">on {new Date(h.changedAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {}
          <div className="space-y-6">
            {}
            <div className="glass-card-strong p-6 bg-gradient-to-br from-white to-slate-50/50">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500 font-medium">Status</span>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${booking.payment?.status === 'paid' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {booking.payment?.status}
                  </span>
                </div>
                {booking.payment?.required && (
                   <div className="flex justify-between items-center">
                     <span className="text-sm text-slate-500 font-medium">Amount</span>
                     <span className="text-lg font-black text-slate-900">${booking.payment.amount}</span>
                   </div>
                )}
                {booking.payment?.mockTransactionId && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Transaction ID</p>
                    <code className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded block truncate">
                      {booking.payment.mockTransactionId}
                    </code>
                  </div>
                )}
              </div>
            </div>

            {}
            <div className="glass-card-strong p-6 space-y-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>

              {['pending', 'confirmed', 'rescheduled'].includes(booking.status) && (
                <>
                  <button
                    onClick={() => navigate(`/customer/bookings/${booking._id}/reschedule`)}
                    className="w-full btn-brand !rounded-xl !py-3 !text-sm font-bold shadow-lg shadow-brand-500/10"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => navigate(`/customer/dashboard`)}
                    className="w-full py-3 rounded-xl border border-rose-100 text-rose-500 text-sm font-bold hover:bg-rose-50 transition-colors"
                  >
                    Request Cancellation
                  </button>
                </>
              )}

              <button
                onClick={() => navigate(`/customer/book/${booking.appointment._id}`)}
                className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                Book Again
              </button>
            </div>

            {}
            {booking.status === 'cancelled' && (
              <div className="glass-card-strong p-6 bg-rose-50/30 border-rose-100">
                <h3 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3">Cancellation Details</h3>
                <p className="text-xs text-rose-700 font-medium leading-relaxed">
                  Reason: {booking.cancel?.reason || 'No reason provided.'}
                </p>
                <p className="text-[10px] text-rose-400 mt-2 italic">
                  Cancelled on: {new Date(booking.cancel?.cancelledAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}