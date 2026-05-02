export default function OptionsPanel({ options, onChange }) {
  const u = (f, v) => onChange({ ...options, [f]: v });
  const Toggle = ({ checked, onToggle, label, desc }) => (
    <label className="flex items-center justify-between p-4 rounded-2xl bg-white/60 border border-slate-100 cursor-pointer hover:border-brand-100 transition-colors">
      <div><p className="text-sm font-semibold text-slate-800">{label}</p><p className="text-xs text-slate-400">{desc}</p></div>
      <div className={`w-10 h-6 rounded-full transition-colors flex items-center ${checked ? 'bg-brand-500' : 'bg-slate-200'}`} onClick={onToggle}>
        <div className={`w-4 h-4 bg-white rounded-full shadow mx-1 transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </div>
    </label>
  );

  return (
    <div className="space-y-3">
      <Toggle checked={options.manualConfirmation} onToggle={() => u('manualConfirmation', !options.manualConfirmation)} label="Manual Confirmation" desc="Review bookings before confirming" />
      <Toggle checked={options.advancePayment} onToggle={() => u('advancePayment', !options.advancePayment)} label="Advance Payment" desc="Require payment before booking" />
      {options.advancePayment && (
        <div className="pl-4"><label className="text-xs text-slate-500 mb-1 block">Payment Amount (₹)</label>
          <input type="number" min={0} value={options.paymentAmount} onChange={e => u('paymentAmount', Number(e.target.value))} className="input-premium !rounded-xl !text-sm !w-40" />
        </div>
      )}
      <Toggle checked={options.allowCancellation} onToggle={() => u('allowCancellation', !options.allowCancellation)} label="Allow Cancellation" desc="Customers can cancel bookings" />
      {options.allowCancellation && (
        <div className="pl-4"><label className="text-xs text-slate-500 mb-1 block">Cancellation Window (hours)</label>
          <input type="number" min={0} value={options.cancellationWindowHours} onChange={e => u('cancellationWindowHours', Number(e.target.value))} className="input-premium !rounded-xl !text-sm !w-40" />
        </div>
      )}
      <Toggle checked={options.allowReschedule} onToggle={() => u('allowReschedule', !options.allowReschedule)} label="Allow Reschedule" desc="Customers can change date/time" />
      {options.allowReschedule && (
        <div className="pl-4"><label className="text-xs text-slate-500 mb-1 block">Reschedule Window (hours)</label>
          <input type="number" min={0} value={options.rescheduleWindowHours} onChange={e => u('rescheduleWindowHours', Number(e.target.value))} className="input-premium !rounded-xl !text-sm !w-40" />
        </div>
      )}
    </div>
  );
}