import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAppointmentById } from '../../services/appointmentService';
import AppointmentStudioLayout from '../../components/appointment/AppointmentStudioLayout';

export default function AppointmentPreviewPage() {
  const { id } = useParams();
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const base = user?.role === 'admin' ? '/admin' : '/organiser';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAppointmentById(id).then(r => setData(r.data)).catch(() => showToast('Failed to load.', 'error')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AppointmentStudioLayout><div className="flex justify-center py-20"><div className="loader-ring-brand w-10 h-10 rounded-full" /></div></AppointmentStudioLayout>;
  if (!data) return <AppointmentStudioLayout><p className="text-center py-20 text-slate-500">Appointment not found.</p></AppointmentStudioLayout>;

  const { basicInfo, schedule, questions, options, publish } = data;

  return (
    <AppointmentStudioLayout>
      <button onClick={() => navigate(`${base}/appointments/${id}/edit`)} className="btn-ghost !py-2 !px-4 !text-xs !rounded-xl mb-6">← Back to Editor</button>

      <div className="max-w-2xl mx-auto">
        <div className="glass-card-strong p-8 md:p-10 animate-slide-up">
          {}
          {publish?.isPublished && (
            <div className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-xl mb-4">Published</div>
          )}

          <h1 className="text-3xl font-bold text-slate-900 mb-2">{basicInfo?.title}</h1>
          {basicInfo?.description && <p className="text-sm text-slate-500 mb-4">{basicInfo.description}</p>}

          <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-6">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {basicInfo?.duration} {basicInfo?.durationUnit === 'hours' ? 'Hours' : 'Minutes'}
            </span>
            {basicInfo?.location && (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {basicInfo.location}
              </span>
            )}
            {basicInfo?.isOnline && <span className="bg-cyan-50 text-cyan-700 text-xs font-semibold px-2.5 py-1 rounded-lg">🌐 Online</span>}
          </div>

          {}
          {schedule?.weekly?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Available Schedule</h3>
              <div className="space-y-1.5">
                {schedule.weekly.filter(s => s.isActive).map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-700 w-24">{s.day}</span>
                    <span className="font-mono">{s.from}</span>
                    <span className="text-rose-400">→</span>
                    <span className="font-mono">{s.to}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          {questions?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Booking Questions</h3>
              {questions.map((q, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <span className="text-xs font-bold text-brand-500">Q{i + 1}</span>
                  <span>{q.label}</span>
                  {q.required && <span className="text-[10px] bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded font-bold">Required</span>}
                </div>
              ))}
            </div>
          )}

          <button disabled className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold opacity-60 cursor-not-allowed">
            Book Appointment (Preview)
          </button>
        </div>
      </div>
    </AppointmentStudioLayout>
  );
}