import express from 'express';
import multer from 'multer';
import path from 'path';
import { predict } from '../controllers/predict.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.dicom') {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  }
});

router.post('/', authMiddleware, upload.single('image'), predict);

export default router;
