import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPeakBookingHours } from '../../services/reportService';
import ReportsShell from '../../components/reports/ReportsShell';

const fmtDate = (d) => d.toISOString().split('T')[0];

export default function PeakHoursPage() {
  const { showToast } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({ from: fmtDate(new Date(Date.now() - 30 * 86400000)), to: fmtDate(new Date()) });

  useEffect(() => {
    setLoading(true);
    getPeakBookingHours(range)
      .then(r => setData(r.data || []))
      .catch(() => showToast('Failed to load peak hours.', 'error'))
      .finally(() => setLoading(false));
  }, [range]);

  const topHour = data.length > 0 ? data.reduce((a, b) => a.count > b.count ? a : b) : null;

  return (
    <ReportsShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Peak Booking Hours</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">Identify your busiest booking windows and optimize scheduling.</p>
      </div>

      <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.06)] mb-8">
        <div className="flex items-center gap-3">
          <input type="date" value={range.from} onChange={e => setRange(r => ({ ...r, from: e.target.value }))} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-none" />
          <span className="text-xs text-slate-400">to</span>
          <input type="date" value={range.to} onChange={e => setRange(r => ({ ...r, to: e.target.value }))} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-none" />
        </div>
      </div>

      {topHour && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-[2rem] p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-amber-500/30">🔥</div>
            <div>
              <p className="text-lg font-black text-slate-900">Your busiest window is {topHour.hour}</p>
              <p className="text-sm text-slate-500">{topHour.count} bookings during this hour.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] mb-8">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-6">Hour-by-Hour Heatmap</h2>
        {loading ? (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-3">{[...Array(12)].map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-16"><p className="text-sm text-slate-400">No booking data for the selected range.</p></div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
            {data.map(h => (
              <div key={h.hour} className={`relative p-4 rounded-2xl text-center transition-all hover:scale-105 cursor-default ${h.intensity === 'high' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/20' : h.intensity === 'medium' ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
                {h.intensity === 'high' && <span className="absolute -top-2 -right-2 text-[8px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-black shadow-sm">Peak</span>}
                <p className="text-2xl font-black">{h.count}</p>
                <p className="text-[10px] font-bold mt-1">{h.hour}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-4">Ranked Hours</h2>
          <div className="space-y-2">
            {[...data].sort((a, b) => b.count - a.count).map((h, i) => (
              <div key={h.hour} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50/60 border border-slate-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${i < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>#{i + 1}</div>
                <p className="text-sm font-bold text-slate-700 flex-1">{h.hour}</p>
                <p className="text-sm font-black text-slate-800">{h.count} bookings</p>
                <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${h.intensity === 'high' ? 'bg-amber-100 text-amber-700' : h.intensity === 'medium' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{h.intensity}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-violet-50/50 border border-violet-100">
            <p className="text-xs font-bold text-violet-700 mb-2">💡 Suggestions</p>
            <ul className="space-y-1.5 text-xs text-violet-600">
              <li>• Add more providers during peak hours to reduce wait times.</li>
              <li>• Extend schedule availability in high-demand windows.</li>
              <li>• Consider dynamic pricing for premium peak slots.</li>
            </ul>
          </div>
        </div>
      )}
    </ReportsShell>
  );
}
