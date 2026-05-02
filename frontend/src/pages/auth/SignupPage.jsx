import AuthLayout from '../../components/auth/AuthLayout';
import AuthVisualPanel from '../../components/auth/AuthVisualPanel';
import SignupForm from '../../components/auth/SignupForm';

export default function SignupPage() {
  return (
    <AuthLayout visualPanel={<AuthVisualPanel />}>
      <SignupForm />
    </AuthLayout>
  );
}