import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById } from '../../services/bookingService';

export default function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookingById(bookingId)
      .then(r => setBooking(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="loader-ring-brand w-12 h-12 rounded-full" /></div>;
  if (!booking) return <div className="text-center py-20 text-slate-500">Booking not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20 pt-16">
      <div className="max-w-2xl mx-auto px-4 md:px-0">

        <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 md:p-12 shadow-[0_24px_80px_rgba(15,23,42,0.06)] animate-slide-up text-left">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-100">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
                {booking.status === 'pending' ? 'Appointment Reserved' : 'Appointment confirmed'}
              </h1>
              <p className="text-slate-500 font-medium">
                {booking.status === 'pending'
                  ? 'You will get a mail when organiser confirms your booking.'
                  : 'We look forward to meeting you.'}
              </p>
            </div>
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Time</p>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-slate-800">
                    {new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {booking.startTime}
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-slate-50">Google calendar</button>
                    <button className="px-3 py-1 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-slate-50">Outlook calendar</button>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                <p className="text-lg font-bold text-slate-800">{booking.appointment?.basicInfo?.duration} {booking.appointment?.basicInfo?.durationUnit}</p>
              </div>

              {booking.selectedCapacity > 1 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">No of people</p>
                  <p className="text-lg font-bold text-slate-800">{booking.selectedCapacity}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Venue</p>
                <div className="text-slate-800">
                   <p className="text-lg font-bold">{booking.appointment?.basicInfo?.isOnline ? 'Online Meeting' : booking.providerUser?.fullName || 'Main Office'}</p>
                   <p className="text-sm font-medium text-slate-500 mt-1 leading-relaxed">
                     {booking.appointment?.basicInfo?.isOnline
                       ? 'A link will be sent to your registered email shortly.'
                       : booking.appointment?.basicInfo?.location || '64 Doctor Street, Springfield'}
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-50/50 border border-brand-100 rounded-2xl p-5 mb-10">
             <p className="text-sm font-bold text-brand-700 italic">
               "Thank you for your trust we look forward to meeting you"
             </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-100">
             <button
               onClick={() => navigate('/customer/dashboard')}
               className="text-sm font-bold text-slate-400 hover:text-rose-500 px-6 py-2 transition-colors"
             >
               cancel
             </button>
             <button
               onClick={() => navigate(`/customer/bookings/${booking._id}/reschedule`)}
               className="btn-ghost !px-8 !py-3 !rounded-xl !text-sm !font-bold border-2 border-slate-100 hover:border-brand-200"
             >
               Reschedule
             </button>
             <button
               onClick={() => navigate('/customer/appointments')}
               className="btn-brand !px-8 !py-3 !rounded-xl !text-sm !font-bold shadow-lg shadow-brand-500/20"
             >
               Book Another
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}