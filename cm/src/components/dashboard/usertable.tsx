import React from 'react';

// Define the User interface
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}
interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onRoleChange: (userId: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEdit, onDelete, onRoleChange }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user._id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button onClick={() => onEdit(user)}>Edit</button>
              <button onClick={() => onDelete(user._id)}>Delete</button>
              <button onClick={() => onRoleChange(user._id)}>Edit Role</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

