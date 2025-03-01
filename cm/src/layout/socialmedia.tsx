import React from 'react';
import FacebookPageDashboard from '../components/socialmediaManagement/facebookpages/zipicka';
import Voxdigify from '../components/socialmediaManagement/facebookpages/voxdigify';
import Jurisprime from '../components/socialmediaManagement/facebookpages/jurisprime';
import Documents from '../components/socialmediaManagement/facebookpages/document';
import Visaprocessing from '../components/socialmediaManagement/facebookpages/visaprocessing';
import Realestate from '../components/socialmediaManagement/facebookpages/realestate';
import InstagramInsights from '../components/socialmediaManagement/instagram/InstagramInsights';

export const SocialMedia = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mt-[150px]">Facebook Page Dashboard</h1>

      {/* First Row (3 components) */}
      <div className="flex flex-wrap lg:flex-nowrap p-4">
        <div className="w-full sm:w-1/2 lg:w-1/3 p-4 border border-gray-500">
          <FacebookPageDashboard />
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/3 p-4 border border-gray-500">
          <Voxdigify />
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/3 p-4 border border-gray-500">
          <Jurisprime />
        </div>
      </div>

      {/* Second Row (2 components) */}
      <div className="flex flex-wrap lg:flex-nowrap p-4">
        <div className="w-full sm:w-1/2 lg:w-1/2 p-4 border border-gray-500">
          <Documents />
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/2 p-4 border border-gray-500">
          <Visaprocessing />
        </div>
        <div className="w-full sm:w-1/2 lg:w-1/2 p-4 border border-gray-500">
          <Realestate />
        </div>
      </div>
<h1>InstagramData</h1>
      {/* Third Row (2 components) */}
      <div className="flex flex-wrap lg:flex-nowrap p-4">
        
        <div className="w-full sm:w-1/2 lg:w-1/2 p-4 border border-gray-500">
          <InstagramInsights />
        </div>
      </div>
    </>
  );
}
