import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper grain flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between max-w-6xl mx-auto w-full">
        <span className="font-display text-2xl font-semibold text-ink">PathFinder</span>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button variant="accent">Get started</Button>
          </Link>
        </div>
      </header>

      <section className="flex-1 max-w-6xl mx-auto w-full px-8 py-16 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm font-semibold text-sage uppercase tracking-widest mb-4">
            Skill-based guidance
          </p>
          <h1 className="font-display text-5xl lg:text-6xl font-semibold text-ink leading-[1.1] mb-6">
            Find careers that fit how you think and what you can do.
          </h1>
          <p className="text-lg text-slate leading-relaxed mb-8 max-w-lg">
            PathFinder maps your skills, interests, and assessments to real career paths — with
            gap analysis, courses, and a month-by-month roadmap. Powered by AI, built for students.
          </p>
          <Link to="/register">
            <Button variant="primary" className="text-base px-7 py-3">
              Build my profile →
            </Button>
          </Link>
        </div>

        <div className="relative">
          <div className="bg-ink text-paper rounded-lg p-8 shadow-lift border-l-4 border-rust">
            <p className="text-xs text-mist mb-4">Sample recommendation</p>
            <ul className="space-y-4">
              {[
                { role: 'Data Analyst', pct: 92 },
                { role: 'AI Engineer', pct: 87 },
                { role: 'Full Stack Developer', pct: 80 },
              ].map((c, i) => (
                <li key={c.role} className="flex justify-between items-baseline border-b border-white/10 pb-3 last:border-0">
                  <span>
                    <span className="text-mist text-xs mr-2">{i + 1}.</span>
                    {c.role}
                  </span>
                  <span className="font-semibold text-rustlight">{c.pct}%</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-paper/70">
              Missing: Machine Learning, Power BI · Roadmap starts Month 1 → Python & SQL
            </p>
          </div>
          <div className="absolute -bottom-4 -right-4 w-full h-full border border-cream rounded-lg -z-10" />
        </div>
      </section>

      <section className="border-t border-cream bg-white/50 py-14">
        <div className="max-w-6xl mx-auto px-8 grid sm:grid-cols-3 gap-10">
          {[
            { title: 'Profile & skills', desc: 'CGPA, interests, resume upload, skill inventory' },
            { title: 'Career quiz', desc: '6 simple questions about interests and goals' },
            { title: 'AI roadmap', desc: 'Careers, gaps, courses, and learning phases' },
          ].map((f) => (
            <div key={f.title}>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-slate leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
