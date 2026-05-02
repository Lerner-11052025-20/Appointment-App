import ProfileAppointmentCard from './ProfileAppointmentCard';
import { useNavigate } from 'react-router-dom';

export default function ProfileAppointmentTimeline({ appointments, type }) {
  const navigate = useNavigate();

  if (!appointments || appointments.length === 0) {
    const messages = {
      upcoming: { title: 'No upcoming appointments', sub: 'Discover services and book your next slot.' },
      past: { title: 'No past appointments yet', sub: 'Your booking history will appear here.' },
      cancelled: { title: 'No cancelled appointments', sub: 'Cleared schedule! Nothing cancelled yet.' }
    };
    const msg = messages[type] || messages.upcoming;

    return (
      <div className="glass-card-strong p-16 text-center animate-fade-in">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📭</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{msg.title}</h3>
        <p className="text-sm text-slate-400 mb-8">{msg.sub}</p>
        <button
          onClick={() => navigate('/customer/appointments')}
          className="btn-brand !rounded-2xl !py-3 !px-8 !text-sm font-bold shadow-lg"
        >
          Browse Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-slide-up">
      {appointments.map((booking, idx) => (
        <ProfileAppointmentCard key={booking._id} booking={booking} type={type} />
      ))}
    </div>
  );
}