import React, { useState } from 'react';
import axios from 'axios';

const RealestateUpload: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [postDetails, setPostDetails] = useState({
    title: '',
    description: '',
  }); // State for post details

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  // Handle post details input change
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPostDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission to upload files and post details
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFiles || selectedFiles.length === 0) {
      setUploadStatus('Please select at least one file.');
      return;
    }

    const formData = new FormData();

    // Append each file to the form data
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('mediaFile', selectedFiles[i]);
    }

    // Append the post details to the form data
    formData.append('title', postDetails.title);
    formData.append('description', postDetails.description);

    try {
      setUploading(true);
      setUploadStatus('');

      // Send POST request to the API to upload files and post details
      const response = await axios.post('http://localhost:5000/api/realestategpost/posts/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadStatus('Files and post details uploaded successfully!');
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus('Error uploading files and post details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Upload Media Files with Post Details Sfs International Real Estate
 
      </h1>

      <form onSubmit={handleUpload} className="w-full max-w-md space-y-4">
        <input
          type="file"
          name="mediaFile"
          multiple
          onChange={handleFileChange}
          className="mb-4 w-full p-2 border border-gray-300 rounded-md"
        />

        <input
          type="text"
          name="title"
          placeholder="Enter post title"
          value={postDetails.title}
          onChange={handleDetailsChange}
          className="p-2 border border-gray-300 rounded-md w-full"
        />

        <input
          type="text"
          name="description"
          placeholder="Enter post description"
          value={postDetails.description}
          onChange={handleDetailsChange}
          className="p-2 border border-gray-300 rounded-md w-full"
        />

        <button
          type="submit"
          className={`p-2 rounded-md w-full bg-blue-500 text-white ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Files and Post Details'}
        </button>
      </form>

      {uploadStatus && <p className="mt-4 text-center">{uploadStatus}</p>}
    </div>
  );
};

export default RealestateUpload;
