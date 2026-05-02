import { DAYS, countActiveWindows } from '../../utils/scheduleUtils';

export default function WeeklyScheduleEditor({ rows, onChange }) {
  const update = (idx, field, val) => { const n = [...rows]; n[idx] = { ...n[idx], [field]: val }; onChange(n); };
  const remove = (idx) => onChange(rows.filter((_, i) => i !== idx));
  const add = () => onChange([...rows, { day: 'Monday', from: '09:00', to: '17:00', isActive: true }]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500"><span className="font-semibold text-brand-600">{countActiveWindows(rows)}</span> active windows configured</p>
        <button type="button" onClick={add} className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">+ Add Time Range</button>
      </div>

      <div className="space-y-2">
        {rows.map((slot, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-3 p-3 rounded-xl bg-white/60 border border-slate-100 group hover:border-brand-100 transition-colors">
            <select value={slot.day} onChange={e => update(i, 'day', e.target.value)} className="text-sm font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer">
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <input type="time" value={slot.from} onChange={e => update(i, 'from', e.target.value)} className="text-sm font-mono text-slate-700 bg-surface-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-brand-400" />

            <svg className="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>

            <input type="time" value={slot.to} onChange={e => update(i, 'to', e.target.value)} className="text-sm font-mono text-slate-700 bg-surface-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-brand-400" />

            <button type="button" onClick={() => remove(i)} className="text-slate-300 hover:text-rose-500 transition-colors ml-auto" aria-label="Remove time slot">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="text-center py-8 text-sm text-slate-400">
          No schedule configured. <button type="button" onClick={add} className="text-brand-600 font-semibold hover:underline">Add a time range</button>
        </div>
      )}
    </div>
  );
}