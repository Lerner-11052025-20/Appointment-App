import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserById, updateUserStatus, updateUserRole } from '../../services/adminService';
import AdminShell from '../../components/admin/AdminShell';

const ROLE_STYLES = {
  customer: 'from-cyan-500 to-cyan-700',
  organiser: 'from-violet-500 to-violet-700',
  admin: 'from-rose-500 to-rose-700',
};

export default function AdminUserDetailsPage() {
  const { id } = useParams();
  const { user: me, showToast } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const r = await getUserById(id);
      setUserData(r.data);
    } catch {
      showToast('Failed to load user.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, [id]);

  const handleToggleStatus = async () => {
    setActionLoading(true);
    try {
      await updateUserStatus(id, !userData.isActive);
      showToast(`Account ${userData.isActive ? 'deactivated' : 'activated'}.`, 'success');
      fetchUser();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async (newRole) => {
    setActionLoading(true);
    try {
      await updateUserRole(id, newRole);
      showToast(`Role updated to '${newRole}'.`, 'success');
      fetchUser();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex justify-center py-32"><div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" /></div>
      </AdminShell>
    );
  }

  if (!userData) {
    return (
      <AdminShell>
        <div className="flex flex-col items-center py-32">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-2xl mb-4">⚠</div>
          <h3 className="text-lg font-bold text-slate-800">User Not Found</h3>
          <button onClick={() => navigate('/admin/users')} className="mt-4 px-5 py-2 rounded-xl text-sm font-bold text-violet-600 bg-violet-50 border border-violet-200">← Back to Users</button>
        </div>
      </AdminShell>
    );
  }

  const u = userData;
  const a = u.activitySummary || {};
  const isSelf = u._id === me?._id;

  return (
    <AdminShell>
      <button onClick={() => navigate('/admin/users')} className="mb-6 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-white/60 border border-slate-200 hover:bg-slate-50 transition-colors">← Back to Users</button>

      <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${ROLE_STYLES[u.role]} flex items-center justify-center text-white text-3xl font-black shadow-xl`}>
            {u.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-slate-900">{u.fullName}</h1>
            <p className="text-sm text-slate-500">{u.email}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl text-white bg-gradient-to-r ${ROLE_STYLES[u.role]}`}>{u.role}</span>
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border ${u.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border ${u.isVerified ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{u.isVerified ? 'Verified' : 'Unverified'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-4">Account Details</h2>
          <div className="space-y-3">
            {[
              { label: 'Full Name', value: u.fullName },
              { label: 'Email', value: u.email },
              { label: 'Phone', value: u.profile?.phone || 'Not set' },
              { label: 'Timezone', value: u.profile?.timezone || 'UTC' },
              { label: 'Joined', value: new Date(u.createdAt).toLocaleDateString() },
              { label: 'Last Login', value: u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never' },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <span className="text-xs font-bold text-slate-400">{item.label}</span>
                <span className="text-sm font-bold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-4">Activity Summary</h2>
          {u.role === 'customer' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100 text-center">
                <p className="text-3xl font-black text-cyan-600">{a.bookingCount || 0}</p>
                <p className="text-xs font-bold text-cyan-700 mt-1">Total Bookings</p>
              </div>
              {(a.recentBookings || []).length > 0 && (
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-2">Recent Bookings</p>
                  {a.recentBookings.map(b => (
                    <div key={b._id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <span className="text-xs font-bold text-slate-700">{b.appointment?.basicInfo?.title || 'Appointment'}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : b.status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {u.role === 'organiser' && (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 text-center">
                <p className="text-2xl font-black text-violet-600">{a.appointmentTypesCount || 0}</p>
                <p className="text-[10px] font-bold text-violet-700 mt-1">Services</p>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
                <p className="text-2xl font-black text-indigo-600">{a.publishedCount || 0}</p>
                <p className="text-[10px] font-bold text-indigo-700 mt-1">Published</p>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100 text-center col-span-2">
                <p className="text-2xl font-black text-cyan-600">{a.resourcesCount || 0}</p>
                <p className="text-[10px] font-bold text-cyan-700 mt-1">Resources</p>
              </div>
            </div>
          )}
          {u.role === 'admin' && (
            <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-100 text-center">
              <span className="text-3xl">🔐</span>
              <p className="text-sm font-bold text-rose-700 mt-2">System Administrator</p>
              <p className="text-xs text-rose-500 mt-1">Full platform access</p>
            </div>
          )}
        </div>
      </div>

      {!isSelf && (
        <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] mb-4">Account Controls</h2>
          <div className="flex flex-wrap gap-3">
            <button
              disabled={actionLoading}
              onClick={handleToggleStatus}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all disabled:opacity-40 ${u.isActive ? 'text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100' : 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'}`}
            >
              {u.isActive ? 'Deactivate Account' : 'Activate Account'}
            </button>
            <select
              disabled={actionLoading}
              value={u.role}
              onChange={e => handleRoleChange(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 outline-none disabled:opacity-40"
            >
              <option value="customer">Customer</option>
              <option value="organiser">Organiser</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
