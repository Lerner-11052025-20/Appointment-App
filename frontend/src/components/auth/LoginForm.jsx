import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateLogin } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function LoginForm() {
  const { login, showToast } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await login(form);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-violet-700">SlotIQ</span>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">Welcome back</h1>
          <p className="text-xs font-medium text-slate-500">Sign in to your scheduling cockpit</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="login-email"
            label="Email Address"
            type="email"
            name="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            id="login-password"
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer group">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer" />
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgot(true)}
              className="text-[11px] font-bold text-violet-600 hover:text-violet-700 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" loading={loading} className="!mt-6 !py-2.5 !text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40">
            Sign In to Dashboard
          </Button>
        </form>

        <p className="text-center text-[11px] font-medium text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-bold text-violet-600 hover:text-violet-700 transition-colors">
            Create account
          </Link>
        </p>
      </div>

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </>
  );
}