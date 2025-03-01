import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { NavBar } from '../components/nav';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Lead = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: '',
    owner: '',
  });

  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const rowsPerPage = 10; // Define how many leads per page

  // Fetch leads from API
  const fetchLeads = async () => {
    try {
      const response = await axios.get('https://crm-deployment-five.vercel.app/api/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLead({ ...newLead, [name]: value });
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newLead.name &&
      newLead.company &&
      newLead.email &&
      newLead.phone &&
      newLead.source &&
      newLead.owner
    ) {
      try {
        const response = await axios.post('https://crm-deployment-five.vercel.app/api/leads', newLead);
        setLeads([response.data, ...leads]); // Add the new lead at the top
        setNewLead({
          name: '',
          company: '',
          email: '',
          phone: '',
          source: '',
          owner: '',
        });
      } catch (error) {
        console.error('Error adding lead:', error);
      }
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await axios.delete(`https://crm-deployment-five.vercel.app/api/leads/${id}`);
      setLeads(leads.filter((lead) => lead._id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  // Paginate leads: slice based on current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedLeads = leads.slice(startIndex, startIndex + rowsPerPage);

  const totalPages = Math.ceil(leads.length / rowsPerPage); // Calculate total number of pages

  const sourceCounts = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const chartData = {
    labels: Object.keys(sourceCounts),
    datasets: [
      {
        label: 'Leads by Source',
        data: Object.values(sourceCounts),
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      {/* <NavBar /> */}
      <div className="overflow-x-auto p-4 mt-[70px]">
        <h2 className="text-2xl font-bold mb-4">Leads Management</h2>

        {/* Lead Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Lead Name</th>
                <th className="px-4 py-2 border">Company</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Lead Source</th>
                <th className="px-4 py-2 border">Lead Owner</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map((lead) => (
                <tr key={lead._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2 border">{lead.name}</td>
                  <td className="px-4 py-2 border">{lead.company}</td>
                  <td className="px-4 py-2 border">{lead.email}</td>
                  <td className="px-4 py-2 border">{lead.phone}</td>
                  <td className="px-4 py-2 border">{lead.source}</td>
                  <td className="px-4 py-2 border">{lead.owner}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDeleteLead(lead._id)}
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
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Add New Lead Form */}
        <h3 className="font-bold mb-2">Add New Lead</h3>
        <form onSubmit={handleAddLead} className="flex flex-col space-y-2">
          <input
            type="text"
            name="name"
            value={newLead.name}
            onChange={handleInputChange}
            placeholder="Lead Name"
            className="border px-2 py-1"
          />
          <input
            type="text"
            name="company"
            value={newLead.company}
            onChange={handleInputChange}
            placeholder="Company"
            className="border px-2 py-1"
          />
          <input
            type="email"
            name="email"
            value={newLead.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="border px-2 py-1"
          />
          <input
            type="text"
            name="phone"
            value={newLead.phone}
            onChange={handleInputChange}
            placeholder="Phone"
            className="border px-2 py-1"
          />
          <input
            type="text"
            name="source"
            value={newLead.source}
            onChange={handleInputChange}
            placeholder="Lead Source"
            className="border px-2 py-1"
          />
          <input
            type="text"
            name="owner"
            value={newLead.owner}
            onChange={handleInputChange}
            placeholder="Lead Owner"
            className="border px-2 py-1"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-700">
            Add Lead
          </button>
        </form>

        {/* Analytical Graph */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">Leads by Source</h3>
          <div className="w-full sm:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto h-64">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </>
  );
};
