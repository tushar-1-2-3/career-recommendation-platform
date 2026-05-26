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

export const recommendCareer = async (req, res) => {
  try {
    if (!requireOpenAI(res)) return;
    const { profile, extraNotes } = req.body;
    if (!profile?.name) {
      return res.status(400).json({ message: 'Send profile in request body' });
    }

    let profileText = buildStudentProfileText(profile, profile.skills || []);
    if (extraNotes) profileText += `\nAdditional notes: ${extraNotes}`;

    const recommendation = await getCareerRecommendations(profileText);
    res.json({ recommendation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Recommendation failed' });
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
    res.status(500).json({ message: err.message });
  }
};

export const chat = async (req, res) => {
  try {
    if (!requireOpenAI(res)) return;
    const { message, profile } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message required' });
    }

    const context = profile
      ? buildStudentProfileText(profile, profile.skills || [])
      : 'No profile provided.';

    const reply = await careerChat(message.trim(), context);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
