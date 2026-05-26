import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authStorage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = authStorage.login({ email, password });
      login(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4 grain">
      <div className="w-full max-w-md">
        <Link to="/" className="font-display text-2xl font-semibold text-ink block mb-8">
          PathFinder
        </Link>
        <h1 className="font-display text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-slate text-sm mb-8">Your data stays in this browser (localStorage).</p>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-lg shadow-card border border-cream">
          {error && <p className="text-sm text-rust bg-rust/10 px-3 py-2 rounded">{error}</p>}
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="primary" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-sm text-slate">
          No account?{' '}
          <Link to="/register" className="text-rust font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
