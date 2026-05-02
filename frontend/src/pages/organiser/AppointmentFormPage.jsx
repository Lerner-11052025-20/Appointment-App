import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createAppointment, getAppointmentById, updateAppointment, publishAppointment, unpublishAppointment } from '../../services/appointmentService';
import { INITIAL_APPOINTMENT } from '../../utils/scheduleUtils';
import AppointmentStudioLayout from '../../components/appointment/AppointmentStudioLayout';
import AppointmentBasicInfo from '../../components/appointment/AppointmentBasicInfo';
import AppointmentBookingConfig from '../../components/appointment/AppointmentBookingConfig';
import ScheduleEditor from '../../components/appointment/ScheduleEditor';
import QuestionBuilder from '../../components/appointment/QuestionBuilder';
import OptionsPanel from '../../components/appointment/OptionsPanel';
import MiscPanel from '../../components/appointment/MiscPanel';
import PublishConfirmModal from '../../components/appointment/PublishConfirmModal';
import ShareLinkModal from '../../components/appointment/ShareLinkModal';

const TABS = [
  { id: 'general', label: 'General Info', icon: '📝' },
  { id: 'schedule', label: 'Availability', icon: '⏰' },
  { id: 'questions', label: 'Form Questions', icon: '❓' },
  { id: 'rules', label: 'Booking Rules', icon: '🛡️' },
  { id: 'advanced', label: 'Advanced Settings', icon: '⚙️' }
];

export default function AppointmentFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const base = user?.role === 'admin' ? '/admin' : '/organiser';

  const [form, setForm] = useState(JSON.parse(JSON.stringify(INITIAL_APPOINTMENT)));
  const [tab, setTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [showPublish, setShowPublish] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    setLoadingData(true);
    getAppointmentById(id).then(r => {
      const d = r.data;
      setForm({
        basicInfo: d.basicInfo || INITIAL_APPOINTMENT.basicInfo,
        bookingType: d.bookingType || { type: 'user' },
        assignedUsers: (d.assignedUsers || []).map(u => u._id || u),
        assignedResources: (d.assignedResources || []).map(r => r._id || r),
        assignmentMode: d.assignmentMode || 'automatic',
        capacity: d.capacity || INITIAL_APPOINTMENT.capacity,
        schedule: d.schedule || INITIAL_APPOINTMENT.schedule,
        questions: d.questions || [],
        options: d.options || INITIAL_APPOINTMENT.options,
        misc: d.misc || INITIAL_APPOINTMENT.misc,
        publish: d.publish || { isPublished: false },
        _id: d._id,
      });
    }).catch(() => showToast('Failed to load appointment.', 'error'))
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleSave = async () => {
    if (!form.basicInfo.title?.trim()) { showToast('Title is required.', 'error'); setTab('general'); return; }
    if (!form.basicInfo.duration || form.basicInfo.duration <= 0) { showToast('Duration must be > 0.', 'error'); setTab('general'); return; }
    setSaving(true);
    try {
      if (isEdit) {
        await updateAppointment(id, form);
        showToast('Appointment updated!', 'success');
      } else {
        const res = await createAppointment(form);
        showToast('Appointment created!', 'success');
        navigate(`${base}/appointments/${res.data._id}/edit`, { replace: true });
      }
    } catch (err) { showToast(err.response?.data?.message || 'Save failed.', 'error'); }
    finally { setSaving(false); }
  };

  const handlePublishToggle = async () => {
    setPublishLoading(true);
    try {
      const apptId = id || form._id;
      if (!apptId) { showToast('Save appointment first.', 'error'); setPublishLoading(false); setShowPublish(false); return; }
      if (form.publish.isPublished) {
        await unpublishAppointment(apptId);
        setForm(f => ({ ...f, publish: { ...f.publish, isPublished: false } }));
        showToast('Appointment unpublished.', 'success');
      } else {
        await publishAppointment(apptId);
        setForm(f => ({ ...f, publish: { ...f.publish, isPublished: true } }));
        showToast('Appointment published!', 'success');
      }
    } catch { showToast('Action failed.', 'error'); }
    finally { setPublishLoading(false); setShowPublish(false); }
  };

  if (loadingData) return <AppointmentStudioLayout><div className="flex justify-center py-20"><div className="loader-ring-brand w-10 h-10 rounded-full" /></div></AppointmentStudioLayout>;

  return (
    <AppointmentStudioLayout>
      {}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-sm sticky top-[4.5rem] z-30">
        <button onClick={() => navigate(`${base}/appointments`)} className="btn-ghost !py-2 !px-3 !text-sm !rounded-xl text-slate-500 hover:text-slate-800">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </button>

        <div className="hidden md:block h-6 w-px bg-slate-200 mx-2" />

        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-slate-800 truncate">
            {form.basicInfo.title || 'Untitled Appointment'}
            {form.publish.isPublished && <span className="ml-3 align-middle bg-emerald-50 text-emerald-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-emerald-100">Live</span>}
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {isEdit && (
            <>
              <button onClick={() => navigate(`${base}/appointments/${id}/preview`)} className="btn-ghost !py-2 !px-4 !text-sm !rounded-xl" title="Preview customer experience">Preview</button>
              <button onClick={() => setShowPublish(true)} className={`!py-2 !px-4 !text-sm !rounded-xl transition-all font-semibold ${form.publish.isPublished ? 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'}`}>
                {form.publish.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => setShowShare(true)} className="btn-ghost !py-2 !px-4 !text-sm !rounded-xl flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share
              </button>
              <button onClick={() => navigate(`${base}/appointments/${id}/meetings`)} className="btn-ghost !py-2 !px-4 !text-sm !rounded-xl">Meetings</button>
            </>
          )}
          <button onClick={handleSave} disabled={saving} className="btn-brand !py-2 !px-6 !text-sm !rounded-xl shadow-md">
            {saving ? <span className="loader-ring w-4 h-4" /> : (isEdit ? 'Save Changes' : 'Create')}
          </button>
        </div>
      </div>

      {}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-1 sticky top-[11rem]">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl font-medium transition-all ${tab === t.id ? 'bg-white shadow-sm border border-slate-100 text-brand-700 font-bold' : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'}`}
            >
              <span className="text-xl">{t.icon}</span>
              {t.label}
              {tab === t.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />}
            </button>
          ))}
        </div>

        {}
        <div className="flex-1 w-full min-w-0">
          <div className="glass-card-strong p-6 md:p-10 animate-slide-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
              {TABS.find(t => t.id === tab)?.label}
            </h2>

            <div className="min-h-[400px]">
              {tab === 'general' && <AppointmentBasicInfo data={form.basicInfo} onChange={d => setForm(f => ({ ...f, basicInfo: d }))} />}
              {tab === 'schedule' && <ScheduleEditor schedule={form.schedule} onChange={s => setForm(f => ({ ...f, schedule: s }))} />}
              {tab === 'questions' && <QuestionBuilder questions={form.questions} onChange={q => setForm(f => ({ ...f, questions: q }))} />}
              {tab === 'rules' && (
                <div className="space-y-8">
                  <AppointmentBookingConfig data={form} onChange={d => setForm(f => ({ ...f, ...d }))} />
                  <div className="pt-8 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Advanced Options</h3>
                    <OptionsPanel options={form.options} onChange={o => setForm(f => ({ ...f, options: o }))} />
                  </div>
                </div>
              )}
              {tab === 'advanced' && <MiscPanel misc={form.misc || {}} onChange={m => setForm(f => ({ ...f, misc: m }))} />}
            </div>
          </div>
        </div>
      </div>

      {showPublish && <PublishConfirmModal isPublished={form.publish.isPublished} loading={publishLoading} onConfirm={handlePublishToggle} onClose={() => setShowPublish(false)} />}
      {showShare && form._id && <ShareLinkModal appointment={{ _id: form._id || id }} onClose={() => setShowShare(false)} />}
    </AppointmentStudioLayout>
  );
}