export default function MiscPanel({ misc, onChange }) {
  const u = (f, v) => onChange({ ...misc, [f]: v });
  const Field = ({ label, field, placeholder, rows = 3 }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
      <textarea value={misc[field] || ''} onChange={e => u(field, e.target.value)} placeholder={placeholder} rows={rows} className="input-premium !rounded-xl resize-none" />
    </div>
  );
  return (
    <div className="space-y-4">
      <Field label="Internal Notes" field="internalNotes" placeholder="Private notes visible only to organisers..." />
      <Field label="Confirmation Message" field="confirmationMessage" placeholder="Message shown to customers after booking..." />
      <Field label="Venue Instructions" field="venueInstructions" placeholder="Directions, parking info, building entry..." />
      <Field label="Additional Terms" field="additionalTerms" placeholder="Terms & conditions for this appointment..." />
    </div>
  );
}