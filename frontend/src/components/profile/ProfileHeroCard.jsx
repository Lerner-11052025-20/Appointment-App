import { useAuth } from '../../context/AuthContext';

export default function ProfileHeroCard({ profileData }) {
  const { user } = useAuth();
  const userData = profileData || user;

  const initials = userData?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <div className="relative group">
      {}
      <div className="absolute -inset-4 border border-brand-200/30 rounded-[2.5rem] animate-pulse-slow pointer-events-none" />
      <div className="absolute -inset-8 border border-brand-100/20 rounded-[3rem] animate-pulse-slow pointer-events-none [animation-delay:1s]" />

      <div className="glass-card-strong p-8 relative overflow-hidden">
        {}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-500/10 to-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {}
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl relative z-10 overflow-hidden">
              {userData?.profile?.avatarUrl ? (
                <img src={userData.profile.avatarUrl} alt={userData.fullName} className="w-full h-full object-cover" />
              ) : initials}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 border-4 border-white flex items-center justify-center text-white z-20 shadow-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>

          {}
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{userData?.fullName}</h1>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-wider border border-brand-100 shadow-sm">
                  {userData?.role}
                </span>
                {userData?.isVerified && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 shadow-sm">
                    Verified
                  </span>
                )}
              </div>
            </div>

            <p className="text-slate-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {userData?.email}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-medium">Active Account</span>
              </div>
              <div className="text-slate-400">
                Joined <span className="text-slate-600 font-bold ml-1">{new Date(userData?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="mt-8 pt-6 border-t border-slate-100/50 flex items-center justify-between flex-wrap gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            Your personal booking command center
          </p>
          <div className="flex -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center overflow-hidden">
                 <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
               </div>
             ))}
             <div className="w-8 h-8 rounded-full bg-brand-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-brand-600">
               +12
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}