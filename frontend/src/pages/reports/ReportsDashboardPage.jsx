import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getReportOverview } from '../../services/reportService';
import ReportsShell from '../../components/reports/ReportsShell';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
  RadialBarChart, RadialBar,
  LineChart, Line
} from 'recharts';

const PRESETS = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '90 Days', days: 90 },
];

const fmtDate = (d) => d.toISOString().split('T')[0];

const PIE_COLORS = ['#10b981', '#f59e0b', '#f43f5e', '#6366f1'];
const ROLE_COLORS = ['#06b6d4', '#8b5cf6', '#f43f5e'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-xl border border-white/70 rounded-2xl px-4 py-3 shadow-xl">
      <p className="text-xs font-black text-slate-800 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[11px] font-bold" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function ReportsDashboardPage() {
  const { showToast } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [range, setRange] = useState({ from: fmtDate(new Date(Date.now() - 30 * 86400000)), to: fmtDate(new Date()) });
  const [activePreset, setActivePreset] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const r = await getReportOverview(range);
      setData(r.data);
    } catch {
      setError(true);
      showToast('Failed to load reports.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [range]);

  const selectPreset = (idx) => {
    setActivePreset(idx);
    const to = new Date();
    const from = new Date(Date.now() - PRESETS[idx].days * 86400000);
    setRange({ from: fmtDate(from), to: fmtDate(to) });
  };

  const s = data?.summary || {};

  const bookingStatusData = [
    { name: 'Confirmed', value: s.confirmedBookings || 0 },
    { name: 'Pending', value: s.pendingBookings || 0 },
    { name: 'Cancelled', value: s.cancelledBookings || 0 },
    { name: 'Completed', value: s.completedBookings || 0 },
  ].filter(d => d.value > 0);

  const roleData = data?.roleDistribution || [];

  const trendData = (data?.dailyBookingTrend || []).map(d => ({
    ...d,
    date: d.date?.slice(5)
  }));

  const peakData = (data?.peakBookingHours || []).map(h => ({
    hour: h.hour,
    bookings: h.count,
    intensity: h.intensity
  }));

  const providerRadialData = (data?.providerUtilization || []).map((p, i) => ({
    name: p.providerName,
    utilization: p.utilizationPercent,
    fill: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#6366f1'][i % 6]
  }));

  if (error && !loading) {
    return (
      <ReportsShell>
        <div className="flex flex-col items-center py-32">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl mb-6">⚠</div>
          <h2 className="text-xl font-black text-slate-800 mb-2">Failed to Load Reports</h2>
          <button onClick={fetchData} className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white text-sm font-bold shadow-lg">Retry</button>
        </div>
      </ReportsShell>
    );
  }

  return (
    <ReportsShell>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Insight Observatory</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">Track appointment demand, peak hours, and provider utilization in real time.</p>
      </div>

      <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.06)] mb-8">
        <div className="flex flex-wrap items-center gap-3">
          {PRESETS.map((p, i) => (
            <button key={i} onClick={() => selectPreset(i)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activePreset === i ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>
              {p.label}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <input type="date" value={range.from} onChange={e => { setActivePreset(-1); setRange(r => ({ ...r, from: e.target.value })); }} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-none" />
            <span className="text-xs text-slate-400">to</span>
            <input type="date" value={range.to} onChange={e => { setActivePreset(-1); setRange(r => ({ ...r, to: e.target.value })); }} className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Services', value: s.totalAppointments, color: 'text-violet-600', icon: '◆' },
          { label: 'Bookings', value: s.totalBookings, color: 'text-blue-600', icon: '◈' },
          { label: 'Confirmed', value: s.confirmedBookings, color: 'text-emerald-600', icon: '✓' },
          { label: 'Pending', value: s.pendingBookings, color: 'text-amber-600', icon: '◐' },
          { label: 'Cancelled', value: s.cancelledBookings, color: 'text-rose-600', icon: '✕' },
          { label: 'Published', value: s.publishedAppointments, color: 'text-indigo-600', icon: '◎' },
        ].map(card => (
          <div key={card.label} className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.04)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg opacity-60">{card.icon}</span>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${card.color}`}>{card.label}</span>
            </div>
            <p className={`text-3xl font-black tracking-tight ${card.color}`}>{loading ? '···' : (card.value ?? 0)}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-2">Booking Status Distribution</h2>
          <p className="text-[10px] text-slate-400 mb-4">Breakdown of all booking states.</p>
          {loading ? (
            <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
          ) : bookingStatusData.length === 0 ? (
            <div className="h-64 flex items-center justify-center"><p className="text-sm text-slate-400">No bookings yet.</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={bookingStatusData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value" strokeWidth={0}>
                  {bookingStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs font-bold text-slate-600">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-2">Peak Booking Hours</h2>
          <p className="text-[10px] text-slate-400 mb-4">Hourly booking volume analysis.</p>
          {loading ? (
            <div className="h-64 bg-slate-100 rounded-3xl animate-pulse" />
          ) : peakData.length === 0 ? (
            <div className="h-64 flex items-center justify-center"><p className="text-sm text-slate-400">No peak hour data.</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={peakData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" radius={[8, 8, 0, 0]} fill="url(#peakGradient)" />
                <defs>
                  <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] mb-8">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-2">Booking Trend</h2>
        <p className="text-[10px] text-slate-400 mb-4">Daily booking volume with status breakdown over time.</p>
        {loading ? (
          <div className="h-72 bg-slate-100 rounded-3xl animate-pulse" />
        ) : trendData.length === 0 ? (
          <div className="h-72 flex items-center justify-center"><p className="text-sm text-slate-400">No trend data available.</p></div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradConfirmed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs font-bold text-slate-600">{v}</span>} />
              <Area type="monotone" dataKey="bookings" name="Total" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gradTotal)" dot={false} activeDot={{ r: 5, strokeWidth: 0 }} />
              <Area type="monotone" dataKey="confirmed" name="Confirmed" stroke="#10b981" strokeWidth={2} fill="url(#gradConfirmed)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
              <Line type="monotone" dataKey="cancelled" name="Cancelled" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              <Line type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-2">Platform Health</h2>
          <p className="text-[10px] text-slate-400 mb-4">Key operational rates and system efficiency.</p>
          {loading ? (
            <div className="h-72 bg-slate-100 rounded-3xl animate-pulse" />
          ) : (() => {
            const totalB = s.totalBookings || 0;
            const totalA = s.totalAppointments || 0;
            const confirmRate = totalB > 0 ? Math.round((s.confirmedBookings / totalB) * 100) : 0;
            const cancelRate = totalB > 0 ? Math.round((s.cancelledBookings / totalB) * 100) : 0;
            const publishRate = totalA > 0 ? Math.round((s.publishedAppointments / totalA) * 100) : 0;
            const completionRate = totalB > 0 ? Math.round((s.completedBookings / totalB) * 100) : 0;
            const gauges = [
              { name: 'Confirm Rate', value: confirmRate, fill: '#10b981' },
              { name: 'Publish Rate', value: publishRate, fill: '#8b5cf6' },
              { name: 'Completion', value: completionRate, fill: '#06b6d4' },
              { name: 'Cancel Rate', value: cancelRate, fill: '#f43f5e' },
            ];
            return (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <RadialBarChart innerRadius="20%" outerRadius="100%" data={gauges} startAngle={180} endAngle={-180} barSize={14}>
                    <RadialBar background={{ fill: '#f1f5f9' }} clockWise dataKey="value" cornerRadius={10} />
                    <Tooltip content={({ payload }) => {
                      if (!payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white/95 backdrop-blur-xl border border-white/70 rounded-2xl px-4 py-3 shadow-xl">
                          <p className="text-xs font-black text-slate-800">{d.name}</p>
                          <p className="text-[11px] font-bold" style={{ color: d.fill }}>{d.value}%</p>
                        </div>
                      );
                    }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {gauges.map(g => (
                    <div key={g.name} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: g.fill }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-500 truncate">{g.name}</p>
                      </div>
                      <span className="text-sm font-black" style={{ color: g.fill }}>{g.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>

        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-2">Top Appointments</h2>
          <p className="text-[10px] text-slate-400 mb-4">Most booked appointment types.</p>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
          ) : (data?.mostBookedAppointments || []).length === 0 ? (
            <div className="h-64 flex items-center justify-center"><p className="text-sm text-slate-400">No appointment data.</p></div>
          ) : (
            <div className="space-y-3">
              {data.mostBookedAppointments.map((a, idx) => {
                const maxB = Math.max(...data.mostBookedAppointments.map(x => x.totalBookings), 1);
                const pct = Math.round((a.totalBookings / maxB) * 100);
                const demandColor = a.conversionLabel === 'High Demand' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : a.conversionLabel === 'Stable' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100';
                const barColor = a.conversionLabel === 'High Demand' ? 'from-emerald-400 to-emerald-600' : a.conversionLabel === 'Stable' ? 'from-amber-400 to-amber-600' : 'from-rose-400 to-rose-600';
                return (
                  <div key={a.appointmentId} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${idx < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-slate-200 text-slate-500'}`}>#{idx + 1}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{a.title}</p>
                        <p className="text-[10px] text-slate-400">{a.totalBookings} total · {a.confirmedBookings} confirmed</p>
                      </div>
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border shrink-0 ${demandColor}`}>{a.conversionLabel}</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {(data?.resourceUtilization || []).length > 0 && (
        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] mb-8">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-2">Resource Utilization</h2>
          <p className="text-[10px] text-slate-400 mb-4">Rooms, equipment, and facility usage.</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.resourceUtilization.map(r => ({ name: r.resourceName, bookings: r.totalBookings, utilization: r.utilizationPercent }))} layout="vertical" barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fontWeight: 700, fill: '#475569' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="bookings" name="Bookings" radius={[0, 8, 8, 0]} fill="url(#resourceGradient)" />
              <defs>
                <linearGradient id="resourceGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {roleData.length > 0 && (
        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-2">Role Distribution</h2>
          <p className="text-[10px] text-slate-400 mb-4">User base composition across platform roles.</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} strokeWidth={0}>
                {roleData.map((_, i) => <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </ReportsShell>
  );
}
