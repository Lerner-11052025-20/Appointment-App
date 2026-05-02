import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resendOtp as resendOtpApi } from '../../services/authService';
import Button from '../common/Button';

export default function OTPVerification() {
  const { verifyOtp, showToast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(120);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate('/signup', { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) focusInput(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      focusInput(5);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      showToast('Please enter the complete 6-digit OTP.', 'error');
      return;
    }
    setLoading(true);
    try {

      await verifyOtp({ email, otp: code });
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed.';
      showToast(msg, 'error');
      setOtp(Array(6).fill(''));
      focusInput(0);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtpApi(email);
      showToast('OTP resent to your email.', 'success');
      setTimer(120);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to resend OTP.', 'error');
    } finally {
      setResending(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6 relative overflow-hidden">
      {}
      <div className="aurora-bg">
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        <div className="aurora-blob aurora-blob-3" />
      </div>

      <div className="glass-card-strong p-8 sm:p-10 w-full max-w-md relative z-10 animate-slide-up">
        {}
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow-brand">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Verify your access</h1>
        <p className="text-sm text-slate-500 text-center mb-1">
          We sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span>
        </p>
        <p className="text-xs text-brand-500 text-center mb-7 font-medium">For demo, use OTP: 123456</p>

        <form onSubmit={handleSubmit}>
          {}
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`otp-input ${digit ? 'otp-filled' : ''}`}
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </div>

          {}
          <div className="text-center mb-5">
            {timer > 0 ? (
              <p className="text-sm text-slate-500">
                OTP valid for <span className="font-semibold text-brand-600">{formatTime(timer)}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors disabled:opacity-50"
              >
                {resending ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </div>

          <Button type="submit" loading={loading}>
            Verify & Continue
          </Button>
        </form>
      </div>
    </div>
  );
}