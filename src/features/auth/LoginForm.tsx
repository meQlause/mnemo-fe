import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { useAuthStore } from '@/stores/authStore';

export function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username: identifier, password });
      toast.success('Welcome back!');
      navigate('/notes');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Username"
        type="text"
        placeholder="John Doe"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
        autoComplete="username"
        autoFocus
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />

      <Button type="submit" size="lg" loading={isLoading} className="w-full mt-2">
        Sign in
      </Button>

      <p className="text-sm text-center text-[--color-ink-mute]">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-[--color-ink] font-medium hover:underline underline-offset-2"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
