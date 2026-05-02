import { useState } from 'react';
import { updateMyProfile } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';

export default function ProfileEditForm({ userProfile, onUpdate }) {
  const { showToast, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    profile: {
      phone: userProfile?.profile?.phone || '',
      avatarUrl: userProfile?.profile?.avatarUrl || '',
      timezone: userProfile?.profile?.timezone || 'UTC',
      preferences: {
        reminderEmail: userProfile?.profile?.preferences?.reminderEmail ?? true,
        reminderSms: userProfile?.profile?.preferences?.reminderSms ?? false,
        defaultView: userProfile?.profile?.preferences?.defaultView || 'upcoming',
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return showToast('Full name is required', 'error');

    setLoading(true);
    try {
      const res = await updateMyProfile(formData);
      showToast('Profile updated successfully!', 'success');

      if (login) {

      }

      if (onUpdate) onUpdate(res.data.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card-strong p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Personal Details</h2>
        <span className="px-3 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-bold uppercase">Identity & Logic</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name *</label>
          <input
            required
            type="text"
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            className="input-premium !rounded-2xl w-full !py-3"
            placeholder="John Doe"
          />
        </div>

        {}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
          <input
            type="text"
            value={formData.profile.phone}
            onChange={e => setFormData({ ...formData, profile: { ...formData.profile, phone: e.target.value } })}
            className="input-premium !rounded-2xl w-full !py-3"
            placeholder="+1 234 567 890"
          />
        </div>

        {}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Avatar Image URL</label>
          <input
            type="text"
            value={formData.profile.avatarUrl}
            onChange={e => setFormData({ ...formData, profile: { ...formData.profile, avatarUrl: e.target.value } })}
            className="input-premium !rounded-2xl w-full !py-3"
            placeholder="https://..."
          />
        </div>

        {}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Timezone</label>
          <select
            value={formData.profile.timezone}
            onChange={e => setFormData({ ...formData, profile: { ...formData.profile, timezone: e.target.value } })}
            className="input-premium !rounded-2xl w-full !py-3 !text-sm"
          >
            <option value="UTC">UTC (Universal)</option>
            <option value="IST">IST (India)</option>
            <option value="EST">EST (New York)</option>
            <option value="PST">PST (California)</option>
            <option value="GMT">GMT (London)</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-100/50 pt-8">
        <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-500 rounded-full" />
          Notification Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
            <div>
              <p className="text-sm font-bold text-slate-700">Email Reminders</p>
              <p className="text-[11px] text-slate-400">Get notified about upcoming bookings</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({
                ...formData,
                profile: {
                  ...formData.profile,
                  preferences: { ...formData.profile.preferences, reminderEmail: !formData.profile.preferences.reminderEmail }
                }
              })}
              className={`w-12 h-6 rounded-full transition-colors relative ${formData.profile.preferences.reminderEmail ? 'bg-brand-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.profile.preferences.reminderEmail ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
            <div>
              <p className="text-sm font-bold text-slate-700">SMS Reminders</p>
              <p className="text-[11px] text-slate-400">Receive mobile alerts (Coming Soon)</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({
                ...formData,
                profile: {
                  ...formData.profile,
                  preferences: { ...formData.profile.preferences, reminderSms: !formData.profile.preferences.reminderSms }
                }
              })}
              className={`w-12 h-6 rounded-full transition-colors relative ${formData.profile.preferences.reminderSms ? 'bg-brand-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.profile.preferences.reminderSms ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          disabled={loading}
          type="submit"
          className="btn-brand !rounded-2xl !py-4 !px-12 !text-base shadow-xl hover:shadow-brand-500/20 active:scale-95 transition-all"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </div>
          ) : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}