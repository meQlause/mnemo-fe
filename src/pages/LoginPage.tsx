import { AuthLayout } from '@/components/templates/AuthLayout';
import { LoginForm } from '@/features/auth/LoginForm';

export function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue to your notes.">
      <LoginForm />
    </AuthLayout>
  );
}
