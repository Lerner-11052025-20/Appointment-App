import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateSignup } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import RoleSelector from './RoleSelector';
import PasswordStrengthMeter from './PasswordStrengthMeter';

export default function SignupForm() {
  const { register, showToast } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateSignup(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-xl font-extrabold text-violet-700 tracking-tight">SlotIQ</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">Create account</h1>
        <p className="text-xs font-medium text-slate-500">Set up your scheduling cockpit in seconds</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          id="signup-name"
          label="Full Name"
          name="fullName"
          placeholder="Jane Doe"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
          autoComplete="name"
          className="text-sm"
        />
        <Input
          id="signup-email"
          label="Email Address"
          type="email"
          name="email"
          placeholder="name@company.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          className="text-sm"
        />
        <div>
          <Input
            id="signup-password"
            label="Password"
            type="password"
            name="password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            className="text-sm"
          />
          <PasswordStrengthMeter password={form.password} />
        </div>
        <Input
          id="signup-confirm"
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
          className="text-sm"
        />

        <div className="pt-1">
          <RoleSelector
            value={form.role}
            onChange={(r) => {
              setForm((f) => ({ ...f, role: r }));
              if (errors.role) setErrors((er) => ({ ...er, role: '' }));
            }}
          />
          {errors.role && <p className="text-[10px] text-rose-500 font-medium mt-1">{errors.role}</p>}
        </div>

        <Button type="submit" loading={loading} className="!mt-5 !py-2.5 !text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40">
          Create Account
        </Button>
      </form>

      <p className="text-center text-[11px] font-medium text-slate-500 mt-5">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-violet-600 hover:text-violet-700 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}