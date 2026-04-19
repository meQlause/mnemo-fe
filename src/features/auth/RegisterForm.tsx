import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { useAuthStore } from '@/stores/authStore';

export function RegisterForm() {
  const register = useAuthStore((s) => s.register);
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register({ username, email, password });

      await login({ username, password });

      toast.success('Account created and logged in!');
      navigate('/notes');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Username"
        type="text"
        placeholder="Choose a username"
        value={username}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        autoComplete="username"
      />

      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
      />

      <Input
        label="Confirm password"
        type="password"
        placeholder="Repeat your password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        autoComplete="new-password"
      />

      <Button type="submit" size="lg" loading={isLoading} className="w-full mt-2">
        Create account
      </Button>

      <p className="text-sm text-center text-[--color-ink-mute]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-[--color-ink] font-medium hover:underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
