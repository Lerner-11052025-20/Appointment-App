import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPublishedAppointments } from '../../services/appointmentService';
import { getMyBookings } from '../../services/bookingService';

export default function CustomerDashboard() {
  const { user, logout, showToast } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPublishedAppointments(),
      getMyBookings()
    ])
      .then(([appRes, bookRes]) => {
        setAppointments(appRes.data || []);
        setBookingsCount(bookRes.data?.length || 0);
      })
      .catch(() => showToast('Failed to load dashboard data.', 'error'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface-50 relative overflow-hidden">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gradient-brand">SlotIQ</span>
          </div>
          <div className="flex items-center gap-4">
            <div onClick={() => navigate('/customer/profile')} className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:scale-110 transition-transform">
                {user?.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-sm font-bold text-slate-700 hidden sm:inline group-hover:text-brand-600 transition-colors">{user?.fullName}</span>
            </div>
            <button onClick={logout} className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors border-l border-slate-200 pl-4 py-1">Logout</button>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card-strong p-6 animate-slide-up">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Your Dashboard</h2>
              <p className="text-sm text-slate-500 mb-6">Manage your bookings</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div onClick={() => navigate('/customer/my-appointments')} className="float-card text-center !p-4 cursor-pointer">
                  <p className="text-2xl font-bold text-brand-600">{loading ? '-' : bookingsCount}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Bookings</p>
                </div>
                <div onClick={() => navigate('/customer/appointments')} className="float-card text-center !p-4 cursor-pointer">
                  <p className="text-2xl font-bold text-emerald-600">{loading ? '-' : appointments.length}</p>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Explore</p>
                </div>
              </div>

              <div onClick={() => navigate('/customer/my-appointments')} className="p-3.5 rounded-2xl bg-brand-50/50 border border-brand-100 flex items-center gap-3 cursor-pointer hover:bg-brand-100 transition-all hover:translate-x-1 mb-3">
                <span className="text-xl">🎯</span>
                <span className="text-sm text-brand-700 font-bold">My Bookings</span>
              </div>
              <div onClick={() => navigate('/customer/profile')} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all hover:translate-x-1">
                <span className="text-xl">⚙️</span>
                <span className="text-sm text-slate-700 font-bold">Profile Settings</span>
              </div>
            </div>
          </div>

          {}
          <div className="lg:col-span-2">
            <div className="glass-card-strong p-6 md:p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Available Appointments</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Book a session with our experts.</p>
                </div>
                <div className="bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-lg border border-brand-100">
                  {appointments.length} Available
                </div>
              </div>

              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-28 bg-white/50 rounded-2xl border border-slate-100" />
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="text-sm font-bold text-slate-700 mb-1">No services available right now</h3>
                  <p className="text-xs text-slate-500">Check back later for new appointments.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {appointments.map(a => (
                    <div key={a._id} className="group relative bg-white/70 backdrop-blur-md border border-slate-100 hover:border-brand-200 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-brand-600 transition-colors">{a.basicInfo.title}</h3>
                          {a.basicInfo.isOnline && <span className="bg-cyan-50 text-cyan-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-cyan-100">Online</span>}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4">{a.basicInfo.description || 'No description provided.'}</p>

                        <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-600">
                          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {a.basicInfo.duration} {a.basicInfo.durationUnit}
                          </span>
                          {a.basicInfo.location && !a.basicInfo.isOnline && (
                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md truncate max-w-[120px]">
                              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {a.basicInfo.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/customer/book/${a._id}`)}
                        className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-brand-600 transition-colors shadow-md"
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}