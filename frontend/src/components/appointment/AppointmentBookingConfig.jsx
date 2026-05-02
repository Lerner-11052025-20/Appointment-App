import { useState, useEffect } from 'react';
import { getResources } from '../../services/resourceService';
import { getProviders } from '../../services/userService';

export default function AppointmentBookingConfig({ data, onChange }) {
  const [resources, setResources] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    getResources().then(r => setResources(r.data || [])).catch(() => {});
    getProviders().then(r => setProviders(r.data || [])).catch(() => {});
  }, []);

  const toggleSelection = (list, id, field) => {
    const current = data[field] || [];
    if (current.includes(id)) {
      onChange({ ...data, [field]: current.filter(x => x !== id) });
    } else {
      onChange({ ...data, [field]: [...current, id] });
    }
  };

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Assignment & Type</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Booking Type</label>
            <select
              className="input-premium !rounded-xl !text-sm w-full"
              value={data.bookingType?.type || 'user'}
              onChange={e => onChange({ ...data, bookingType: { type: e.target.value } })}
            >
              <option value="user">User (Provider)</option>
              <option value="resource">Resource (Room, Equipment)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Assignment Mode</label>
            <select
              className="input-premium !rounded-xl !text-sm w-full"
              value={data.assignmentMode || 'automatic'}
              onChange={e => onChange({ ...data, assignmentMode: e.target.value })}
            >
              <option value="automatic">Automatic (Any Available)</option>
              <option value="by_visitor">Visitor Selection</option>
            </select>
          </div>
        </div>

        {data.bookingType?.type === 'user' ? (
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Assigned Providers</label>
            <div className="flex flex-wrap gap-2">
              {providers.map(p => {
                const selected = (data.assignedUsers || []).includes(p._id);
                return (
                  <button
                    key={p._id}
                    onClick={() => toggleSelection(providers, p._id, 'assignedUsers')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selected ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300'}`}
                  >
                    {selected && '✓ '} {p.fullName}
                  </button>
                );
              })}
              {providers.length === 0 && <span className="text-xs text-slate-400">No providers found.</span>}
            </div>
          </div>
        ) : (
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Assigned Resources</label>
            <div className="flex flex-wrap gap-2">
              {resources.map(r => {
                const selected = (data.assignedResources || []).includes(r._id);
                return (
                  <button
                    key={r._id}
                    onClick={() => toggleSelection(resources, r._id, 'assignedResources')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${selected ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300'}`}
                  >
                    {selected && '✓ '} {r.name}
                  </button>
                );
              })}
              {resources.length === 0 && <span className="text-xs text-slate-400">No resources found. Create some in Manage Resources.</span>}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={data.capacity?.manageCapacity || false} onChange={e => onChange({ ...data, capacity: { ...data.capacity, manageCapacity: e.target.checked } })} className="w-4 h-4 rounded text-brand-600 border-slate-300 focus:ring-brand-500" />
          <span className="text-sm font-medium text-slate-700">Manage Capacity</span>
        </label>
        {data.capacity?.manageCapacity && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Max Simultaneous Bookings per Slot</label>
              <input type="number" min={1} value={data.capacity?.maxSimultaneous || 1} onChange={e => onChange({ ...data, capacity: { ...data.capacity, maxSimultaneous: Number(e.target.value) } })} className="input-premium !rounded-xl !text-sm w-full" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Capacity Per User (Seats)</label>
              <input type="number" min={1} value={data.capacity?.capacityPerSlot || 1} onChange={e => onChange({ ...data, capacity: { ...data.capacity, capacityPerSlot: Number(e.target.value) } })} className="input-premium !rounded-xl !text-sm w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}