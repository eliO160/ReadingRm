import express from 'express';
import { verifyFirebaseToken } from '../auth.js';
import { getPrefs, updatePrefs } from '../controllers/prefsController.js';

const router = express.Router();
router.use(verifyFirebaseToken);
router.get('/', getPrefs);
router.patch('/', updatePrefs); 

export default router;
