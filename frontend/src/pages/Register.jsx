import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authStorage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = authStorage.register(form);
      login(user);
      navigate('/profile');
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
        <h1 className="font-display text-3xl font-semibold mb-2">Create account</h1>
        <p className="text-slate text-sm mb-8">Saved locally on your device — no server database.</p>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-lg shadow-card border border-cream">
          {error && <p className="text-sm text-rust bg-rust/10 px-3 py-2 rounded">{error}</p>}
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          <Button type="submit" variant="accent" className="w-full">
            Create account
          </Button>
        </form>
        <p className="mt-6 text-sm text-slate">
          Already registered?{' '}
          <Link to="/login" className="text-rust font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
