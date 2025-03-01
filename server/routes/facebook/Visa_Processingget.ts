
import express, { Request, Response } from 'express';
import multer from 'multer';
// import { uploadMedia } from '../controller/cont'; 
import {
  getPagePosts,
  getPostComments,
  getPostLikes,
  getPageFollowers,
  getPageAnalytics,
} from '../../services/facebook/Visa_Processing';

const router = express.Router();
const PAGE_ID = '358188507375465';  // Replace with your Facebook Page ID

// Set up multer for file uploads (e.g., images, videos)
const storage = multer.memoryStorage(); // Store files in memory (you can also configure disk storage)
const upload = multer({ storage });

// Get posts on the Facebook page
router.get('/posts', async (req: Request, res: Response) => {
  try {
    const response = await getPagePosts(PAGE_ID);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching posts:', error.stack || error.message);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// Get comments on a specific post
router.get('/posts/:postId/comments', async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const response = await getPostComments(postId);
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching comments for post ${postId}:`, error.stack || error.message);
    res.status(500).json({ message: `Error fetching comments for post ${postId}`, error: error.message });
  }
});

// Get likes for a specific post
router.get('/posts/:postId/likes', async (req: Request, res: Response) => {
  const { postId } = req.params;
  try {
    const response = await getPostLikes(postId);
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching likes for post ${postId}:`, error.stack || error.message);
    res.status(500).json({ message: `Error fetching likes for post ${postId}`, error: error.message });
  }
});




// Get total followers
router.get('/followers', async (req: Request, res: Response) => {
  try {
    const response = await getPageFollowers(PAGE_ID);
    res.json({ followersCount: response.data.followers_count });
  } catch (error: any) {
    console.error('Error fetching followers:', error.stack || error.message);
    res.status(500).json({ message: 'Error fetching followers', error: error.message });
  }
});

// Get page insights (performance data)
router.get('/getPageAnalytics', async (req: Request, res: Response) => {
  try {
    const analytics = await getPageAnalytics(PAGE_ID); // Assuming PAGE_ID is defined in your environment
    res.json({ analytics }); // Directly return the analytics object
  } catch (error: any) {
    console.error('Error fetching page analytics:', error.stack || error.message);
    res.status(500).json({ message: 'Error fetching page analytics', error: error.message });
  }
});

export default router;
