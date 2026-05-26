import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { profileStorage, recommendStorage } from '../lib/storage';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import MatchBar from '../components/MatchBar';

export default function Dashboard() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(null);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const data = profileStorage.get();
    setSkills(data.skills);
    setProfile(data.user);
    setLatest(recommendStorage.get());
  }, []);

  const profileComplete = [
    profile?.cgpa != null && profile?.cgpa !== '',
    skills.length > 0,
    profile?.interests?.length > 0,
    profile?.careerGoals,
  ].filter(Boolean).length;

  return (
    <div>
      <header className="mb-10">
        <p className="text-sm text-mist mb-1">Good to see you</p>
        <h1 className="font-display text-3xl font-semibold text-ink">
          {user?.name?.split(' ')[0] || 'Student'}
        </h1>
      </header>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <div className="bg-white border border-cream rounded-lg p-5 shadow-card">
          <p className="text-xs uppercase tracking-wide text-mist mb-2">Profile</p>
          <p className="text-2xl font-semibold">{profileComplete}/4</p>
          <p className="text-sm text-slate mt-1">sections filled</p>
          <Link to="/profile" className="text-sm text-rust mt-3 inline-block hover:underline">
            Complete profile →
          </Link>
        </div>
        <div className="bg-white border border-cream rounded-lg p-5 shadow-card">
          <p className="text-xs uppercase tracking-wide text-mist mb-2">Skills</p>
          <p className="text-2xl font-semibold">{skills.length}</p>
          <p className="text-sm text-slate mt-1">saved on this device</p>
        </div>
        <div className="bg-white border border-cream rounded-lg p-5 shadow-card">
          <p className="text-xs uppercase tracking-wide text-mist mb-2">Top match</p>
          <p className="text-2xl font-semibold">
            {latest?.careers?.[0]?.matchScore != null ? `${latest.careers[0].matchScore}%` : '—'}
          </p>
          <p className="text-sm text-slate mt-1 truncate">
            {latest?.careers?.[0]?.careerName || 'Run analysis'}
          </p>
        </div>
      </div>

      {latest?.careers ? (
        <section className="bg-white border border-cream rounded-lg p-6 shadow-card mb-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="font-display text-xl font-semibold">Latest career matches</h2>
            <Link to="/recommendations">
              <Button variant="ghost" className="text-xs py-2">
                View full report
              </Button>
            </Link>
          </div>
          <ul className="space-y-4">
            {latest.careers.slice(0, 3).map((c, i) => (
              <li key={c.careerName}>
                <p className="font-medium mb-1.5">{c.careerName}</p>
                <MatchBar score={c.matchScore} rank={i + 1} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="bg-ink text-paper rounded-lg p-8 mb-8 border-l-4 border-rust">
          <h2 className="font-display text-xl font-semibold mb-2">Ready for recommendations?</h2>
          <p className="text-paper/70 text-sm mb-5 max-w-md">
            Fill your profile and skills, then generate AI career paths. Results save in your browser.
          </p>
          <Link to="/recommendations">
            <Button variant="accent">Generate recommendations</Button>
          </Link>
        </section>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/quiz" className="block p-5 bg-cream/50 border border-cream rounded-lg hover:border-slate/30 transition">
          <h3 className="font-medium mb-1">Career quiz</h3>
          <p className="text-sm text-slate">6 easy questions about your interests</p>
        </Link>
        <Link to="/chat" className="block p-5 bg-cream/50 border border-cream rounded-lg hover:border-slate/30 transition">
          <h3 className="font-medium mb-1">Mentor chat</h3>
          <p className="text-sm text-slate">Ask career questions anytime</p>
        </Link>
      </div>
    </div>
  );
}
