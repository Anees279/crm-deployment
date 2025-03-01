
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Img from '../assets/images/profile.webp'; // Default profile image

// Define the props interface for NavBar
interface NavBarProps {
  handleLogout: () => void; // Define handleLogout as a required prop
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const NavBar: React.FC<NavBarProps> = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null); // State for logged-in user
  const [profilePicture, setProfilePicture] = useState<string | null>(null); // State for profile picture

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Fetch logged-in user from localStorage
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }

    // Fetch profile picture from localStorage
    const storedProfilePicture = localStorage.getItem('profilePicture');
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    }
  }, []);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 shadow-md fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto flex justify-between ">
        <div className="w-10 rounded-full">
          <Link to="/">
            <img
              src={profilePicture ? profilePicture : Img} // Show uploaded image or default profile image
              alt="Profile"
              className="rounded-full w-10 h-10"
            />
          </Link>
        </div>

        {/* Hamburger button for mobile */}
        <button className="text-white block md:hidden" onClick={toggleMenu}>
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Links for desktop and mobile */}
        <ul className={`md:flex md:space-x-8 ${isOpen ? 'absolute top-16 left-0 w-full bg-blue-600' : 'hidden'} md:block space-y-4 md:space-y-0`}>
          {/* Admin has access to all routes */}
          {loggedInUser?.role === 'admin' && (
            <>
              <li><Link to="/HomePage" className="text-white hover:text-gray-300 block px-4 py-2">Home</Link></li>
              <li><Link to="/Lead" className="text-white hover:text-gray-300 block px-4 py-2">Leads</Link></li>
              <li><Link to="/contact" className="text-white hover:text-gray-300 block px-4 py-2">Contact</Link></li>
              <li><Link to="/services" className="text-white hover:text-gray-300 block px-4 py-2">Services</Link></li>
              <li><Link to="/account" className="text-white hover:text-gray-300 block px-4 py-2">Account</Link></li>
              <li><Link to="/call" className="text-white hover:text-gray-300 block px-4 py-2">Calls</Link></li>
              <li><Link to="/meeting" className="text-white hover:text-gray-300 block px-4 py-2">Meetings</Link></li>
              <li><Link to="/dashboard" className="text-white hover:text-gray-300 block px-4 py-2">Dashboard</Link></li>
              <li><Link to="/profile" className="text-white hover:text-gray-300 block px-4 py-2">Profile</Link></li>
              <li><Link to="/socialmedia" className="text-white hover:text-gray-300 block px-4 py-2">Social Media</Link></li>

            </>
          )}

          {/* Employee has access to all routes except home page and admin dashboard */}
          {loggedInUser?.role === 'employee' && (
            <>
              <li><Link to="/Lead" className="text-white hover:text-gray-300 block px-4 py-2">Leads</Link></li>
              <li><Link to="/contact" className="text-white hover:text-gray-300 block px-4 py-2">Contact</Link></li>
              <li><Link to="/services" className="text-white hover:text-gray-300 block px-4 py-2">Services</Link></li>
              <li><Link to="/account" className="text-white hover:text-gray-300 block px-4 py-2">Account</Link></li>
              <li><Link to="/call" className="text-white hover:text-gray-300 block px-4 py-2">Calls</Link></li>
              <li><Link to="/meeting" className="text-white hover:text-gray-300 block px-4 py-2">Meetings</Link></li>
              <li><Link to="/profile" className="text-white hover:text-gray-300 block px-4 py-2">Profile</Link></li>
            </>
          )}

          {/* Client can only access services and profile */}
          {loggedInUser?.role === 'client' && (
            <>
              <li><Link to="/services" className="text-white hover:text-gray-300 block px-4 py-2">Services</Link></li>
              <li><Link to="/profile" className="text-white hover:text-gray-300 block px-4 py-2">Profile</Link></li>
            </>
          )}

          {/* Logout Button */}
          <li>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300 bg-blue-500 hover:bg-blue-600 border border-blue-700 rounded-lg px-4 py-2"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
