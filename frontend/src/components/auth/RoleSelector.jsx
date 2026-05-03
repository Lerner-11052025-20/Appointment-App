export default function RoleSelector({ value, onChange }) {
  const roles = [
    {
      id: 'customer',
      label: 'Customer',
      desc: 'Book appointments',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'organiser',
      label: 'Organiser',
      desc: 'Manage services & slots',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-1.5 mt-2">
      <label className="block text-[11px] font-semibold text-slate-700">Account Type</label>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const isSelected = value === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id)}
              className={`relative overflow-hidden group rounded-xl p-3 text-left transition-all duration-300 flex items-center gap-3 ${isSelected
                  ? 'bg-violet-50 border-2 border-violet-500 shadow-md scale-[1.02]'
                  : 'bg-slate-50 border-2 border-transparent hover:border-violet-200 hover:bg-violet-50/50'
                }`}
            >
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center transition-colors ${isSelected
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                  : 'bg-white text-slate-400 shadow-sm group-hover:text-violet-500'
                }`}>
                <div className="scale-75">{role.icon}</div>
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-violet-900' : 'text-slate-700'}`}>{role.label}</p>
                <p className={`text-[9px] truncate mt-0.5 font-medium transition-colors ${isSelected ? 'text-violet-600/80' : 'text-slate-500'}`}>{role.desc}</p>
              </div>

              {isSelected && (
                <div className="absolute top-1.5 right-1.5 text-violet-600">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}