import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const { signIn, authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { session } = await signIn(email, password);
      if (!session) {
        setError('Sign in did not create a session. Confirm your email, then try again.');
        return;
      }
      navigate('/dashboard');
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
            Welcome back to your career studio.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate">
            Continue building your profile, quiz signals, recommendations, and mentor chat in one focused workspace.
          </p>
        </section>

        <section className="w-full max-w-md justify-self-center soft-enter">
          <Link to="/" className="font-display text-2xl font-semibold text-ink block mb-8 lg:hidden">
            PathFinder
          </Link>
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-sage">Secure sign in</p>
            <h1 className="mt-2 font-display text-3xl font-semibold">Welcome back</h1>
            <p className="text-slate text-sm mt-2">Sign in with your email and password.</p>
          </div>

          <form onSubmit={handleSubmit} className="surface space-y-5 rounded-lg p-5 sm:p-8">
          {error && <p className="text-sm text-rust bg-rust/10 px-3 py-2 rounded">{error}</p>}
          {location.state?.message && (
            <p className="text-sm text-sage bg-sage/10 px-3 py-2 rounded">{location.state.message}</p>
          )}
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="primary" className="w-full" disabled={authLoading}>
            {authLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          </form>
          <p className="mt-6 text-sm text-slate">
            No account?{' '}
            <Link to="/register" className="text-rust font-medium hover:underline">
              Register
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
