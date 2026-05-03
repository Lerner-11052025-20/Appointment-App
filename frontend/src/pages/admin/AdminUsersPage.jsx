import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAllUsers, updateUserStatus, updateUserRole } from '../../services/adminService';
import AdminShell from '../../components/admin/AdminShell';

const ROLE_STYLES = {
  customer: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  organiser: 'bg-violet-50 text-violet-700 border-violet-100',
  admin: 'bg-rose-50 text-rose-700 border-rose-100',
};

export default function AdminUsersPage() {
  const { user: me, showToast } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getAllUsers({ search, role: roleFilter, status: statusFilter, page, limit: 15 });
      setUsers(r.data.users);
      setTotal(r.data.total);
      setTotalPages(r.data.totalPages);
    } catch {
      showToast('Failed to load users.', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => { setPage(1); }, [search, roleFilter, statusFilter]);

  const handleStatusChange = async () => {
    if (!modal) return;
    setActionLoading(true);
    try {
      await updateUserStatus(modal.user._id, !modal.user.isActive);
      showToast(`Account ${modal.user.isActive ? 'deactivated' : 'activated'} successfully.`, 'success');
      setModal(null);
      fetchUsers();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!modal) return;
    setActionLoading(true);
    try {
      await updateUserRole(modal.user._id, modal.newRole);
      showToast(`Role updated to '${modal.newRole}' successfully.`, 'success');
      setModal(null);
      fetchUsers();
    } catch (e) {
      showToast(e.response?.data?.message || 'Failed to update role.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  let debounceTimer;
  const handleSearch = (val) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setSearch(val), 300);
  };

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Registry</h1>
        <p className="text-sm font-medium text-slate-400 mt-1">View, search, and manage all platform accounts. Total: {total}</p>
      </div>

      <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)] mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name or email..."
            defaultValue={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all"
          />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-200">
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="organiser">Organiser</option>
            <option value="admin">Admin</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-200">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white/75 backdrop-blur-xl border border-white/70 rounded-[2rem] shadow-[0_24px_80px_rgba(15,23,42,0.06)] overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100/80 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-2xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-slate-800">No users found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['User', 'Role', 'Status', 'Verified', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-black shrink-0">
                            {u.fullName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{u.fullName}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border ${ROLE_STYLES[u.role]}`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl ${u.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold ${u.isVerified ? 'text-blue-600' : 'text-amber-500'}`}>{u.isVerified ? '✓ Verified' : 'Unverified'}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/admin/users/${u._id}`)} className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors" aria-label={`View ${u.fullName}`}>View</button>
                          {u._id !== me?._id && (
                            <>
                              <button onClick={() => setModal({ type: 'status', user: u })} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-colors ${u.isActive ? 'text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100' : 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'}`} aria-label={`Toggle status for ${u.fullName}`}>
                                {u.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button onClick={() => setModal({ type: 'role', user: u, newRole: u.role })} className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 hover:bg-violet-100 transition-colors" aria-label={`Change role for ${u.fullName}`}>Role</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden p-4 space-y-3">
              {users.map(u => (
                <div key={u._id} className="p-4 rounded-2xl bg-white/60 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-black">{u.fullName?.charAt(0)?.toUpperCase()}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{u.fullName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${ROLE_STYLES[u.role]}`}>{u.role}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${u.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => navigate(`/admin/users/${u._id}`)} className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200">View</button>
                    {u._id !== me?._id && (
                      <>
                        <button onClick={() => setModal({ type: 'status', user: u })} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border ${u.isActive ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>{u.isActive ? 'Deactivate' : 'Activate'}</button>
                        <button onClick={() => setModal({ type: 'role', user: u, newRole: u.role })} className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200">Role</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-100">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 disabled:opacity-40">← Prev</button>
                <span className="text-xs font-bold text-slate-500">Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => !actionLoading && setModal(null)}>
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
            {modal.type === 'status' ? (
              <>
                <h3 className="text-lg font-black text-slate-900 mb-2">{modal.user.isActive ? 'Deactivate Account?' : 'Activate Account?'}</h3>
                <p className="text-sm text-slate-500 mb-1 font-bold">{modal.user.fullName} ({modal.user.email})</p>
                <p className="text-sm text-slate-400 mb-6">
                  {modal.user.isActive ? 'This user will not be able to login until reactivated.' : 'This user will regain access to the platform.'}
                </p>
                <div className="flex gap-3 justify-end">
                  <button disabled={actionLoading} onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                  <button disabled={actionLoading} onClick={handleStatusChange} className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all ${modal.user.isActive ? 'bg-gradient-to-r from-rose-500 to-rose-600' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'}`}>
                    {actionLoading ? '···' : modal.user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-black text-slate-900 mb-2">Change Role</h3>
                <p className="text-sm text-slate-500 mb-1 font-bold">{modal.user.fullName} ({modal.user.email})</p>
                <p className="text-xs text-slate-400 mb-4">Current role: <span className="font-bold uppercase">{modal.user.role}</span></p>
                <select value={modal.newRole} onChange={e => setModal({ ...modal, newRole: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 mb-2 outline-none focus:ring-2 focus:ring-violet-200">
                  <option value="customer">Customer</option>
                  <option value="organiser">Organiser</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-[10px] text-amber-500 font-bold mb-6">⚠ Changing a role updates access permissions immediately.</p>
                <div className="flex gap-3 justify-end">
                  <button disabled={actionLoading} onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                  <button disabled={actionLoading || modal.newRole === modal.user.role} onClick={handleRoleChange} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 shadow-lg disabled:opacity-40 transition-all">
                    {actionLoading ? '···' : 'Update Role'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
