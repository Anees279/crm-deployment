import express from 'express';
import { getInstagramInsights } from '../../controller/instagram/instagramController';

const router = express.Router();

// Route to fetch Instagram insights
router.get('/insights', getInstagramInsights);

export default router;
