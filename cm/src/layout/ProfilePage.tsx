import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePictureUpload from '../components/profilepicture'; // Your upload component

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string; // Optional profile picture field
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // State for profile picture

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('You are not logged in!');
          return;
        }

        const response = await axios.get('http://localhost:5000/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setProfile(response.data);
          const storedProfilePicture = response.data.profilePicture || localStorage.getItem('profilePicture');
          setProfilePicture(storedProfilePicture);
        } else {
          toast.error('Failed to fetch profile data.');
        }
      } catch (error) {
        toast.error('Error fetching profile.');
        console.error(error);
      }
    };

    fetchProfileData();
  }, []);

  // Handle profile picture upload
  const handleUpload = async (imageUrl: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('You are not logged in!');
        return;
      }

      // Send the uploaded image URL to the backend
      const response = await axios.put(
        'http://localhost:5000/api/profile-picture',
        { profilePicture: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // After successful upload, update the profile picture
      if (response.data.profilePicture) {
        setProfilePicture(response.data.profilePicture);
        localStorage.setItem('profilePicture', response.data.profilePicture);
        toast.success('Profile picture updated successfully!');
      }
    } catch (error) {
      toast.error('Error uploading profile picture.');
      console.error(error);
    }
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile mt-[150px] mx-auto max-w-md p-4 shadow-lg bg-white rounded-lg">
              <h1><strong>Wellcome:</strong> {profile.name} on Voxdigify</h1>

      {/* Display profile picture */}
      <div className="profile-picture mb-4">
        <img
          src={profilePicture || 'https://via.placeholder.com/150'} // Default or uploaded image
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <ProfilePictureUpload onUpload={handleUpload} /> {/* Upload Component */}
      </div>

      {/* Display user profile details */}
      <div className="profile-details text-center">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        {/* <p><strong>Role:</strong> {profile.role}</p> */}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Profile;
