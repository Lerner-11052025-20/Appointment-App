import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublishedAppointments } from '../../services/appointmentService';

export default function CustomerHomePage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPublishedAppointments({ search })
      .then(r => setAppointments(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-20">
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1 opacity-60" />
        <div className="aurora-blob aurora-blob-2 opacity-50" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 pt-20">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Book the right appointment in <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">seconds.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">Explore real-time availability, choose your preferred provider, and confirm without scheduling chaos.</p>

          <div className="mt-8 max-w-xl mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search services, locations, or providers..."
              className="w-full bg-white/80 backdrop-blur-md border border-white/50 shadow-xl rounded-2xl py-4 pl-12 pr-4 text-slate-800 font-medium focus:ring-4 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Available Services</h2>
          <div className="text-sm font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg border border-brand-100">
            {appointments.length} Options
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white/40 rounded-3xl border border-white/60 animate-pulse" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="glass-card-strong p-16 text-center">
            <h3 className="text-xl font-bold text-slate-700 mb-2">No published appointments available yet.</h3>
            <p className="text-slate-500">Check back later when organizers add new services.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map(a => (
              <div key={a._id} className="group bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] hover:shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{a.basicInfo.title}</h3>
                    {a.basicInfo.isOnline && (
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm shrink-0 ml-2 border border-emerald-100">
                        Online
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-5">{a.basicInfo.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200/50">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {a.basicInfo.duration} {a.basicInfo.durationUnit === 'hours' ? 'Hrs' : 'Min'}
                    </div>
                    {a.basicInfo.location && !a.basicInfo.isOnline && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100/80 px-2.5 py-1.5 rounded-lg border border-slate-200/50 truncate max-w-[150px]">
                        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="truncate">{a.basicInfo.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1.5 mb-5 flex-wrap">
                    {a.capacity?.manageCapacity && (
                      <span className="text-[10px] uppercase font-bold text-cyan-600 bg-cyan-50 border border-cyan-100 px-2 py-0.5 rounded">Group Event</span>
                    )}
                    {a.options?.advancePayment && (
                      <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">Paid</span>
                    )}
                    {a.options?.manualConfirmation && (
                      <span className="text-[10px] uppercase font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded">Approval Req</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/customer/book/${a._id}`)}
                  className="w-full bg-slate-900 text-white font-bold text-sm py-3 rounded-xl hover:bg-gradient-to-r hover:from-violet-600 hover:to-indigo-600 shadow-md transition-all duration-300"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}