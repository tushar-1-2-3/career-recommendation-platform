import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { signUp, authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signUp(form);
      navigate('/login', {
        state: {
          message: 'Account created. Check your email for the confirmation link, then sign in.',
        },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-shell min-h-screen px-4 py-8 grain">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[0.9fr_1fr]">
        <section className="hidden soft-enter lg:block">
          <Link to="/" className="font-display text-3xl font-semibold text-ink">
            PathFinder
          </Link>
          <h1 className="mt-10 font-display text-5xl font-semibold leading-tight text-ink">
            Start with a profile. Leave with a direction.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate">
            Your account keeps the workspace simple: profile, quiz, recommendations, and mentor chat.
          </p>
        </section>

        <section className="w-full max-w-md justify-self-center soft-enter">
          <Link to="/" className="font-display text-2xl font-semibold text-ink block mb-8 lg:hidden">
            PathFinder
          </Link>
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-sage">Create workspace</p>
            <h1 className="mt-2 font-display text-3xl font-semibold">Create account</h1>
            <p className="text-slate text-sm mt-2">Use an email you can verify. You must confirm it before signing in.</p>
          </div>

          <form onSubmit={handleSubmit} className="surface space-y-5 rounded-lg p-5 sm:p-8">
          {error && <p className="text-sm text-rust bg-rust/10 px-3 py-2 rounded">{error}</p>}
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          <Button type="submit" variant="accent" className="w-full" disabled={authLoading}>
            {authLoading ? 'Creating account...' : 'Create account'}
          </Button>
          </form>
          <p className="mt-6 text-sm text-slate">
            Already registered?{' '}
            <Link to="/login" className="text-rust font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
