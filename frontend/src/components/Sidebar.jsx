import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/profile', label: 'My Profile' },
  { to: '/quiz', label: 'Career Quiz' },
  { to: '/recommendations', label: 'Career Match' },
  { to: '/chat', label: 'Mentor Chat' },
];

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 max-w-[82vw] shrink-0 bg-ink text-paper min-h-full flex flex-col border-r border-white/10 shadow-lift">
      <div className="px-5 pt-7 pb-6 border-b border-white/10">
        <p className="font-display text-xl font-semibold tracking-tight">PathFinder</p>
        <p className="text-xs text-mist mt-1">Career guidance studio</p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative block overflow-hidden rounded-md px-3 py-2.5 text-sm transition duration-300 ${
                isActive
                  ? 'bg-white text-ink font-semibold shadow-card'
                  : 'text-paper/70 hover:bg-white/10 hover:text-paper'
              }`
            }
          >
            <span className="relative z-10">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-white/10">
        <p className="text-sm font-medium truncate">{user?.name || 'Student'}</p>
        <p className="text-xs text-mist truncate mb-3">{user?.email}</p>
        <button
          onClick={logout}
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-paper/70 transition hover:border-rustlight hover:text-rustlight"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
