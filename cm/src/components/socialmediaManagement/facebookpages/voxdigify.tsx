import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import VoxdigifyUpload from './voxdigifyuplod';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Voxdigify: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [likesData, setLikesData] = useState<number[]>([]);
  const [commentsData, setCommentsData] = useState<number[]>([]);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [insights, setInsights] = useState<any>(null);
  const [pageAnalytics, setPageAnalytics] = useState<any>(null);

  useEffect(() => {
    axios.get('https://crm-deployment-five.vercel.app/api/voxdigify/posts')
      .then(response => {
        if (response.data && response.data.data) {
          setPosts(response.data.data);
        }
      })
      .catch(error => console.error('Error fetching posts:', error));

    axios.get('https://crm-deployment-five.vercel.app/api/voxdigify/followers')
      .then(response => setFollowersCount(response.data.followersCount))
      .catch(error => console.error('Error fetching followers count:', error));

    axios.get('https://crm-deployment-five.vercel.app/api/voxdigify/getPageAnalytics')
      .then(response => setPageAnalytics(response.data.analytics))
      .catch(error => console.error('Error fetching page analytics:', error));
  }, []);

  useEffect(() => {
    const fetchEngagementData = async () => {
      const likes: number[] = [];
      const comments: number[] = [];

      for (let post of posts) {
        if (post && post.id) {
          const likeCount = await fetchLikes(post.id);
          const commentCount = await fetchComments(post.id);
          likes.push(likeCount);
          comments.push(commentCount);
        }
      }

      setLikesData(likes);
      setCommentsData(comments);
    };

    if (posts.length > 0) {
      fetchEngagementData();
    }
  }, [posts]);

  const fetchLikes = async (postId: string) => {
    try {
      const response = await axios.get(`https://crm-deployment-five.vercel.app/api/voxdigify/posts/${postId}/likes`);
      return response.data.data.length;
    } catch (error) {
      console.error('Error fetching likes:', error);
      return 0;
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await axios.get(`https://crm-deployment-five.vercel.app/api/voxdigify/posts/${postId}/comments`);
      return response.data.data.length;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return 0;
    }
  };

  return (
    <div className="facebook-page-dashboard mt-[100px] px-4">
      <VoxdigifyUpload />

      {insights && (
        <div className="insights mt-5">
          <h2 className="text-xl font-semibold mb-2">Page Insights</h2>
          <ul>
            {insights.map((insight: any, index: number) => (
              <li key={index}>{insight.name}: {insight.value}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="page-analytics-summary mt-5">
        <h2 className="text-xl font-semibold mb-2">Page Analytics Summary</h2>
        {pageAnalytics ? (
          <ul>
            <h1>Followers: {followersCount}</h1>
            <li>Total Posts: {pageAnalytics.totalPosts}</li>
            <li>Total Likes: {pageAnalytics.totalLikes}</li>
            <li>Total Comments: {pageAnalytics.totalComments}</li>
          </ul>
        ) : (
          <p>No analytics data available</p>
        )}
      </div>

      {/* Analytics Bar Chart */}
      <div className="analytics-graph mt-5">
        <h2 className="text-xl font-semibold mb-2">Page Analytics Graph</h2>
        <div className="chart-container mx-auto w-full sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[250px] lg:h-[300px]">
          {pageAnalytics && (
            <Bar
              data={{
                labels: ['Total Posts', 'Total Likes', 'Total Comments'],
                datasets: [
                  {
                    label: 'Analytics',
                    data: [pageAnalytics.totalPosts, pageAnalytics.totalLikes, pageAnalytics.totalComments],
                    backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)', 'rgba(153,102,255,0.6)'],
                    borderColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)', 'rgba(153,102,255,1)'],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Engagement Metrics Graph */}
      <div className="engagement-graph mt-5">
        <h2 className="text-xl font-semibold mb-2">Engagement Metrics</h2>
        <div className="chart-container mx-auto w-full sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[250px] lg:h-[300px]">
          <Line
            data={{
              labels: posts.map((_, index) => `Post ${index + 1}`),
              datasets: [
                {
                  label: 'Likes',
                  data: likesData,
                  borderColor: 'rgba(75,192,192,1)',
                  backgroundColor: 'rgba(75,192,192,0.2)',
                },
                {
                  label: 'Comments',
                  data: commentsData,
                  borderColor: 'rgba(255,99,132,1)',
                  backgroundColor: 'rgba(255,99,132,0.2)',
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: 'category',
                  labels: posts.map((_, index) => `Post ${index + 1}`),
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Voxdigify;
