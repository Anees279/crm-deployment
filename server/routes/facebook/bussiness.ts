import express, { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data'; // Required to send files as multipart/form-data

const router = express.Router();

// Setup multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Extend the Request interface to include `files` (for multiple file uploads)
interface MulterRequest extends Request {
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

// Helper function to upload a single file to Facebook
const uploadFileToFacebook = async (file: Express.Multer.File): Promise<string> => {
  const formData = new FormData();
  formData.append('source', file.buffer, file.originalname);
  formData.append('access_token', process.env.PAGE_ACCESS_TOKEN_Business_Setup_Dubai as string);
  formData.append('published', 'false'); // Upload media but do not publish immediately

  try {
    const response = await axios.post(
      'https://graph.facebook.com/v12.0/260370453824599 /photos', // Use "/photos" for photos
      formData,
      { headers: { ...formData.getHeaders() } }
    );
    return response.data.id;
  } catch (error) {
    const err = error as Error; // Typecast error to Error
    throw new Error(`Error uploading file to Facebook: ${file.originalname}. ${err.message}`);
  }
};

// Helper function to create a Facebook post with attached media
const createFacebookPost = async (mediaIds: string[], title: string, description: string) => {
  const postData = {
    message: `${title}\n\n${description}`, // Combine title and description
    attached_media: mediaIds.map((id) => ({ media_fbid: id })), // Attach uploaded media
    access_token: process.env.PAGE_ACCESS_TOKEN_Business_Setup_Dubai as string,
    published: true, // Publish immediately
  };

  try {
    const response = await axios.post('https://graph.facebook.com/v12.0/260370453824599 /feed', postData);
    return response.data.id;
  } catch (error) {
    const err = error as Error; // Typecast error to Error
    throw new Error(`Error creating post on Facebook: ${err.message}`);
  }
};

// Controller to handle multiple file uploads and post creation
const uploadMedia = async (req: MulterRequest, res: Response) => {
  const { title, description } = req.body;

  if (!req.files || !Array.isArray(req.files)) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  try {
    // Upload each file to Facebook and collect the media IDs
    const mediaIds = await Promise.all(req.files.map(uploadFileToFacebook));
    console.log('Uploaded media IDs:', mediaIds);

    // Create a Facebook post with the uploaded media
    const postId = await createFacebookPost(mediaIds, title, description);
    console.log('Post created with ID:', postId);

    res.status(200).json({ message: 'Post created successfully with uploaded media', postId });
  } catch (error) {
    const err = error as Error; // Typecast error to Error
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred while uploading media to Facebook.' });
  }
};

// Route to upload multiple photos or videos with title and description
router.post('/posts/media', upload.array('mediaFile', 10), uploadMedia);

export default router;
