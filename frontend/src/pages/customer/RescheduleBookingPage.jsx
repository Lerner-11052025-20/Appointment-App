import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, rescheduleBooking } from '../../services/bookingService';
import { getAvailability } from '../../services/availabilityService';
import { useAuth } from '../../context/AuthContext';

export default function RescheduleBookingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    getBookingById(bookingId)
      .then(r => setBooking(r.data))
      .catch(() => showToast('Booking not found', 'error'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  useEffect(() => {
    if (date && booking) fetchAvailability();
  }, [date]);

  const fetchAvailability = async () => {
    setSlotsLoading(true);
    setSelectedSlot(null);
    try {
      const params = { date };
      if (booking.providerUser) params.providerUserId = booking.providerUser._id;
      if (booking.resource) params.resourceId = booking.resource._id;
      const res = await getAvailability(booking.appointment._id, params);
      setSlots(res.data || []);
    } catch {
      showToast('Failed to load slots', 'error');
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!selectedSlot || !date) return;
    setSubmitting(true);
    try {
      await rescheduleBooking(bookingId, {
        newDate: date,
        newStartTime: selectedSlot.startTime,
        newEndTime: selectedSlot.endTime
      });
      showToast('Rescheduled successfully', 'success');
      navigate(`/customer/bookings/${bookingId}/confirmation`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reschedule', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="loader-ring-brand w-12 h-12 rounded-full" /></div>;
  if (!booking) return <div className="text-center py-20 text-slate-500">Booking unavailable.</div>;

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20 pt-12">
      <div className="max-w-3xl mx-auto px-4 md:px-6">

        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-sm font-bold text-slate-500 hover:text-slate-800 mb-4 inline-flex items-center">
            ← Back
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Reschedule Appointment</h1>
          <p className="text-slate-500">Change the date and time for your existing booking.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-[2rem] p-6 md:p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] mb-8">

          {}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Appointment</p>
              <p className="font-bold text-slate-800 text-lg">{booking.appointment?.basicInfo?.title}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Time</p>
              <p className="font-semibold text-slate-700">{new Date(booking.bookingDate).toLocaleDateString()} at {booking.startTime}</p>
            </div>
          </div>

          {}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Select New Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full input-premium !rounded-xl"
              />
            </div>

            {date && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Select New Time</label>
                {slotsLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium border border-rose-100">
                    No slots available for this date. Please pick another.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {slots.map((s, i) => {
                      const isFull = s.status === 'full';
                      const isSel = selectedSlot?.startTime === s.startTime;
                      return (
                        <button
                          key={i}
                          disabled={isFull}
                          onClick={() => setSelectedSlot(s)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${isFull ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' : isSel ? 'border-violet-500 bg-violet-50 shadow-md scale-105' : 'border-slate-200 hover:border-violet-300 bg-white'}`}
                        >
                          <p className={`font-bold ${isSel ? 'text-violet-700' : isFull ? 'text-slate-400' : 'text-slate-700'}`}>{s.startTime}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleReschedule}
              disabled={submitting || !selectedSlot}
              className="btn-brand !px-10 !py-3 !text-base shadow-lg shadow-violet-500/30"
            >
              {submitting ? 'Confirming...' : 'Confirm Reschedule'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}