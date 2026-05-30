import { Router } from 'express';
import multer from 'multer';
import { recommendCareer, uploadResume, chat } from '../controllers/aiController.js';
import { requireSupabaseAuth } from '../middleware/auth.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Only PDF files are allowed'));
      return;
    }
    cb(null, true);
  },
});

router.use(requireSupabaseAuth);
router.post('/recommend-career', recommendCareer);
router.post('/resume', upload.single('resume'), uploadResume);
router.post('/chat', chat);

export default router;
