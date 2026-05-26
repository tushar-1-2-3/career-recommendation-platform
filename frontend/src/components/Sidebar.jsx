import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/profile', label: 'My Profile' },
  { to: '/quiz', label: 'Career Quiz' },
  { to: '/recommendations', label: 'Career Match' },
  { to: '/chat', label: 'Mentor Chat' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 shrink-0 bg-ink text-paper min-h-screen flex flex-col border-r border-slate/30">
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
            className={({ isActive }) =>
              `block px-3 py-2.5 text-sm rounded-md transition ${
                isActive
                  ? 'bg-rust/90 text-paper font-medium'
                  : 'text-paper/70 hover:bg-white/5 hover:text-paper'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-white/10">
        <p className="text-sm font-medium truncate">{user?.name}</p>
        <p className="text-xs text-mist truncate mb-3">{user?.email}</p>
        <button
          onClick={logout}
          className="text-xs text-paper/60 hover:text-rustlight transition"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
