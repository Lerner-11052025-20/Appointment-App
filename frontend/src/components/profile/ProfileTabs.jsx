export default function ProfileTabs({ activeTab, setActiveTab, counts }) {
  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: counts?.upcoming || 0 },
    { id: 'past', label: 'Past', count: counts?.past || 0 },
    { id: 'cancelled', label: 'Cancelled', count: counts?.cancelled || 0 },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all
              ${isActive
                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/20 scale-105'
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}
            `}
          >
            {tab.label}
            <span className={`
              text-[10px] px-2 py-0.5 rounded-full
              ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}
            `}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}