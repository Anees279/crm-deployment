
// };
import axios, { AxiosResponse } from 'axios';
import FormData from 'form-data'; // For multipart/form-data to upload media
import { Request, Response } from 'express';

// Set up constants for API access
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN_Visa_Processing_Service_UAE as string;
const FACEBOOK_API_VERSION = 'v16.0';
const BASE_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
}

interface FacebookResponse<T> {
  data: T;
  paging?: {
    previous: string;
    next: string;
  };
}

interface PageAnalytics {
  totalLikes: number;
  totalComments: number;
  totalPosts: number;
}



// Express route to upload media (photo or video)



// Function to get posts on the Facebook page
const getPagePosts = async (pageId: string): Promise<AxiosResponse<FacebookResponse<FacebookPost[]>>> => {
  const url = `${BASE_URL}/${pageId}/posts?access_token=${PAGE_ACCESS_TOKEN}`;
  return await axios.get<FacebookResponse<FacebookPost[]>>(url);
};

// Get comments on a specific post
const getPostComments = async (postId: string): Promise<AxiosResponse<FacebookResponse<any[]>>> => {
  const url = `${BASE_URL}/${postId}/comments?access_token=${PAGE_ACCESS_TOKEN}`;
  return await axios.get<FacebookResponse<any[]>>(url);
};

// Get likes for a specific post
const getPostLikes = async (postId: string): Promise<AxiosResponse<FacebookResponse<any[]>>> => {
  const url = `${BASE_URL}/${postId}/likes?access_token=${PAGE_ACCESS_TOKEN}`;
  return await axios.get<FacebookResponse<any[]>>(url);
};

// Delete a post


// Get total followers of the page
const getPageFollowers = async (pageId: string): Promise<AxiosResponse<any>> => {
  const url = `${BASE_URL}/${pageId}?fields=followers_count&access_token=${PAGE_ACCESS_TOKEN}`;
  return await axios.get(url);
};

// Overall page analytics (likes, comments, posts)
const getPageAnalytics = async (pageId: string): Promise<PageAnalytics> => {
  const postsResponse: AxiosResponse<any> = await getPagePosts(pageId);
  const posts = postsResponse.data.data;

  let totalLikes = 0;
  let totalComments = 0;

  for (const post of posts) {
    const likesResponse: AxiosResponse<any> = await getPostLikes(post.id);
    const commentsResponse: AxiosResponse<any> = await getPostComments(post.id);

    totalLikes += likesResponse.data.data.length;
    totalComments += commentsResponse.data.data.length;
  }

  // Return the calculated analytics data as an object
  return {
    totalLikes,
    totalComments,
    totalPosts: posts.length,
  };
};

export {
  getPagePosts,
  getPostComments,
  getPostLikes,
  getPageFollowers,
  getPageAnalytics,
};
