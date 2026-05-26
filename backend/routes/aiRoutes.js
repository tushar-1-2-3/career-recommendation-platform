import { Router } from 'express';
import multer from 'multer';
import { recommendCareer, uploadResume, chat } from '../controllers/aiController.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype === 'application/pdf');
  },
});

router.post('/recommend-career', recommendCareer);
router.post('/resume', upload.single('resume'), uploadResume);
router.post('/chat', chat);

export default router;
