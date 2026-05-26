const KEYS = {
  accounts: 'pf_accounts',
  user: 'pf_user',
  profile: 'pf_profile',
  skills: 'pf_skills',
  quiz: 'pf_quiz',
  recommendation: 'pf_recommendation',
  chat: 'pf_chat',
};

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const authStorage = {
  register({ name, email, password }) {
    const accounts = read(KEYS.accounts, []);
    if (accounts.some((a) => a.email === email)) {
      throw new Error('Email already registered');
    }
    accounts.push({ name, email, password });
    write(KEYS.accounts, accounts);
    write(KEYS.user, { name, email });
    return { name, email };
  },
  login({ email, password }) {
    const accounts = read(KEYS.accounts, []);
    const acc = accounts.find((a) => a.email === email && a.password === password);
    if (!acc) throw new Error('Invalid email or password');
    write(KEYS.user, { name: acc.name, email: acc.email });
    return { name: acc.name, email: acc.email };
  },
  getUser: () => read(KEYS.user, null),
  logout: () => localStorage.removeItem(KEYS.user),
  isLoggedIn: () => !!read(KEYS.user, null),
};

export const profileStorage = {
  get() {
    return {
      user: { ...authStorage.getUser(), ...read(KEYS.profile, {}) },
      skills: read(KEYS.skills, []),
      quizResults: read(KEYS.quiz, {}),
    };
  },
  saveProfile(fields) {
    const current = read(KEYS.profile, {});
    write(KEYS.profile, { ...current, ...fields });
  },
  getSkills: () => read(KEYS.skills, []),
  addSkill(skill) {
    const skills = read(KEYS.skills, []);
    const i = skills.findIndex((s) => s.skillName.toLowerCase() === skill.skillName.toLowerCase());
    const entry = { ...skill, id: skill.id || crypto.randomUUID() };
    if (i >= 0) skills[i] = entry;
    else skills.push(entry);
    write(KEYS.skills, skills);
    return entry;
  },
  deleteSkill(id) {
    write(
      KEYS.skills,
      read(KEYS.skills, []).filter((s) => s.id !== id)
    );
  },
  setResumeText(text) {
    profileStorage.saveProfile({ resumeText: text });
  },
  importSkillsFromResume(extractedSkills = []) {
    extractedSkills.forEach((s) =>
      profileStorage.addSkill({
        skillName: s.name,
        level: s.level || 'beginner',
      })
    );
  },
};

export const quizStorage = {
  get: () => read(KEYS.quiz, {}),
  save: (type, result) => {
    const quiz = read(KEYS.quiz, {});
    quiz[type] = result;
    write(KEYS.quiz, quiz);
  },
};

export const recommendStorage = {
  get: () => read(KEYS.recommendation, null),
  save: (data) => write(KEYS.recommendation, { ...data, savedAt: new Date().toISOString() }),
};

export const chatStorage = {
  get: () => read(KEYS.chat, []),
  add: (role, content) => {
    const messages = read(KEYS.chat, []);
    messages.push({ role, content });
    write(KEYS.chat, messages);
  },
  clear: () => write(KEYS.chat, []),
};

/** Full profile object sent to OpenAI API */
export const buildApiProfile = () => {
  const { user, skills, quizResults } = profileStorage.get();
  return {
    name: user?.name,
    cgpa: user?.cgpa,
    education: user?.education,
    interests: user?.interests,
    favoriteSubjects: user?.favoriteSubjects,
    careerGoals: user?.careerGoals,
    personalityTraits: user?.personalityTraits,
    preferredIndustry: user?.preferredIndustry,
    workStyle: user?.workStyle,
    resumeText: user?.resumeText,
    quizResults,
    skills,
  };
};
