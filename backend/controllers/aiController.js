import pdfParse from 'pdf-parse';
import {
  buildStudentProfileText,
  getCareerRecommendations,
  analyzeResume,
  careerChat,
} from '../services/openaiService.js';

const requireOpenAI = (res) => {
  if (!process.env.OPENAI_API_KEY) {
    res.status(503).json({ message: 'Add OPENAI_API_KEY to backend/.env' });
    return false;
  }
  return true;
};

const getAiErrorMessage = (err, fallback) => {
  const message = String(err?.message || '');
  if (
    message.includes('ECONNRESET') ||
    message.includes('fetch failed') ||
    message.includes('timeout') ||
    message.includes('socket')
  ) {
    return 'AI provider connection failed. Please try again in a moment.';
  }
  return message || fallback;
};

export const recommendCareer = async (req, res) => {
  try {
    if (!requireOpenAI(res)) return;
    const { profile, extraNotes } = req.body;
    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({ message: 'Send profile in request body' });
    }
    if (extraNotes && String(extraNotes).length > 1000) {
      return res.status(400).json({ message: 'Extra notes must be under 1000 characters' });
    }

    if (!profile.quizResults?.career?.summaryText) {
      return res.status(400).json({
        message: 'Take career quiz before generate recommendation',
      });
    }

    let profileText = buildStudentProfileText(profile, profile.skills || []);
    if (extraNotes) profileText += `\nAdditional notes: ${extraNotes}`;

    const recommendation = await getCareerRecommendations(profileText);
    res.json({ recommendation });
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: getAiErrorMessage(err, 'Recommendation failed') });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'PDF file required' });

    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text?.trim();
    if (!resumeText) {
      return res.status(400).json({ message: 'Could not read PDF' });
    }

    if (!requireOpenAI(res)) {
      return res.json({ resumeText: resumeText.slice(0, 500) });
    }

    const analysis = await analyzeResume(resumeText);
    res.json({ resumeText: resumeText.slice(0, 500), analysis });
  } catch (err) {
    res.status(502).json({ message: getAiErrorMessage(err, 'Resume analysis failed') });
  }
};

export const chat = async (req, res) => {
  try {
    if (!requireOpenAI(res)) return;
    const { message, profile } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message required' });
    }
    if (message.length > 1200) {
      return res.status(400).json({ message: 'Message must be under 1200 characters' });
    }

    const context = profile
      ? buildStudentProfileText(profile, profile.skills || [])
      : 'No profile provided.';

    const reply = await careerChat(message.trim(), context);
    res.json({ reply });
  } catch (err) {
    res.status(502).json({ message: getAiErrorMessage(err, 'Chat failed') });
  }
};
