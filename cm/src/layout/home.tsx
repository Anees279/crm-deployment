
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import styles for ToastContainer
import { CallData } from './callsProps'; // Assuming the CallData component is imported
import MeetingsList from './meetingProps';
import ClientList from './accountProps';
import ContactList from './contactProps';
import LeadComponent from './leadProps';

function HomePage() {
  const [loggedInUserName, setLoggedInUserName] = useState<string>(''); // Only storing name
  const navigate = useNavigate();

  useEffect(() => {
    // Get the logged-in user's info from localStorage
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const userObject = JSON.parse(storedUser); // Parse the user object
      setLoggedInUserName(userObject.name); // Access and set the 'name' property
    } else {
      // If user is not logged in, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="p-4 mt-[80px]">
      {/* Welcome section */}
      <div className="mb-6 w-full">
        <div className="border p-4 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-center">
            Welcome {loggedInUserName} to VoxDigify
          </h1>
        </div>
      </div>

      {/* Components Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        <div className="border p-4 rounded-lg shadow-lg">
          <CallData />
        </div>
        <div className="border p-4 rounded-lg shadow-lg">
          <MeetingsList />
        </div>
        <div className="border p-4 rounded-lg shadow-lg">
          <ClientList />
        </div>
        <div className="border p-4 rounded-lg shadow-lg">
          <ContactList />
        </div>
        <div className="border p-4 rounded-lg shadow-lg">
          <LeadComponent />
        </div>
      </div>

      {/* Toast notifications container */}
      <ToastContainer />
    </div>
  );
}

export default HomePage;
