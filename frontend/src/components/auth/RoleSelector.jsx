export default function RoleSelector({ value, onChange }) {
  const roles = [
    {
      id: 'customer',
      label: 'Customer',
      desc: 'Book appointments',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'organiser',
      label: 'Organiser',
      desc: 'Manage services & slots',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-600">I want to</label>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onChange(role.id)}
            className={`role-card group ${value === role.id ? 'role-selected' : ''}`}
          >
            <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center transition-colors ${
              value === role.id
                ? 'bg-brand-100 text-brand-600'
                : 'bg-surface-200 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-500'
            }`}>
              {role.icon}
            </div>
            <p className={`text-sm font-semibold transition-colors ${value === role.id ? 'text-brand-700' : 'text-slate-700'}`}>{role.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{role.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}