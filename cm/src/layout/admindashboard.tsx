import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

interface User {
  _id: string;  // Updated from 'id' to '_id'
  name: string;
  email: string;
  role: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // State to hold users
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null); // Logged-in admin details

  useEffect(() => {
    // Fetch the logged-in user from localStorage with added error handling
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setLoggedInUser(parsedUser);
      } catch (error) {
        console.error('Error parsing logged-in user:', error);
        toast.error('Failed to parse logged-in user data.');
      }
    }

    // Fetch all users from the backend
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken'); // JWT token
        if (!token) {
          toast.error('Authentication token is missing!');
          return;
        }

        const response = await axios.get('http://localhost:5000/auth/users/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const updateRole = async (userId: string, newRole: string) => {
    // Prevent admin from changing their own role
    if (loggedInUser?._id === userId) {
      toast.error('You cannot change your own role.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken'); // JWT token
      if (!token) {
        toast.error('Authentication token is missing!');
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/auth/user/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success('Role updated successfully');

        // Update the UI after role change
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? { ...user, role: newRole } : user))
        );
      }
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const deleteUser = async (userId: string) => {
    // Prevent admin from deleting their own profile
    if (loggedInUser?._id === userId) {
      toast.error('You cannot delete your own profile.');
      return;
    }

    try {
      const token = localStorage.getItem('authToken'); // JWT token
      if (!token) {
        toast.error('Authentication token is missing!');
        return;
      }

      const response = await axios.delete(`http://localhost:5000/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success('User deleted successfully');

        // Update the UI after deletion
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="p-4 mt-[80px]">
      <h1 className="text-xl font-bold mb-6">Admin Panel - Manage Users</h1>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-center">Role</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {users.map((user) => (
            <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{user.name}</td>
              <td className="py-3 px-6 text-left">{user.email}</td>
              <td className="py-3 px-6 text-center">{user.role}</td>
              <td className="py-3 px-6 text-center">
                {/* Only show update/delete options for admin users */}
                {loggedInUser?.role === 'admin' && (
                  <>
                    <select
                      className="border p-2 rounded"
                      value={user.role}
                      onChange={(e) => updateRole(user._id, e.target.value)} // Use _id here
                    >
                      <option value="client">Client</option>
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      className="ml-4 bg-red-500 text-white p-2 rounded"
                      onClick={() => deleteUser(user._id)} // Use _id here
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
};

export default AdminPanel;
