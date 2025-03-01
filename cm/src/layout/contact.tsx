 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavBar } from '../components/nav';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Contact = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [newContact, setNewContact] = useState({
    contactName: '',
    accountName: '',
    email: '',
    phone: '',
    owner: '',
  });
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const rowsPerPage = 10;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch contacts from the API
    const fetchContacts = async () => {
      try {
        const response = await axios.get('https://crm-deployment-five.vercel.app/api/contacts');
        const sortedData = response.data.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // Sort by most recent
        );
        setContacts(sortedData);
      } catch (err) {
        setError('Error fetching contacts');
      }
    };

    fetchContacts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newContact.contactName && newContact.accountName && newContact.email && newContact.phone && newContact.owner) {
      try {
        const response = await axios.post('https://crm-deployment-five.vercel.app/api/contacts', newContact);
        setContacts([response.data, ...contacts]); // Add the new contact at the top
        setNewContact({
          contactName: '',
          accountName: '',
          email: '',
          phone: '',
          owner: '',
        });
      } catch (err) {
        setError('Error adding contact');
      }
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await axios.delete(`https://crm-deployment-five.vercel.app/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (err) {
      setError('Error deleting contact');
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = contacts.slice(indexOfFirstRow, indexOfLastRow);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(contacts.length / rowsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Data for the pie chart
  const ownerCounts = contacts.reduce((acc, contact) => {
    acc[contact.owner] = (acc[contact.owner] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = {
    labels: Object.keys(ownerCounts),
    datasets: [
      {
        label: 'Contacts by Owner',
        data: Object.values(ownerCounts),
        backgroundColor: ['rgba(255, 159, 64, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
    {/* <NavBar /> */}
    <div className="overflow-x-auto p-4 w-full mt-[70px]">
      <h2 className="text-2xl font-bold mb-4 text-center">Contacts Management</h2>
      {error && <div className="text-red-500">{error}</div>}

      {/* Contact Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border text-left">Contact Name</th>
              <th className="px-4 py-2 border text-left">Account Name</th>
              <th className="px-4 py-2 border text-left">Email</th>
              <th className="px-4 py-2 border text-left">Phone</th>
              <th className="px-4 py-2 border text-left">Contact Owner</th>
              <th className="px-4 py-2 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((contact, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2 border">{contact.contactName}</td>
                <td className="px-4 py-2 border">{contact.accountName}</td>
                <td className="px-4 py-2 border">{contact.email}</td>
                <td className="px-4 py-2 border">{contact.phone}</td>
                <td className="px-4 py-2 border">{contact.owner}</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={() => handleDeleteContact(contact._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`mx-1 px-2 py-1 ${currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {number}
          </button>
        ))}
      </div>

      {/* Add New Contact Form */}
      <form onSubmit={handleAddContact} className="space-y-4">
        <input
          type="text"
          name="contactName"
          value={newContact.contactName}
          onChange={handleInputChange}
          placeholder="Contact Name"
          className="border px-4 py-2 w-full rounded-md"
        />
        <input
          type="text"
          name="accountName"
          value={newContact.accountName}
          onChange={handleInputChange}
          placeholder="Account Name"
          className="border px-4 py-2 w-full rounded-md"
        />
        <input
          type="email"
          name="email"
          value={newContact.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="border px-4 py-2 w-full rounded-md"
        />
        <input
          type="text"
          name="phone"
          value={newContact.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          className="border px-4 py-2 w-full rounded-md"
        />
        <input
          type="text"
          name="owner"
          value={newContact.owner}
          onChange={handleInputChange}
          placeholder="Contact Owner"
          className="border px-4 py-2 w-full rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 w-full rounded-md hover:bg-blue-700 mt-4"
        >
          Add Contact
        </button>
      </form>

      {/* Pie Chart */}
      <div className="mt-6 lg:mt-0 lg:px-0 lg:py-0 px-4 py-6">
        <h3 className="text-xl font-bold mb-2">Contacts by Owner</h3>
        <div className="w-full lg:w-full h-96">
          <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
    </>

  );
};
