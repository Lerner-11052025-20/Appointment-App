import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getAppointmentByShareToken } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

export default function PrivateBookingPage() {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointmentByShareToken(shareToken)
      .then(r => setAppointment(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [shareToken]);

  const handleContinue = () => {
    if (!user) {

      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (user.role === 'customer') {
      navigate(`/customer/book/${appointment._id}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="loader-ring-brand w-12 h-12 rounded-full" /></div>;

  if (!appointment) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 max-w-sm">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Invalid Link</h3>
        <p className="text-slate-500">This private booking link is invalid or has expired.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center p-4">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1 opacity-50" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 md:p-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] max-w-md w-full relative z-10 text-center animate-slide-up">

        <div className="inline-block bg-violet-50 text-violet-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest mb-6 border border-violet-100">
          Private Invitation
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{appointment.basicInfo.title}</h1>
        <p className="text-slate-500 mb-8">{appointment.basicInfo.description}</p>

        <div className="bg-slate-50 rounded-2xl p-5 text-left border border-slate-100 mb-8 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-medium">{appointment.basicInfo.duration} {appointment.basicInfo.durationUnit}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="font-medium">{appointment.basicInfo.isOnline ? 'Online Meeting' : appointment.basicInfo.location}</span>
          </div>
        </div>

        {user?.role === 'organiser' || user?.role === 'admin' ? (
          <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium border border-amber-200">
            You are logged in as {user.role}. Please log in as a customer to book.
          </div>
        ) : (
          <button
            onClick={handleContinue}
            className="w-full btn-brand !py-4 shadow-lg shadow-violet-500/25"
          >
            {user ? 'Continue to Booking' : 'Log in to Book'}
          </button>
        )}
      </div>
    </div>
  );
}