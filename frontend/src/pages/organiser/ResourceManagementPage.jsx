import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getResources, createResource, deleteResource, updateResource } from '../../services/resourceService';
import AppointmentStudioLayout from '../../components/appointment/AppointmentStudioLayout';

export default function ResourceManagementPage() {
  const { showToast } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', type: 'room', location: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadResources = async () => {
    setLoading(true);
    try {
      const res = await getResources();
      setResources(res.data || []);
    } catch {
      showToast('Failed to load resources.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return showToast('Name is required', 'error');
    setSubmitting(true);
    try {
      await createResource(formData);
      showToast('Resource created!', 'success');
      setFormData({ name: '', code: '', type: 'room', location: '', description: '' });
      setShowAddForm(false);
      loadResources();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create resource', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await deleteResource(id);
      showToast('Resource deleted!', 'success');
      loadResources();
    } catch {
      showToast('Failed to delete resource', 'error');
    }
  };

  return (
    <AppointmentStudioLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Manage Resources</h1>
          <p className="text-slate-500 mt-1">Add and manage rooms, equipment, or locations.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-brand !rounded-xl !py-2.5 !px-5 !text-sm"
        >
          {showAddForm ? 'Cancel' : '+ Add Resource'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card-strong p-6 mb-8 animate-slide-up">
          <h2 className="text-lg font-bold text-slate-800 mb-4">New Resource</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block font-bold uppercase tracking-wider">Resource Name *</label>
              <input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Conference Room A"
                className="input-premium !rounded-xl w-full"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block font-bold uppercase tracking-wider">Code / ID</label>
              <input
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. RM-101"
                className="input-premium !rounded-xl w-full"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block font-bold uppercase tracking-wider">Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="input-premium !rounded-xl w-full !text-sm"
              >
                <option value="room">Room</option>
                <option value="equipment">Equipment</option>
                <option value="court">Court</option>
                <option value="desk">Desk</option>
                <option value="doctor_chair">Doctor Chair</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block font-bold uppercase tracking-wider">Location</label>
              <input
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. 2nd Floor, Main Building"
                className="input-premium !rounded-xl w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-500 mb-1 block font-bold uppercase tracking-wider">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details about this resource..."
                className="input-premium !rounded-xl w-full"
                rows={2}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button disabled={submitting} type="submit" className="btn-brand !rounded-xl !py-2.5 !px-8">
                {submitting ? 'Creating...' : 'Create Resource'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="loader-ring-brand w-10 h-10 rounded-full" /></div>
      ) : resources.length === 0 ? (
        <div className="glass-card-strong p-12 text-center">
          <h3 className="text-lg font-bold text-slate-700 mb-1">No resources found</h3>
          <p className="text-sm text-slate-400">Add resources to assign them to your appointments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(r => (
            <div key={r._id} className="glass-card-strong p-5 hover:border-brand-200 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-xl">
                  {r.type === 'room' ? '🏢' : r.type === 'equipment' ? '🛠️' : r.type === 'court' ? '🎾' : r.type === 'desk' ? '💻' : r.type === 'doctor_chair' ? '💺' : '📦'}
                </div>
                <button onClick={() => handleDelete(r._id)} className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              <h3 className="font-bold text-slate-800">{r.name}</h3>
              {r.code && <p className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded inline-block mt-1">{r.code}</p>}
              <div className="mt-3 space-y-1.5">
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="text-slate-400">📍</span> {r.location || 'No location set'}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="text-slate-400">📄</span> {r.description || 'No description'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppointmentStudioLayout>
  );
}