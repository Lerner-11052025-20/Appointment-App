import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPublishedAppointmentById } from '../../services/appointmentService';
import { getAvailability } from '../../services/availabilityService';
import { createBooking } from '../../services/bookingService';
import { useAuth } from '../../context/AuthContext';

export default function BookingFlowPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    providerUser: null,
    resource: null,
    date: '',
    slot: null,
    capacity: 1,
    answers: {},
    paymentMock: false
  });

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    getPublishedAppointmentById(appointmentId)
      .then(r => setAppointment(r.data))
      .catch(() => showToast('Appointment not found', 'error'))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  useEffect(() => {
    if (step === 4 && state.date) {
      fetchAvailability();
    }
  }, [step, state.date, state.providerUser, state.resource]);

  const fetchAvailability = async () => {
    setSlotsLoading(true);
    try {
      const params = { date: state.date };
      if (state.providerUser) params.providerUserId = state.providerUser;
      if (state.resource) params.resourceId = state.resource;
      const res = await getAvailability(appointmentId, params);
      setSlots(res.data || []);
    } catch {
      showToast('Failed to load slots', 'error');
    } finally {
      setSlotsLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleBooking = async () => {
    setSubmitting(true);
    try {
      const payload = {
        appointmentId,
        providerUserId: state.providerUser,
        resourceId: state.resource,
        bookingDate: state.date,
        startTime: state.slot.startTime,
        endTime: state.slot.endTime,
        selectedCapacity: state.capacity,
        answers: Object.keys(state.answers).map(qId => {
          const q = appointment.questions.find(x => x._id === qId);
          return { questionId: qId, label: q.label, type: q.type, answer: state.answers[qId] };
        }),
        paymentMock: state.paymentMock
      };
      const res = await createBooking(payload);
      showToast('Booking confirmed!', 'success');
      navigate(`/customer/bookings/${res.data._id}/confirmation`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to book slot', 'error');

      if (err.response?.status === 409) setStep(4);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="loader-ring-brand w-12 h-12 rounded-full" /></div>;
  if (!appointment) return <div className="text-center py-20 text-slate-500">Appointment unavailable.</div>;

  const steps = [
    { num: 1, label: 'Overview' },
    { num: 2, label: 'Provider' },
    { num: 3, label: 'Date' },
    { num: 4, label: 'Time' },
    { num: 5, label: 'Capacity' },
    { num: 6, label: 'Questions' },
    { num: 7, label: 'Payment' },
    { num: 8, label: 'Confirm' }
  ];

  const skipLogic = (targetStep) => {
    if (targetStep === 2) {
      const type = appointment.bookingType?.type;
      const arr = type === 'resource' ? appointment.assignedResources : appointment.assignedUsers;
      if (!arr || arr.length === 0 || appointment.assignmentMode === 'automatic') return true;
    }
    if (targetStep === 5 && !appointment.capacity?.manageCapacity) return true;
    if (targetStep === 6 && (!appointment.questions || appointment.questions.length === 0)) return true;
    if (targetStep === 7 && !appointment.options?.advancePayment) return true;
    return false;
  };

  const goNext = () => {
    let next = step + 1;
    while (skipLogic(next) && next <= 8) next++;
    setStep(next);
  };

  const goPrev = () => {
    let prev = step - 1;
    while (skipLogic(prev) && prev >= 1) prev--;
    setStep(prev);
  };

  const visibleSteps = steps.filter(s => !skipLogic(s.num));
  const currentIndex = visibleSteps.findIndex(s => s.num === step);
  const progressPercent = ((currentIndex + 1) / visibleSteps.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20 pt-10">
      <div className="max-w-xl mx-auto px-4 md:px-0">

        {}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Step {currentIndex + 1} of {visibleSteps.length}</span>
            <span className="text-sm font-semibold text-brand-600">{visibleSteps[currentIndex]?.label}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm min-h-[400px] flex flex-col relative overflow-hidden transition-all duration-300">

          <div className="flex-1">
            {step === 1 && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-bold text-slate-900 mb-3">{appointment.basicInfo.title}</h2>
                <p className="text-slate-500 mb-6 whitespace-pre-line text-sm leading-relaxed">{appointment.basicInfo.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-xl">⏱️</span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                      <p className="text-sm font-semibold text-slate-800">{appointment.basicInfo.duration} {appointment.basicInfo.durationUnit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-xl">{appointment.basicInfo.isOnline ? '🌐' : '📍'}</span>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-semibold text-slate-800">{appointment.basicInfo.isOnline ? 'Online Link' : appointment.basicInfo.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Choose your {appointment.bookingType?.type === 'resource' ? 'resource' : 'provider'}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(appointment.bookingType?.type === 'resource' ? appointment.assignedResources : appointment.assignedUsers).map(item => (
                    <button
                      key={item._id}
                      onClick={() => setState({ ...state, [appointment.bookingType.type === 'resource' ? 'resource' : 'providerUser']: item._id })}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${state[appointment.bookingType.type === 'resource' ? 'resource' : 'providerUser'] === item._id ? 'border-brand-500 bg-brand-50' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                      <p className="font-bold text-slate-800 text-sm">{item.fullName || item.name || item.code}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Select a Date</h2>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={state.date}
                  onChange={e => setState({ ...state, date: e.target.value, slot: null })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-medium p-4 rounded-xl outline-none focus:border-brand-500 transition-colors"
                />
              </div>
              
            )}

            {step === 4 && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Available Times</h2>
                <p className="text-sm text-slate-500 mb-6">For {new Date(state.date).toLocaleDateString()}</p>

                {slotsLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="font-semibold text-slate-600 text-sm">No slots available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {slots.map((s, i) => {
                      const isFull = s.status === 'full';
                      const isSel = state.slot?.startTime === s.startTime;
                      return (
                        <button
                          key={i}
                          disabled={isFull}
                          onClick={() => setState({ ...state, slot: s, capacity: 1 })}
                          className={`p-3 rounded-xl border-2 text-center transition-colors ${isFull ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' : isSel ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300 bg-white'}`}
                        >
                          <p className={`font-bold ${isSel ? 'text-brand-700' : isFull ? 'text-slate-400' : 'text-slate-700'}`}>{s.startTime}</p>
                          <p className={`text-[10px] uppercase font-bold mt-0.5 ${isFull ? 'text-rose-500' : s.label === 'Filling Fast' ? 'text-amber-500' : 'text-emerald-500'}`}>{s.label}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="animate-fade-in-up text-center pt-4">
                <h2 className="text-xl font-bold text-slate-900 mb-2">How many seats?</h2>
                <p className="text-sm text-slate-500 mb-8">{state.slot?.remainingCapacity} seats available.</p>

                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setState({ ...state, capacity: Math.max(1, state.capacity - 1) })}
                    className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xl text-slate-600 hover:border-brand-500 hover:text-brand-600 transition-colors"
                  >-</button>
                  <span className="text-4xl font-extrabold text-slate-800 w-12">{state.capacity}</span>
                  <button
                    onClick={() => setState({ ...state, capacity: Math.min(state.slot?.remainingCapacity || 1, state.capacity + 1) })}
                    className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xl text-slate-600 hover:border-brand-500 hover:text-brand-600 transition-colors"
                  >+</button>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="animate-fade-in-up space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-bold text-slate-900">Details</h2>
                  <p className="text-sm text-slate-500">Please provide the following information to continue.</p>
                </div>
                <div className="space-y-4">
                  {appointment.questions.map(q => (
                    <div key={q._id}>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                        {q.label} {q.required && <span className="text-rose-500">*</span>}
                      </label>
                      {q.type === 'textarea' ? (
                        <textarea
                          value={state.answers[q._id] || ''}
                          onChange={e => setState({ ...state, answers: { ...state.answers, [q._id]: e.target.value } })}
                          className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-brand-500 text-sm transition-all"
                          rows={3}
                          placeholder={`Enter ${q.label.toLowerCase()}...`}
                        />
                      ) : (
                        <input
                          type={q.type === 'tel' ? 'tel' : 'text'}
                          value={state.answers[q._id] || ''}
                          onChange={e => setState({ ...state, answers: { ...state.answers, [q._id]: e.target.value } })}
                          className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:border-brand-500 text-sm transition-all"
                          placeholder={`Enter ${q.label.toLowerCase()}...`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="animate-fade-in-up">
                <div className="flex flex-col lg:flex-row gap-8">
                  {}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-4">Choose a payment method</h2>
                      <div className="space-y-3">
                        {['Credit Card', 'Debit Card', 'UPI Pay', 'Paypal'].map((method, idx) => (
                          <label key={method} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                            <input type="radio" name="payMethod" defaultChecked={idx === 0} className="w-4 h-4 text-brand-600 border-slate-300 focus:ring-brand-500" />
                            <span className="text-sm font-semibold text-slate-700">{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Name on Card</label>
                        <input type="text" placeholder="Placeholder" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-brand-500 text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Card Number</label>
                        <input type="text" placeholder=".... .... .... ...." className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-brand-500 text-sm tracking-[0.2em]" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Expiration Date</label>
                          <input type="text" placeholder=".... / ...." className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-brand-500 text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Security Code</label>
                          <input type="text" placeholder="CVV" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:border-brand-500 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="w-full lg:w-72">
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm sticky top-4">
                      <div className="bg-slate-900 text-white p-4">
                        <h3 className="font-bold text-sm">Order Summary</h3>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">{appointment.basicInfo.title}</span>
                          <span className="font-bold text-slate-900">${appointment.options?.paymentAmount}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-3 flex justify-between text-xs">
                          <span className="text-slate-500">Subtotal</span>
                          <span className="font-bold text-slate-900">${appointment.options?.paymentAmount}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Taxes</span>
                          <span className="font-bold text-slate-900">$0.00</span>
                        </div>
                        <div className="border-t-2 border-slate-200 pt-3 flex justify-between">
                          <span className="font-bold text-slate-900">Total</span>
                          <span className="font-black text-brand-600 text-lg">${appointment.options?.paymentAmount}</span>
                        </div>

                        <button
                          onClick={() => setState({ ...state, paymentMock: true })}
                          className={`w-full mt-4 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${state.paymentMock ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-brand-600 text-white shadow-brand-500/20 hover:-translate-y-0.5 active:scale-95'}`}
                        >
                          {state.paymentMock ? '✓ Paid' : 'Pay Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="animate-fade-in-up">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Review Booking</h2>
                <div className="bg-slate-50 rounded-xl p-5 space-y-3 border border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service</p>
                    <p className="text-base font-bold text-slate-800">{appointment.basicInfo.title}</p>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                      <p className="text-sm font-semibold text-slate-800">{new Date(state.date).toLocaleDateString()} at {state.slot?.startTime}</p>
                    </div>
                    {appointment.capacity?.manageCapacity && (
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seats</p>
                        <p className="text-sm font-semibold text-slate-800">{state.capacity}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {}
          <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-100">
            {step > 1 ? (
              <button onClick={goPrev} disabled={submitting} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">← Back</button>
            ) : <div />}

            {step < 8 ? (
              <button
                onClick={goNext}
                disabled={(step === 3 && !state.date) || (step === 4 && !state.slot) || (step === 7 && appointment.options?.advancePayment && !state.paymentMock)}
                className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95"
              >
                {step === 6 && appointment.options?.advancePayment ? 'Proceed to payment' : step === 6 ? 'Confirm Selection' : 'Continue'}
              </button>
            ) : (
              <button onClick={handleBooking} disabled={submitting} className="bg-brand-600 hover:bg-brand-700 disabled:opacity-70 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm">
                {submitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}