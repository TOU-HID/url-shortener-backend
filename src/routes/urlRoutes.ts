import express from 'express';
import {
  createShortUrl,
  getUserUrls,
  deleteUrl
} from '../controllers/urlController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All URL routes are protected by middleware.
router.post('/', protect, createShortUrl);
router.get('/', protect, getUserUrls);
router.delete('/:id', protect, deleteUrl);

export default router;