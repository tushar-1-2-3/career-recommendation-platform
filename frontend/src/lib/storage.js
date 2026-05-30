const KEYS = {
  profile: 'pf_profile',
  skills: 'pf_skills',
  quiz: 'pf_quiz',
  recommendation: 'pf_recommendation',
  chat: 'pf_chat',
};

let storageOwner = 'guest';

export const setStorageOwner = (ownerId) => {
  storageOwner = ownerId || 'guest';
};

const scopedKey = (key) => `${key}:${storageOwner}`;

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(scopedKey(key));
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(scopedKey(key), JSON.stringify(value));

export const profileStorage = {
  get() {
    return {
      user: read(KEYS.profile, {}),
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
    if (type === 'career') {
      localStorage.removeItem(scopedKey(KEYS.recommendation));
    }
  },
};

export const recommendStorage = {
  get: () => read(KEYS.recommendation, null),
  save: (data, signature = '') =>
    write(KEYS.recommendation, { ...data, signature, savedAt: new Date().toISOString() }),
  getForSignature(signature) {
    const saved = read(KEYS.recommendation, null);
    return saved?.signature === signature ? saved : null;
  },
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
export const buildApiProfile = (authUser = null) => {
  const { user, skills, quizResults } = profileStorage.get();
  const name = user?.name || authUser?.name || authUser?.user_metadata?.name || authUser?.email?.split('@')[0];
  const email = user?.email || authUser?.email;

  return {
    name,
    email,
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

export const buildRecommendationSignature = (extraNotes = '', authUser = null) => {
  const profile = buildApiProfile(authUser);
  const payload = JSON.stringify({
    profile,
    extraNotes: extraNotes.trim(),
  });

  let hash = 5381;
  for (let i = 0; i < payload.length; i += 1) {
    hash = (hash * 33) ^ payload.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
};
