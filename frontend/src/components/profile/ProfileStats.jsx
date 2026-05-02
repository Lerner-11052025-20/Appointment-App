export default function ProfileStats({ stats }) {
  const items = [
    { label: 'Total Bookings', value: stats?.total || 0, color: 'brand', icon: '📅' },
    { label: 'Upcoming', value: stats?.upcoming || 0, color: 'indigo', icon: '🚀' },
    { label: 'Completed', value: stats?.past || 0, color: 'emerald', icon: '✅' },
    { label: 'Cancelled', value: stats?.cancelled || 0, color: 'rose', icon: '❌' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="glass-card-strong p-6 text-center hover:scale-[1.02] transition-transform cursor-default group">
          <div className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
          <p className={`text-3xl font-black bg-gradient-to-br from-slate-800 to-slate-500 bg-clip-text text-transparent mb-1`}>
            {item.value}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
        </div>
      ))}
    </div>
  );
}