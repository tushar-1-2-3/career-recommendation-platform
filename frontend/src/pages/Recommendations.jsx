import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiApi } from '../api/client';
import { recommendStorage, quizStorage } from '../lib/storage';
import Button from '../components/Button';
import MatchBar from '../components/MatchBar';
import Input from '../components/Input';
import LinearBuffer from '../components/LinearBuffer';

const LOADING_STEPS = [
  'Reading your career quiz answers…',
  'Matching careers to your profile…',
  'Building skill gap analysis…',
  'Preparing courses and roadmap…',
];

export default function Recommendations() {
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const hasQuiz = !!quizStorage.get()?.career?.summaryText;

  useEffect(() => {
    setRec(recommendStorage.get());
  }, []);

  useEffect(() => {
    if (!loading) return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((s) => (s + 1) % LOADING_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [loading]);

  const generate = async () => {
    setLoading(true);
    setError('');
    try {
      const { recommendation } = await aiApi.recommend(notes);
      recommendStorage.save(recommendation);
      setRec(recommendation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (p) => {
    if (p === 'high') return 'text-rust';
    if (p === 'medium') return 'text-sage';
    return 'text-mist';
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Career match</h1>
        <p className="text-slate text-sm mt-1">
          Complete the career quiz first for best results. AI analyzes your answers + profile.
        </p>
      </header>

      {!hasQuiz && (
        <div className="mb-6 p-4 bg-rust/10 border border-rust/20 rounded-lg text-sm">
          <Link to="/quiz" className="text-rust font-medium hover:underline">
            Take the 6-question career quiz →
          </Link>{' '}
          first so AI can analyze your answers properly.
        </div>
      )}

      <div className="bg-white border border-cream rounded-lg p-6 shadow-card mb-8">
        <Input label="Extra notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        {error && <p className="text-sm text-rust mt-3">{error}</p>}

        {loading && (
          <div className="mt-5 p-4 bg-cream/40 rounded-lg border border-cream">
            <LinearBuffer active={loading} label={LOADING_STEPS[loadingStep]} />
            <p className="text-xs text-mist mt-3">
              Generating your report — usually takes 15–45 seconds
            </p>
          </div>
        )}

        <Button variant="accent" className="mt-4" onClick={generate} disabled={loading}>
          {loading ? 'Analyzing…' : 'Generate recommendations'}
        </Button>
      </div>

      {rec && !loading && (
        <div className="space-y-8">
          <section className="bg-ink text-paper rounded-lg p-6 border-l-4 border-rust">
            <h2 className="font-display text-xl font-semibold mb-3">Top career paths</h2>
            <ul className="space-y-5">
              {rec.careers?.map((c, i) => (
                <li key={c.careerName}>
                  <h3 className="text-lg font-semibold mb-2">{c.careerName}</h3>
                  <MatchBar score={c.matchScore} rank={i + 1} />
                  <p className="text-sm text-paper/75 mt-3">{c.summary}</p>
                </li>
              ))}
            </ul>
          </section>

          {rec.personalizedGuidance && (
            <section className="bg-sage/10 border border-sage/20 rounded-lg p-5">
              <h2 className="font-display text-lg font-semibold text-sage mb-2">Guidance</h2>
              <p className="text-sm text-slate">{rec.personalizedGuidance}</p>
            </section>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white border border-cream rounded-lg p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold mb-4">Skill gaps</h2>
              <ul className="space-y-3">
                {rec.missingSkills?.map((s) => (
                  <li key={s.skill} className="text-sm">
                    <span className="font-medium">{s.skill}</span>
                    <span className={`ml-2 text-xs uppercase ${priorityColor(s.priority)}`}>{s.priority}</span>
                    <p className="text-slate mt-0.5">{s.reason}</p>
                  </li>
                ))}
              </ul>
            </section>
            <section className="bg-white border border-cream rounded-lg p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold mb-4">Courses</h2>
              <ul className="space-y-4">
                {rec.recommendedCourses?.map((c, i) => (
                  <li key={i} className="text-sm">
                    <p className="font-medium">{c.title}</p>
                    <p className="text-mist text-xs">{c.platform}</p>
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noreferrer" className="text-rust text-xs hover:underline">
                        View →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="bg-white border border-cream rounded-lg p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold mb-5">Learning roadmap</h2>
            <div className="pl-6 border-l-2 border-cream space-y-8">
              {rec.roadmap?.map((phase) => (
                <div key={phase.phase}>
                  <h3 className="font-semibold">{phase.phase}</h3>
                  <ul className="mt-2 text-sm text-slate space-y-1">
                    {phase.goals?.map((g) => (
                      <li key={g}>→ {g}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {!rec && !loading && (
        <p className="text-center text-mist py-16">Complete your profile, then generate recommendations.</p>
      )}
    </div>
  );
}
