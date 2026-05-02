export default function AuthVisualPanel() {
  return (
    <div className="h-full flex flex-col justify-between">
      {}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-brand">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gradient-brand tracking-tight">SlotIQ</span>
        </div>
        <p className="text-slate-500 text-sm mt-1 tracking-wide">Real-time Appointment Intelligence</p>
      </div>

      {}
      <div className="space-y-4 my-8">
        {}
        <div className="float-card animate-float-slow" style={{ animationDelay: '0s' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Live Slot Engine</p>
              <p className="text-xs text-slate-400">Real-time availability sync</p>
            </div>
          </div>
        </div>

        {}
        <div className="float-card animate-float-medium ml-8" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Zero Double Booking</p>
              <p className="text-xs text-slate-400">Atomic capacity enforcement</p>
            </div>
          </div>
        </div>

        {}
        <div className="float-card animate-float-fast" style={{ animationDelay: '1s' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Role-Based Access</p>
              <p className="text-xs text-slate-400">Customer · Organiser · Admin</p>
            </div>
          </div>
        </div>

        {}
        <div className="float-card animate-float-medium ml-4" style={{ animationDelay: '1.5s' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Smart Capacity</p>
              <p className="text-xs text-slate-400">Dynamic slot management</p>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="glass-card p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Live Slot Preview</p>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <span className="slot-indicator slot-available" />
            <span className="text-sm font-medium text-slate-700 w-14">09:00</span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">Available</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="slot-indicator slot-filling" />
            <span className="text-sm font-medium text-slate-700 w-14">09:30</span>
            <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full">Filling Fast</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="slot-indicator slot-full" />
            <span className="text-sm font-medium text-slate-700 w-14">10:00</span>
            <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2.5 py-0.5 rounded-full">Full</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="slot-indicator slot-available" />
            <span className="text-sm font-medium text-slate-700 w-14">10:30</span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}