import { AuthLayout } from '@/components/templates/AuthLayout';
import { RegisterForm } from '@/features/auth/RegisterForm';

export function RegisterPage() {
  return (
    <AuthLayout title="Create account" subtitle="Start building your AI-powered second brain.">
      <RegisterForm />
    </AuthLayout>
  );
}
