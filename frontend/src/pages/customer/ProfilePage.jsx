import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import profileService from '../../services/profileService';
import ProfileHeroCard from '../../components/profile/ProfileHeroCard';
import ProfileStats from '../../components/profile/ProfileStats';
import ProfileEditForm from '../../components/profile/ProfileEditForm';
import ProfileTabs from '../../components/profile/ProfileTabs';
import ProfileAppointmentTimeline from '../../components/profile/ProfileAppointmentTimeline';

export default function ProfilePage() {
  const { showToast } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [appointments, setAppointments] = useState({ upcoming: [], past: [], cancelled: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, apptsRes] = await Promise.all([
        profileService.getMyProfile(),
        profileService.getMyProfileAppointments()
      ]);
      setProfileData(profileRes.data.data);
      setAppointments(apptsRes.data.data);
    } catch (err) {
      showToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
          <div className="h-64 bg-white/50 rounded-[2rem] border border-slate-100" />
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/50 rounded-[2rem] border border-slate-100" />)}
          </div>
          <div className="h-96 bg-white/50 rounded-[2rem] border border-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-24">
      {}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-cyan-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] bg-amber-50/30 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {}
        <div className="flex items-center justify-between mb-10">
          <a href="/customer/dashboard" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-brand-50 group-hover:border-brand-200 transition-all shadow-sm">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </div>
            <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Back to Dashboard</span>
          </a>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Profile Center</h2>
        </div>

        <div className="space-y-12">
          {}
          <ProfileHeroCard profileData={profileData} />

          {}
          <ProfileStats stats={appointments.stats} />

          {}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3 mb-2 px-2">
                <div className="w-2 h-8 bg-brand-500 rounded-full" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Identity Settings</h2>
              </div>
              <ProfileEditForm userProfile={profileData} onUpdate={setProfileData} />
            </div>

            {}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between mb-2 px-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Booking Timeline</h2>
                </div>
              </div>

              <div className="glass-card-strong p-8">
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={appointments.stats} />
                <ProfileAppointmentTimeline appointments={appointments[activeTab]} type={activeTab} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}