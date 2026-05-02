export default function FlexibleScheduleEditor({ rows, onChange }) {
  const update = (idx, field, val) => { const n = [...rows]; n[idx] = { ...n[idx], [field]: val }; onChange(n); };
  const remove = (idx) => onChange(rows.filter((_, i) => i !== idx));
  const add = () => onChange([...rows, { date: '', from: '09:00', to: '17:00', isActive: true }]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500"><span className="font-semibold text-brand-600">{rows.length}</span> flexible dates</p>
        <button type="button" onClick={add} className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">+ Add Date</button>
      </div>
      {rows.map((slot, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-slate-100">
          <input type="date" value={slot.date} onChange={e => update(i, 'date', e.target.value)} className="text-sm text-slate-700 bg-surface-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-brand-400" />
          <input type="time" value={slot.from} onChange={e => update(i, 'from', e.target.value)} className="text-sm font-mono text-slate-700 bg-surface-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-brand-400" />
          <svg className="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          <input type="time" value={slot.to} onChange={e => update(i, 'to', e.target.value)} className="text-sm font-mono text-slate-700 bg-surface-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-brand-400" />
          <button type="button" onClick={() => remove(i)} className="text-slate-300 hover:text-rose-500 transition-colors ml-auto" aria-label="Remove date slot">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      ))}
      {rows.length === 0 && <p className="text-center py-6 text-sm text-slate-400">No flexible dates. <button type="button" onClick={add} className="text-brand-600 font-semibold">Add one</button></p>}
    </div>
  );
}