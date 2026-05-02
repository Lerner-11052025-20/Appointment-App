export default function AppointmentImageUploader({ imageUrl, onChange }) {

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">Image URL</label>
      <input value={imageUrl || ''} onChange={e => onChange(e.target.value)} placeholder="https://example.com/image.jpg" className="input-premium !rounded-xl !text-sm" />
      {imageUrl && (
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-100">
          <img src={imageUrl} alt="Appointment" className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
          <button type="button" onClick={() => onChange('')} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 text-slate-500 hover:text-rose-500 flex items-center justify-center text-xs font-bold" aria-label="Remove image">✕</button>
        </div>
      )}
    </div>
  );
}