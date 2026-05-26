import OpenAI from 'openai';
import { loadPrompt, fillPrompt } from './promptLoader.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
});

const model = process.env.OPENAI_MODEL || 'openai/gpt-oss-120b:free';

const parseJsonResponse = (text) => {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('AI did not return valid JSON');
  return JSON.parse(cleaned.slice(start, end + 1));
};

const chatCompletion = async (systemPrompt, userPrompt, options = {}) => {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: options.temperature ?? 0.6,
    max_tokens: options.max_tokens ?? 2200,
  });
  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error('Empty response from AI');
  return parseJsonResponse(text);
};

/** profile = user fields + skills + career quiz from frontend */
export const buildStudentProfileText = (profile, skills = []) => {
  const skillList = skills.length ? skills : profile.skills || [];
  const lines = [
    profile.name ? `Name: ${profile.name}` : null,
    profile.cgpa != null && profile.cgpa !== '' ? `CGPA: ${profile.cgpa}` : null,
    profile.education ? `Education: ${profile.education}` : null,
    skillList.length
      ? `Skills: ${skillList.map((s) => `${s.skillName} (${s.level})`).join(', ')}`
      : null,
    profile.interests?.length ? `Interests: ${profile.interests.join(', ')}` : null,
    profile.careerGoals ? `Career Goals: ${profile.careerGoals}` : null,
    profile.preferredIndustry ? `Preferred Industry: ${profile.preferredIndustry}` : null,
    profile.workStyle ? `Work Style: ${profile.workStyle}` : null,
  ];

  const careerQuiz = profile.quizResults?.career;
  if (careerQuiz?.summaryText) {
    lines.push(
      '\n--- Career Quiz Answers (IMPORTANT — base recommendations mainly on this) ---',
      careerQuiz.summaryText,
      careerQuiz.topSignals?.length
        ? `Key themes from quiz: ${careerQuiz.topSignals.join(', ')}`
        : null
    );
  } else {
    lines.push('\nNote: Student has not completed the career quiz yet.');
  }

  if (profile.resumeText) {
    lines.push(`Resume excerpt: ${profile.resumeText.slice(0, 400)}`);
  }

  return lines.filter(Boolean).join('\n');
};

export const getCareerRecommendations = async (profileText) => {
  const template = loadPrompt('career-recommendation.txt');
  const prompt = fillPrompt(template, { STUDENT_PROFILE: profileText });
  return chatCompletion(
    'Career counselor. Quiz answers are the main signal. JSON only, no markdown.',
    prompt,
    { max_tokens: 2200, temperature: 0.6 }
  );
};

export const analyzeResume = async (resumeText) => {
  const template = loadPrompt('resume-analysis.txt');
  const prompt = fillPrompt(template, { RESUME_TEXT: resumeText.slice(0, 8000) });
  return chatCompletion(
    'Extract resume data. Respond with valid JSON only, no markdown.',
    prompt
  );
};

export const careerChat = async (question, studentContext) => {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: fillPrompt(loadPrompt('career-chat.txt'), {
          STUDENT_CONTEXT: studentContext || 'No profile data yet.',
          QUESTION: question,
        }),
      },
      { role: 'user', content: question },
    ],
    temperature: 0.75,
    max_tokens: 1600,
  });
  return response.choices[0]?.message?.content || 'No response from AI.';
};
