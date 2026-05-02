export default function AppointmentCard({ appointment, onShare, onEdit }) {
  const { basicInfo, publish, assignedUsers = [], assignedResources = [], upcomingMeetingsCount = 0, bookingType } = appointment;
  const isPublished = publish?.isPublished;
  const chips = bookingType?.type === 'resource'
    ? assignedResources.map((r, i) => ({ label: r.code || r.name || `R${i + 1}`, color: 'bg-cyan-50 text-cyan-700 border-cyan-200' }))
    : assignedUsers.map((u, i) => ({ label: u.fullName?.split(' ')[0] || `A${i + 1}`, color: 'bg-brand-50 text-brand-700 border-brand-200' }));

  return (
    <div className="group relative bg-white/75 backdrop-blur-xl border border-white/70 rounded-[1.75rem] shadow-[0_8px_40px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_56px_rgba(15,23,42,0.09)] transition-all duration-300 hover:-translate-y-0.5 p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-slate-900 truncate">{basicInfo?.title || 'Untitled'}</h3>
            {isPublished ? (
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                Published
              </div>
            ) : (
              <div className="bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                Draft
              </div>
            )}
          </div>
          <p className="text-sm text-slate-400">{basicInfo?.duration} {basicInfo?.durationUnit === 'hours' ? 'Hr' : 'Min'} Duration</p>
        </div>

        {}
        <div className="flex flex-wrap gap-1.5">
          {chips.length === 0 && <span className="text-xs text-slate-300 italic">No assignees</span>}
          {chips.map((c, i) => (
            <span key={i} className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${c.color}`}>{c.label}</span>
          ))}
        </div>

        {}
        <div className="text-sm text-slate-500 whitespace-nowrap">
          <span className="font-semibold text-slate-700">{upcomingMeetingsCount}</span> Meeting{upcomingMeetingsCount !== 1 ? 's' : ''} Upcoming
        </div>

        {}
        <div className="flex items-center gap-2">
          <button onClick={() => onShare(appointment)} className="btn-ghost !py-2 !px-3.5 !text-xs !rounded-xl" aria-label="Share appointment link">
            <svg className="w-3.5 h-3.5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            Share
          </button>
          <button onClick={() => onEdit(appointment)} className="btn-brand !py-2 !px-3.5 !text-xs !rounded-xl !shadow-md">
            <svg className="w-3.5 h-3.5 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}