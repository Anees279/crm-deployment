import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Define the type for the component's props
interface ProfilePictureUploadProps {
  onUpload: (imageUrl: string) => Promise<void>; // Expecting a function prop
}

// Type for the event in the file input change handler
const handleProfilePictureUpload = async (
  event: React.ChangeEvent<HTMLInputElement>, 
  onUpload: ProfilePictureUploadProps['onUpload']
) => {
  const file = event.target.files?.[0]; // Get the first selected file
  if (!file) return;

  const formData = new FormData();
  formData.append('profilePicture', file); // Append the file

  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('No authorization token found');
      return;
    }

    // Perform the file upload to the server
    const response = await axios.put('https://crm-deployment-five.vercel.app/api/profile-picture', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Assuming the server responds with the URL of the uploaded image
    const imageUrl = response.data.imageUrl;
    await onUpload(imageUrl); // Call the onUpload function with the uploaded image URL
    toast.success('Profile picture updated successfully!');
  } catch (error) {
    toast.error('Error uploading profile picture.');
    console.error(error);
  }
};

// ProfilePictureUpload component
const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ onUpload }) => {
  return (
    <div>
      <h3>Upload Profile Picture</h3>
      <input 
        type="file" 
        onChange={(event) => handleProfilePictureUpload(event, onUpload)} 
        accept="image/*" 
        className="upload-input" 
      />
    </div>
  );
};

export default ProfilePictureUpload;
