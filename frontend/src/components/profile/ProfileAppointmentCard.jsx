import { useNavigate } from 'react-router-dom';

export default function ProfileAppointmentCard({ booking, type }) {
  const navigate = useNavigate();
  const dateObj = new Date(booking.bookingDate);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  const statusColors = {
    confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
    completed: 'bg-slate-50 text-slate-600 border-slate-100',
    rescheduled: 'bg-indigo-50 text-indigo-600 border-indigo-100'
  };

  return (
    <div className="flex gap-6 group relative">
      {}
      <div className="flex flex-col items-center pt-1">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center group-hover:border-brand-300 transition-colors">
          <span className="text-[10px] font-black text-slate-400">{month}</span>
          <span className="text-xl font-black text-slate-800 leading-none">{day}</span>
        </div>
        <div className="w-0.5 h-full bg-slate-100 group-last:hidden mt-2" />
      </div>

      {}
      <div className="flex-1 pb-10">
        <div className="glass-card-strong p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group/card border-slate-100" onClick={() => navigate(`/customer/profile/appointments/${booking._id}`)}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusColors[booking.status] || 'bg-slate-50 text-slate-500'}`}>
                  {booking.status}
                </span>
                {booking.payment?.status === 'paid' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">
                    Paid
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover/card:text-brand-600 transition-colors">
                {booking.appointment?.basicInfo?.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-slate-400">🕒</span> {booking.startTime} - {booking.endTime}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-slate-400">👤</span> {booking.providerUser?.fullName || booking.resource?.name}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-slate-400">📍</span> {booking.appointment?.basicInfo?.isOnline ? 'Online Meeting' : 'In Person'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/customer/profile/appointments/${booking._id}`); }}
                className="btn-ghost !rounded-xl !py-2 !px-4 !text-[11px] !font-bold border border-slate-100 hover:bg-slate-50"
              >
                View Details
              </button>
              {type === 'upcoming' && (
                 <button
                   onClick={(e) => { e.stopPropagation(); navigate(`/customer/bookings/${booking._id}/reschedule`); }}
                   className="btn-brand !rounded-xl !py-2 !px-4 !text-[11px] !font-bold shadow-md hover:shadow-brand-500/20"
                 >
                   Reschedule
                 </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}