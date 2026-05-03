export default function AuthVisualPanel() {
  return (
    <div className="h-full flex flex-col justify-center max-w-md mx-auto w-full pt-8 pb-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-3xl font-extrabold text-violet-700 tracking-tight">SlotIQ</span>
        </div>
        <p className="text-slate-500 text-base font-medium">Real-time Appointment Intelligence</p>
      </div>

      {/* Staggered Feature Cards */}
      <div className="space-y-4 mb-12 relative">
        {/* Feature 1 */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 pr-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center gap-4 mr-8 transform transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Live Slot Engine</p>
            <p className="text-xs font-medium text-slate-400">Real-time availability sync</p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 pr-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center gap-4 ml-10 transform transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Zero Double Booking</p>
            <p className="text-xs font-medium text-slate-400">Atomic capacity enforcement</p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 pr-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center gap-4 mr-8 transform transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Role-Based Access</p>
            <p className="text-xs font-medium text-slate-400">Customer · Organiser · Admin</p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 pr-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center gap-4 ml-10 transform transition-transform hover:-translate-y-1">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Smart Capacity</p>
            <p className="text-xs font-medium text-slate-400">Dynamic slot management</p>
          </div>
        </div>
      </div>

      {/* Live Slot Preview */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-5">Live Slot Preview</p>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-base font-semibold text-slate-700 w-16">09:00</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">Available</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            <span className="text-base font-semibold text-slate-700 w-16">09:30</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">Filling Fast</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
            <span className="text-base font-semibold text-slate-700 w-16">10:00</span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-lg">Full</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-base font-semibold text-slate-700 w-16">10:30</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}