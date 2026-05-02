import AppointmentImageUploader from './AppointmentImageUploader';

export default function AppointmentBasicInfo({ data, onChange }) {
  const update = (field, val) => onChange({ ...data, [field]: val });

  return (
    <div className="space-y-5">
      {}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Appointment Title</label>
        <input value={data.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Dental Care" className="w-full text-2xl md:text-3xl font-bold text-slate-900 bg-transparent border-b-2 border-slate-200 focus:border-brand-500 outline-none pb-2 transition-colors placeholder:text-slate-200" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Description</label>
        <textarea value={data.description} onChange={e => update('description', e.target.value)} placeholder="Brief description of this appointment..." rows={2} className="input-premium !rounded-xl resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Duration</label>
          <input type="number" min={1} value={data.duration} onChange={e => update('duration', Number(e.target.value))} className="input-premium !rounded-xl" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Unit</label>
          <select value={data.durationUnit} onChange={e => update('durationUnit', e.target.value)} className="input-premium !rounded-xl">
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Location</label>
        <input value={data.location} onChange={e => update('location', e.target.value)} placeholder="e.g. Doctor's Office" className="input-premium !rounded-xl" />
      </div>

      {}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className={`w-10 h-6 rounded-full transition-colors flex items-center ${data.isOnline ? 'bg-brand-500' : 'bg-slate-200'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${data.isOnline ? 'translate-x-4' : ''}`} />
        </div>
        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">Online Appointment</span>
      </label>
      <input type="checkbox" className="hidden" checked={data.isOnline} onChange={e => update('isOnline', e.target.checked)} />

      {(!data.location && !data.isOnline) && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
          ⚡ No location set. This will be treated as an online appointment.
        </p>
      )}

      {}
      <div className="pt-4 border-t border-slate-100 mt-4">
        <AppointmentImageUploader imageUrl={data.imageUrl} onChange={url => update('imageUrl', url)} />
      </div>
    </div>
  );
}