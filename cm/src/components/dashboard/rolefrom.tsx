
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// interface RoleFormProps {
//   userId?: string; // Optional user ID if editing an existing user role
//   currentRole?: string; // Current role if editing a user
//   onSave: (role: string, userId?: string) => void; // Callback to notify parent component about role changes
// }

// const RoleForm: React.FC<RoleFormProps> = ({ userId, currentRole, onSave }) => {
//   const [role, setRole] = useState<string>(currentRole || ''); // State to hold the role selected
//   const [loading, setLoading] = useState<boolean>(false); // State for loading status
//   const [error, setError] = useState<string | null>(null); // State for any error

//   useEffect(() => {
//     if (userId) {
//       fetchUserRole(userId);
//     }
//   }, [userId]);

//   const fetchUserRole = async (userId: string) => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('No token found');
//         return;
//       }

//       const response = await axios.get(`http://localhost:5000/auth/profile ${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setRole(response.data.role);
//     } catch (err) {
//       setError('Failed to fetch user role');
//     }
//   };

//   const handleDelete = async () => {
//     if (!userId) return;

//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('No token found');
//         setLoading(false);
//         return;
//       }

//       await axios.delete(`http://localhost:5000/auth/profile${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setLoading(false);
//       onSave('', userId); // Notify parent of the deletion
//     } catch (err) {
//       setLoading(false);
//       setError('Failed to delete user role');
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     if (!role) {
//       setError('Please select a role');
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError('No token found');
//         setLoading(false);
//         return;
//       }

//       await axios.put(
//         `http://localhost:5000/auth/profile${userId}`,
//         {
//           userId, // Send the userId if we are editing
//           role, // Send the new role
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setLoading(false);
//       onSave(role, userId); // Call the callback to inform parent of the role change
//       setRole(''); // Reset role input
//       setError(null); // Clear error if successful
//     } catch (err) {
//       setLoading(false);
//       setError('Failed to save role');
//     }
//   };

//   return (
//     <div>
//       <h2>{userId ? 'Edit User Role' : 'Assign Role'}</h2>
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="role">Select Role:</label>
//         <select
//           id="role"
//           value={role}
//           onChange={(e) => setRole(e.target.value)}
//         >
//           <option value="">Select Role</option>
//           <option value="admin">Admin</option>
//           <option value="user">User</option>
//           <option value="manager">Manager</option>
//         </select>

//         <button type="submit" disabled={loading}>
//           {loading ? 'Saving...' : 'Save Role'}
//         </button>
//         {userId && (
//           <button type="button" onClick={handleDelete} disabled={loading}>
//             {loading ? 'Deleting...' : 'Delete Role'}
//           </button>
//         )}
//       </form>
//     </div>
//   );
// };

// export default RoleForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface RoleFormProps {
  userId?: string; // Optional user ID if editing an existing user role
  currentRole?: string; // Current role if editing a user
  onSave: (role: string, userId?: string) => void; // Callback to notify parent component about role changes
}

const RoleForm: React.FC<RoleFormProps> = ({ userId, currentRole, onSave }) => {
  const [role, setRole] = useState<string>(currentRole || ''); // State to hold the role selected
  const [loading, setLoading] = useState<boolean>(false); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for any error

  useEffect(() => {
    if (userId) {
      fetchUserRole(userId);
    }
  }, [userId]);

  const fetchUserRole = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        return;
      }

      const response = await axios.get(`http://localhost:5000/auth/profile/role/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRole(response.data.role);
    } catch (err) {
      console.error('Failed to fetch user role:', err);
      setError('Failed to fetch user role');
    }
  };

  const handleDelete = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      await axios.delete(`http://localhost:5000/auth/profile/role/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      onSave('', userId); // Notify parent of the deletion
    } catch (err) {
      console.error('Failed to delete user role:', err);
      setLoading(false);
      setError('Failed to delete user role');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!role) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found');
        setLoading(false);
        return;
      }

      await axios.put(
        `http://localhost:5000/auth/profile/role`,
        {
          userId, // Send the userId if we are editing
          role, // Send the new role
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      onSave(role, userId); // Call the callback to inform parent of the role change
      setRole(''); // Reset role input
      setError(null); // Clear error if successful
    } catch (err) {
      console.error('Failed to save role:', err);
      setLoading(false);
      setError('Failed to save role');
    }
  };

  return (
    <div>
      <h2>{userId ? 'Edit User Role' : 'Assign Role'}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="role">Select Role:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="manager">Manager</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Role'}
        </button>
        {userId && (
          <button type="button" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Role'}
          </button>
        )}
      </form>
    </div>
  );
};

export default RoleForm;