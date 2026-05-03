import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProviderUtilization } from '../../services/reportService';
import ReportsShell from '../../components/reports/ReportsShell';

const fmtDate = (d) => d.toISOString().split('T')[0];

export default function ProviderUtilizationPage() {
  const { showToast } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({ from: fmtDate(new Date(Date.now() - 30 * 86400000)), to: fmtDate(new Date()) });

  useEffect(() => {
    setLoading(true);
    getProviderUtilization(range)
      .then(r => setData(r.data || []))
      .catch(() => showToast('Failed to load utilization.', 'error'))
      .finally(() => setLoading(false));
  }, [range]);

  const topProvider = data.length > 0 ? data.reduce((a, b) => a.totalBookings > b.totalBookings ? a : b) : null;
  const lowProvider = data.length > 0 ? data.reduce((a, b) => a.totalBookings < b.totalBookings ? a : b) : null;

  return (
    <ReportsShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Provider Utilization</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">Understand workload balance across your service providers.</p>
      </div>

      <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.06)] mb-8">
        <div className="flex items-center gap-3">
          <input type="date" value={range.from} onChange={e => setRange(r => ({ ...r, from: e.target.value }))} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-none" />
          <span className="text-xs text-slate-400">to</span>
          <input type="date" value={range.to} onChange={e => setRange(r => ({ ...r, to: e.target.value }))} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-none" />
        </div>
      </div>

      {topProvider && lowProvider && data.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-r from-rose-50 to-rose-100/50 border border-rose-200 rounded-[2rem] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white text-sm font-black shadow-lg">🔴</div>
              <div>
                <p className="text-sm font-black text-slate-900">Highest Load: {topProvider.providerName}</p>
                <p className="text-xs text-slate-500">{topProvider.totalBookings} bookings · {topProvider.utilizationPercent}% utilization</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-50 to-cyan-100/50 border border-cyan-200 rounded-[2rem] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-sm font-black shadow-lg">🟢</div>
              <div>
                <p className="text-sm font-black text-slate-900">Most Available: {lowProvider.providerName}</p>
                <p className="text-xs text-slate-500">{lowProvider.totalBookings} bookings · {lowProvider.utilizationPercent}% utilization</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] mb-8">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-6">Provider Performance</h2>
        {loading ? (
          <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-16"><p className="text-sm text-slate-400">No provider data available for this period.</p></div>
        ) : (
          <div className="space-y-4">
            {data.map(p => {
              const utilLabel = p.utilizationPercent >= 80 ? 'High Load' : p.utilizationPercent >= 50 ? 'Healthy' : 'Available';
              const utilColor = p.utilizationPercent >= 80 ? 'text-rose-600' : p.utilizationPercent >= 50 ? 'text-emerald-600' : 'text-cyan-600';
              const barColor = p.utilizationPercent >= 80 ? 'from-rose-400 to-rose-600' : p.utilizationPercent >= 50 ? 'from-emerald-400 to-emerald-600' : 'from-cyan-400 to-cyan-600';
              const ringColor = p.utilizationPercent >= 80 ? '#f43f5e' : p.utilizationPercent >= 50 ? '#10b981' : '#06b6d4';
              const circ = 2 * Math.PI * 30;
              const dash = (p.utilizationPercent / 100) * circ;

              return (
                <div key={p.providerId} className="p-6 rounded-[1.5rem] bg-slate-50/60 border border-slate-100 hover:bg-white/50 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="relative w-20 h-20 shrink-0">
                      <svg viewBox="0 0 70 70" className="w-full h-full -rotate-90">
                        <circle cx="35" cy="35" r="30" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                        <circle cx="35" cy="35" r="30" fill="none" stroke={ringColor} strokeWidth="5" strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" className="transition-all duration-700" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-sm font-black ${utilColor}`}>{p.utilizationPercent}%</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-base font-black text-slate-800">{p.providerName}</p>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-xl ${p.utilizationPercent >= 80 ? 'bg-rose-50 text-rose-600 border border-rose-100' : p.utilizationPercent >= 50 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-cyan-50 text-cyan-600 border border-cyan-100'}`}>{utilLabel}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-3">{p.providerEmail}</p>
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-lg font-black text-slate-800">{p.totalBookings}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Total</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-black text-emerald-600">{p.confirmedBookings}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Confirmed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-black text-amber-600">{p.pendingBookings}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Pending</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-black text-rose-600">{p.cancelledBookings}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Cancelled</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-bold text-violet-700 mb-2">💡 Optimization Suggestions</p>
          <ul className="space-y-1.5 text-xs text-violet-600">
            <li>• Balance assignment mode to distribute bookings evenly.</li>
            <li>• Add capacity to high-load providers to prevent bottlenecks.</li>
            <li>• Consider reassigning underutilized providers to busier services.</li>
          </ul>
        </div>
      )}
    </ReportsShell>
  );
}
