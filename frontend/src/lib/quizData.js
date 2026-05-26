/** 6 simple career questions — no math or hard technical tests */
export const CAREER_QUESTIONS = [
  {
    id: 1,
    question: 'Which subjects do you enjoy the most?',
    options: [
      'Computers & technology',
      'Business & management',
      'Arts & creative work',
      'Science & research',
      'Helping people (health, teaching, social work)',
    ],
    signals: ['technology', 'business', 'creative', 'science', 'people'],
  },
  {
    id: 2,
    question: 'How do you prefer to work?',
    options: [
      'Mostly alone, with focus',
      'In a small team',
      'Mix of solo and team work',
      'Leading and coordinating others',
    ],
    signals: ['independent', 'collaborative', 'balanced', 'leadership'],
  },
  {
    id: 3,
    question: 'What matters most to you in a future job?',
    options: [
      'Good salary and growth',
      'Stable and secure job',
      'Creative freedom',
      'Making a difference for people',
      'Learning new skills often',
    ],
    signals: ['ambitious', 'stability', 'creative', 'social_impact', 'learner'],
  },
  {
    id: 4,
    question: 'Which activity sounds most interesting to you?',
    options: [
      'Building websites or apps',
      'Working with numbers and reports',
      'Designing posters, videos, or content',
      'Planning projects and managing people',
      'Guiding or teaching others',
    ],
    signals: ['developer', 'analyst', 'designer', 'manager', 'educator'],
  },
  {
    id: 5,
    question: 'How comfortable are you with technology?',
    options: [
      'Very comfortable — I use it every day',
      'Okay with basics (email, apps, social media)',
      'Prefer jobs with less screen time',
      'Beginner but eager to learn tech skills',
    ],
    signals: ['tech_savvy', 'basic_tech', 'low_tech', 'tech_learner'],
  },
  {
    id: 6,
    question: 'What is your plan after your current studies?',
    options: [
      'Get a job as soon as possible',
      'Study further (Masters / higher degree)',
      'Start my own business someday',
      'Still exploring — not sure yet',
    ],
    signals: ['job_ready', 'higher_education', 'entrepreneur', 'exploring'],
  },
];

export const getCareerQuestions = () =>
  CAREER_QUESTIONS.map(({ signals, ...q }) => q);

/** Turn answers into a plain summary for the AI */
export const analyzeCareerAnswers = (answers) => {
  const detailed = answers.map((a) => {
    const q = CAREER_QUESTIONS.find((x) => x.id === a.questionId);
    const optionText = q?.options[a.selectedIndex] ?? 'Unknown';
    const signal = q?.signals[a.selectedIndex] ?? 'general';
    return {
      question: q?.question,
      answer: optionText,
      signal,
    };
  });

  const signals = detailed.map((d) => d.signal);
  const signalCounts = {};
  signals.forEach((s) => (signalCounts[s] = (signalCounts[s] || 0) + 1));

  const lines = detailed.map((d) => `Q: ${d.question}\nA: ${d.answer}`);

  return {
    completedAt: new Date().toISOString(),
    answers: detailed,
    topSignals: Object.entries(signalCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name),
    summaryText: lines.join('\n\n'),
  };
};

export const gradeCareerQuiz = (answers) => analyzeCareerAnswers(answers);
