import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { BeamsBackground } from '../components/ui/beams-background';
import AnimatedGradientBackground from '../components/ui/animated-gradient-background';
import { AnimatedContainer, TextStagger } from '../components/ui/hero-animated';

export default function Landing() {
  return (
    <BeamsBackground className="bg-ink text-paper" intensity="medium">
      <AnimatedGradientBackground
        Breathing
        startingGap={120}
        breathingRange={7}
        animationSpeed={0.025}
        topOffset={18}
        gradientColors={['#05070d', '#113b3a', '#1a1f2e', '#7d2f24', '#d4654a']}
        gradientStops={[30, 52, 68, 84, 100]}
        containerClassName="opacity-80"
      />

      <div className="relative z-20 flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-8">
          <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-white">
            PathFinder
          </Link>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="accent">Get started</Button>
            </Link>
          </div>
        </header>

        <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-12 sm:px-8 lg:grid-cols-[1fr_0.86fr]">
          <section className="max-w-3xl">
            <AnimatedContainer transformDirection="bottom">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-rustlight">
                AI career guidance for students
              </p>
            </AnimatedContainer>

            <TextStagger
              as="h1"
              direction="bottom"
              className="font-display text-4xl font-semibold leading-[1.06] tracking-normal text-white sm:text-6xl lg:text-7xl"
              text="Find the career path that actually fits you."
            />

            <AnimatedContainer className="mt-6 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg" transition={{ delay: 0.45 }}>
              <p>
                Build a profile, answer a short quiz, and get AI-powered career matches with
                skill gaps, courses, and a practical roadmap.
              </p>
            </AnimatedContainer>

            <AnimatedContainer className="mt-8 flex flex-col gap-3 sm:flex-row" transition={{ delay: 0.65 }}>
              <Link to="/register" className="w-full sm:w-auto">
                <Button variant="accent" className="w-full px-7 py-3 text-base sm:w-auto">
                  Build my profile
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full border-white/20 bg-white/10 px-7 py-3 text-base text-white hover:bg-white/15 sm:w-auto">
                  Continue
                </Button>
              </Link>
            </AnimatedContainer>
          </section>

          <AnimatedContainer className="relative" transformDirection="right" transition={{ delay: 0.5 }}>
            <div className="absolute -left-4 top-10 h-24 w-24 rotate-6 rounded-2xl bg-rust/20 blur-sm" />
            <div className="absolute -right-6 bottom-8 h-32 w-32 rounded-full border border-white/15" />
            <div className="relative overflow-hidden rounded-lg border border-white/15 bg-white/10 p-5 shadow-lift backdrop-blur-xl sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-white/50">Live career match</p>
                <span className="rounded-full bg-sage/70 px-3 py-1 text-xs text-white">Preview</span>
              </div>
              <ul className="space-y-4">
                {[
                  { role: 'Data Analyst', pct: 92 },
                  { role: 'AI Engineer', pct: 87 },
                  { role: 'Full Stack Developer', pct: 80 },
                ].map((career, index) => (
                  <li key={career.role} className="rounded-md border border-white/10 bg-black/15 p-4">
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <span className="font-medium text-white">
                        <span className="mr-2 text-xs text-white/40">{index + 1}.</span>
                        {career.role}
                      </span>
                      <span className="font-semibold text-rustlight">{career.pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="shine h-full rounded-full bg-rustlight" style={{ width: `${career.pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 rounded-md bg-white/10 p-4 text-sm leading-relaxed text-white/70">
                Roadmap starts with Python, SQL, portfolio projects, and interview-ready skill gaps.
              </p>
            </div>
          </AnimatedContainer>
        </main>
      </div>
    </BeamsBackground>
  );
}
