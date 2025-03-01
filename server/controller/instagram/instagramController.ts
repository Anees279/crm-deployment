
import { Request, Response } from 'express';
import axios from 'axios';

// Instagram API configuration
const INSTAGRAM_API_URL = 'https://graph.facebook.com/v17.0';
const ACCESS_TOKEN_INSTAGRAM = process.env.ACCESS_TOKEN_INSTAGRAM as string; // TypeScript ensures the token is available

// Controller to get Instagram data
export const getInstagramInsights = async (req: Request, res: Response): Promise<void> => {
  const instagramBusinessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID as string;

  try {
    // Fetch Instagram account details (followers count, media count)
    const accountDetails = await axios.get(`${INSTAGRAM_API_URL}/${instagramBusinessAccountId}`, {
      params: {
        fields: 'followers_count,media_count', // Fields to fetch
        access_token: ACCESS_TOKEN_INSTAGRAM // Access token for authentication
      }
    });

    // Fetch Instagram insights for metrics that support 'day'
    const insightsBasic = await axios.get(`${INSTAGRAM_API_URL}/${instagramBusinessAccountId}/insights`, {
      params: {
        metric: 'reach', // Valid metric for 'day' period
        period: 'day', // Use 'day' for all-time data
        access_token: ACCESS_TOKEN_INSTAGRAM // Access token for authentication
      }
    });

    // Fetch Instagram insights for metrics that need `metric_type=total_value`
    const insightsTotalValue = await axios.get(`${INSTAGRAM_API_URL}/${instagramBusinessAccountId}/insights`, {
      params: {
        metric: 'likes,comments,shares,saves,total_interactions', // Metrics requiring `metric_type=total_value`
        metric_type: 'total_value', // Add `metric_type=total_value`
        period: 'day', // Use 'day' for time-series data
        access_token: ACCESS_TOKEN_INSTAGRAM // Access token for authentication
      }
    });

    // Check if the insights data is available and properly formatted
    console.log('Account Details:', accountDetails.data);
    console.log('Basic Insights (Reach):', insightsBasic.data);
    console.log('Total Insights (Likes, Comments, Shares, etc.):', insightsTotalValue.data);

    // Respond with the account details and insights
    res.json({
      followers_count: accountDetails.data.followers_count,
      media_count: accountDetails.data.media_count,
      insights_basic: insightsBasic.data.data, // Basic insights (reach)
      insights_total_value: insightsTotalValue.data.data.map((insight: any) => ({
        name: insight.name,
        total_value: insight.values ? insight.values[0].value : 0, // Ensure value exists
        description: insight.description
      })) // Total value insights (likes, comments, etc.)
    });

  } catch (error: any) { // Catching any errors
    // Log the error response for more details
    console.error('Error fetching Instagram data:', error.response?.data || error.message);

    // Send error response
    res.status(500).json({ message: 'Error fetching Instagram data', error: error.message });
  }
};
