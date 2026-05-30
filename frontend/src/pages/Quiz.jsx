import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCareerQuestions, gradeCareerQuiz } from '../lib/quizData';
import { quizStorage } from '../lib/storage';
import Button from '../components/Button';

export default function Quiz() {
  const [questions] = useState(getCareerQuestions);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(() => quizStorage.get()?.career || null);

  const submit = () => {
    const payload = Object.entries(answers).map(([questionId, selectedIndex]) => ({
      questionId: Number(questionId),
      selectedIndex,
    }));
    const graded = gradeCareerQuiz(payload);
    quizStorage.save('career', graded);
    setResult(graded);
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  if (result) {
    return (
      <div className="max-w-2xl soft-enter">
        <h1 className="font-display text-3xl font-semibold mb-2">Your career profile</h1>
        <p className="text-slate text-sm mb-6">
          Based on your 6 answers — used for AI recommendations.
        </p>

        <div className="surface rounded-lg p-4 space-y-4 mb-6 sm:p-6">
          {result.answers?.map((item, i) => (
            <div key={i} className="text-sm border-b border-cream pb-3 last:border-0">
              <p className="text-mist mb-1">{item.question}</p>
              <p className="font-medium text-ink">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link to="/recommendations" className="w-full sm:w-auto">
            <Button variant="accent">Get career recommendations →</Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={() => {
              setResult(null);
              setAnswers({});
            }}
          >
            Retake quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl soft-enter">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Career quiz</h1>
        <p className="text-slate text-sm mt-1">
          6 simple questions about your interests and goals — no math or trick questions.
        </p>
      </header>

      <ol className="space-y-8">
        {questions.map((q, idx) => (
          <li key={q.id} className="surface rounded-lg p-4 transition duration-300 hover:shadow-lift sm:p-5">
            <p className="text-sm text-mist mb-1">Question {idx + 1} of {questions.length}</p>
            <p className="font-medium mb-4">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                  className={`w-full text-left px-4 py-2.5 rounded-md border text-sm transition duration-200 ${
                    answers[q.id] === i
                      ? 'border-rust bg-rust/10 text-ink shadow-sm'
                      : 'border-cream bg-white/55 hover:border-slate/30 hover:bg-white'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <Button variant="accent" className="mt-8 w-full sm:w-auto" disabled={!allAnswered} onClick={submit}>
        See my career profile
      </Button>
    </div>
  );
}
